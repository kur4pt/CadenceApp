import assert from 'node:assert/strict'
import { createServer, loadEnv } from 'vite'

const validationOnly = process.argv.includes('--validation-only')
const env = loadEnv('development', process.cwd(), '')

if (!validationOnly) {
  for (const key of [
    'COURSES_TEST_EMAIL_A',
    'COURSES_TEST_PASSWORD_A',
    'COURSES_TEST_EMAIL_B',
    'COURSES_TEST_PASSWORD_B',
  ]) {
    assert.ok(
      env[key],
      `Set ${key} in .env.local; use two dedicated test accounts.`,
    )
  }
}

// Load the actual service using the existing Vite dependency.
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true },
  define: validationOnly
    ? {
        'import.meta.env.VITE_SUPABASE_URL':
          JSON.stringify('http://127.0.0.1:54321'),
        'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY':
          JSON.stringify('validation-only'),
      }
    : {},
})

let supabase
let coursesService
let courseId
let semesterId

async function signIn(account) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: env[`COURSES_TEST_EMAIL_${account}`],
    password: env[`COURSES_TEST_PASSWORD_${account}`],
  })

  if (error) throw error
  return data.user.id
}

try {
  ;({ coursesService } = await server.ssrLoadModule(
    '/src/features/courses/api/courses.service.ts',
  ))
  ;({ supabase } = await server.ssrLoadModule(
    '/src/lib/supabase/client.ts',
  ))

  const id = '11111111-1111-4111-8111-111111111111'

  for (const name of ['', ' \n\t ', null, 42]) {
    await assert.rejects(
      () => coursesService.create({ name }),
      /Course name is required/,
    )
  }

  await assert.rejects(
    () => coursesService.create(null),
    /Course details/,
  )
  await assert.rejects(
    () => coursesService.create({ name: 'Math', code: 42 }),
    /code must be text/,
  )
  await assert.rejects(
    () => coursesService.create({ name: 'Math', semester_id: 'bad' }),
    /UUID/,
  )
  await assert.rejects(
    () => coursesService.update(id, {}),
    /No course changes/,
  )
  await assert.rejects(
    () => coursesService.update(id, { user_id: id }),
    /No course changes/,
  )
  await assert.rejects(
    () => coursesService.update(id, { name: ' ' }),
    /Course name is required/,
  )
  await assert.rejects(
    () => coursesService.delete('bad'),
    /UUID/,
  )

  console.log('PASS: input validation (no database calls).')

  if (!validationOnly) {
    const ownerA = await signIn('A')
    const course = await coursesService.create({
      name: '  Course integration check  ',
      code: ' TEST ',
      user_id: id,
    })

    courseId = course.id
    assert.equal(course.user_id, ownerA)
    assert.equal(course.name, 'Course integration check')
    assert.equal(course.code, 'TEST')

    // Log in again and retrieve saved data.
    await signIn('A')
    assert.ok(
      (await coursesService.list()).some(row => row.id === courseId),
    )

    const updated = await coursesService.update(courseId, {
      name: 'Updated course',
      code: '',
      instructor: ' Teacher ',
    })

    assert.equal(updated.name, 'Updated course')
    assert.equal(updated.code, null)
    assert.equal(updated.instructor, 'Teacher')
    assert.ok(
      Date.parse(updated.updated_at) >= Date.parse(course.updated_at),
    )

    const ownerB = await signIn('B')
    assert.notEqual(ownerA, ownerB, 'Use two different accounts.')
    assert.ok(
      !(await coursesService.list()).some(row => row.id === courseId),
    )
    await assert.rejects(
      () => coursesService.update(courseId, { name: 'Forbidden' }),
    )
    await assert.rejects(() => coursesService.delete(courseId))

    // Bypass service filters to test database RLS directly.
    for (const request of [
      () => supabase.from('courses').select('*').eq('id', courseId),
      () =>
        supabase
          .from('courses')
          .update({ name: 'Forbidden' })
          .eq('id', courseId)
          .select(),
      () =>
        supabase
          .from('courses')
          .delete()
          .eq('id', courseId)
          .select(),
    ]) {
      const { data, error } = await request()
      assert.ok(
        error || data.length === 0,
        "RLS exposed another account's course.",
      )
    }

    const forged = await supabase.from('courses').insert({
      name: 'Forbidden',
      user_id: ownerA,
    })
    assert.ok(forged.error, 'RLS allowed forged ownership.')

    const semester = await supabase
      .from('semesters')
      .insert({
        user_id: ownerB,
        name: 'Course integration check',
      })
      .select('id')
      .single()

    if (semester.error) throw semester.error
    semesterId = semester.data.id

    await signIn('A')

    const blank = await supabase
      .from('courses')
      .update({ name: '\t\n ' })
      .eq('id', courseId)
    assert.ok(blank.error, 'Database accepted a blank name.')

    const transfer = await supabase
      .from('courses')
      .update({ user_id: ownerB })
      .eq('id', courseId)
    assert.ok(transfer.error, 'RLS allowed ownership transfer.')

    await assert.rejects(
      () => coursesService.update(courseId, { semester_id: semesterId }),
    )

    const linked = await supabase
      .from('courses')
      .update({ semester_id: semesterId })
      .eq('id', courseId)
    assert.ok(
      linked.error,
      "RLS allowed linking another account's semester.",
    )

    assert.equal(
      (await coursesService.list()).find(row => row.id === courseId)?.name,
      'Updated course',
    )

    await coursesService.delete(courseId)
    assert.ok(
      !(await coursesService.list()).some(row => row.id === courseId),
    )
    await assert.rejects(() => coursesService.delete(courseId))
    courseId = undefined

    const { error } = await supabase.auth.signOut()
    if (error) throw error

    await assert.rejects(() => coursesService.list())

    const anonymous = await supabase.from('courses').select('*')
    assert.ok(
      anonymous.error || anonymous.data.length === 0,
      'Anonymous access exposed courses.',
    )

    console.log(
      'PASS: course lifecycle, persistence, ownership, semester ownership, and anonymous access.',
    )
  }
} finally {
  try {
    if (courseId) {
      await signIn('A')
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)
      if (error) throw error
    }

    if (semesterId) {
      await signIn('B')
      const { error } = await supabase
        .from('semesters')
        .delete()
        .eq('id', semesterId)
      if (error) throw error
    }
  } finally {
    if (supabase) await supabase.auth.signOut({ scope: 'local' })
    await server.close()
  }
}