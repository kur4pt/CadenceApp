import assert from 'node:assert/strict'
import { createServer, loadEnv } from 'vite'

const validationOnly = process.argv.includes('--validation-only')
const env = loadEnv('development', process.cwd(), '')

if (!validationOnly) {
  for (const account of ['A', 'B']) {
    for (const field of ['EMAIL', 'PASSWORD']) {
      assert.ok(env[`COURSES_TEST_${field}_${account}`],
        `Set COURSES_TEST_${field}_${account} in your local env file.`,
      )
    }
  }
}

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
const createdCourses = []

async function signIn(account) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: env[`COURSES_TEST_EMAIL_${account}`],
    password: env[`COURSES_TEST_PASSWORD_${account}`],
  })

  if (error) throw error
  return data.user.id
}

const id = '11111111-1111-4111-8111-111111111111'

const details = {
  course_id: id,
  weekday: 1,
  starts_at: '09:00',
  ends_at: '10:30',
  timezone: 'America/Los_Angeles',
  starts_on: '2026-01-01',
  ends_on: '2026-12-31',
  location: ' Room 204 ',
}

try {
  const { meetingsService: service } = await server.ssrLoadModule('/src/features/meetings/api/meetings.service.ts',)
    ;({ supabase } = await server.ssrLoadModule('/src/lib/supabase/client.ts',))
  const { coursesService } = await server.ssrLoadModule('/src/features/courses/api/courses.service.ts',)

  const originalFetch = globalThis.fetch
  let networkCalls = 0

  globalThis.fetch = async () => {networkCalls++
    throw new Error('Unexpected network request')
  }

  try {
    for (const [patch, expected] of [
      [{ weekday: -1 }, /Weekday/],
      [{ weekday: 7 }, /Weekday/],
      [{ weekday: 1.5 }, /Weekday/],
      [{ weekday: '1' }, /Weekday/],
      [{ starts_at: '24:00' }, /times/],
      [{ starts_at: '9:00' }, /times/],
      [{ ends_at: '10:30:01' }, /times/],
      [{ starts_at: '10:30' }, /after start/],
      [{ ends_at: '08:00' }, /after start/],
      [{ starts_on: '2026-02-30' }, /dates/],
      [{ starts_on: '0000-01-01' }, /dates/],
      [{ ends_on: '2025-12-31' }, /end date/],
      [{ timezone: 'Mars/Olympus' }, /timezone/],
      [{ timezone: '+02:00' }, /timezone/],
      [{ location: 42 }, /location/i],
    ]) {
      await assert.rejects(
        () => service.create({ ...details, ...patch }),
        expected,
      )
      await assert.rejects(
        () => service.update(id, { ...details, ...patch }),
        expected,
      )
    }

    await assert.rejects(() => service.create(null), /details/)
    await assert.rejects(() => service.update(id, {}), /Weekday/)
    await assert.rejects(
      () => service.create({ ...details, course_id: 'bad' }),
      /UUID/,
    )
    await assert.rejects(() => service.list('bad'), /UUID/)
    await assert.rejects(() => service.delete('bad'), /UUID/)
    await assert.rejects(
      () => service.today(new Date('bad')),
      /valid date/,
    )

    assert.equal(networkCalls, 0)
  } finally {
    globalThis.fetch = originalFetch
  }

  console.log('PASS: meeting validation without network requests.')

  if (!validationOnly) {
    const ownerA = await signIn('A')
    const courseA = await coursesService.create({
      name: 'Meeting integration check A',
    })

    createdCourses.push(['A', courseA.id])

    const input = { ...details, course_id: courseA.id }
    const meeting = await service.create(input)

    assert.equal(meeting.location, 'Room 204')
    assert.equal(meeting.starts_at, '09:00:00')

    await signIn('A')

    assert.ok(
      (await service.list(courseA.id)).some(row => row.id === meeting.id),
    )

    const updated = await service.update(meeting.id, {
      ...meeting,
      location: ' Lab 3 ',
    })

    assert.equal(updated.location, 'Lab 3')
    assert.ok(
      Date.parse(updated.updated_at) >= Date.parse(meeting.updated_at),
    )

    // Monday morning stays at 9 AM across daylight-saving time.
    for (const [at, start] of [
      ['2026-03-02T20:00:00Z', '2026-03-02T17:00:00Z'],
      ['2026-03-09T20:00:00Z', '2026-03-09T16:00:00Z'],
      ['2026-11-02T20:00:00Z', '2026-11-02T17:00:00Z'],
      ['2026-09-08T01:00:00Z', '2026-09-07T16:00:00Z'],
    ]) {
      const occurrence = (await service.today(new Date(at))).find(
        row => row.id === meeting.id,
      )

      assert.ok(occurrence, `Missing meeting at ${at}`)
      assert.equal(Date.parse(occurrence.starts_at), Date.parse(start))
      assert.equal(
        Date.parse(occurrence.ends_at) - Date.parse(occurrence.starts_at),
        90 * 60_000,
      )
      assert.equal(occurrence.course_name, courseA.name)
    }

    for (const at of [
      '2026-09-08T08:00:00Z',
      '2027-01-04T20:00:00Z',
    ]) {
      assert.ok(
        !(await service.today(new Date(at))).some(
          row => row.id === meeting.id,
        ),
      )
    }

    await service.update(meeting.id, {
      ...input,
      starts_on: '2026-09-07',
      ends_on: '2026-09-07',
    })

    assert.ok(
      (await service.today(new Date('2026-09-07T20:00:00Z'))).some(
        row => row.id === meeting.id,
      ),
    )
    assert.ok(
      !(await service.today(new Date('2026-09-14T20:00:00Z'))).some(
        row => row.id === meeting.id,
      ),
    )

    const ownerB = await signIn('B')
    assert.notEqual(ownerA, ownerB, 'Use different test accounts.')

    const courseB = await coursesService.create({
      name: 'Meeting integration check B',
    })

    createdCourses.push(['B', courseB.id])

    assert.deepEqual(await service.list(courseA.id), [])
    await assert.rejects(() => service.create(input))
    await assert.rejects(() => service.update(meeting.id, input))
    await assert.rejects(() => service.delete(meeting.id))

    assert.ok(
      !(await service.today(new Date('2026-09-07T20:00:00Z'))).some(
        row => row.id === meeting.id,
      ),
    )

    for (const request of [
      () =>
        supabase
          .from('course_meetings')
          .select('*')
          .eq('id', meeting.id),
      () =>
        supabase
          .from('course_meetings')
          .update({ location: 'Forbidden' })
          .eq('id', meeting.id)
          .select(),
      () =>
        supabase
          .from('course_meetings')
          .delete()
          .eq('id', meeting.id)
          .select(),
    ]) {
      const { data, error } = await request()

      assert.ifError(error)
      assert.deepEqual(data, [], 'RLS exposed another account’s meeting.')
    }

    await signIn('A')

    for (const patch of [
      { course_id: courseB.id },
      { weekday: 7 },
      { ends_at: '08:00' },
      { ends_on: '2025-01-01' },
      { timezone: 'Mars/Olympus' },
      { starts_at: '09:00:01' },
    ]) {
      const { error } = await supabase
        .from('course_meetings')
        .update(patch)
        .eq('id', meeting.id)

      assert.ok(error, `Database accepted ${JSON.stringify(patch)}`)
    }

    assert.equal(
      (await service.list(courseA.id))[0].course_id,
      courseA.id,
    )

    await service.delete(meeting.id)
    await assert.rejects(() => service.delete(meeting.id))
    assert.deepEqual(await service.list(courseA.id), [])

    const cascade = await service.create(input)
    await coursesService.delete(courseA.id)

    const remaining = await supabase
      .from('course_meetings')
      .select('*')
      .eq('id', cascade.id)

    assert.ifError(remaining.error)
    assert.deepEqual(remaining.data, [])

    await supabase.auth.signOut({ scope: 'local' })
    await assert.rejects(() => service.list(courseA.id))

    for (const request of [
      () => supabase.from('course_meetings').select('*'),
      () => supabase.rpc('today_course_meetings'),
    ]) {
      const { data, error } = await request()

      assert.ok(
        error || data.length === 0,
        'Anonymous access exposed meetings.',
      )
    }

    console.log(
      'PASS: meeting persistence, Today, DST, date boundaries, ownership, deletion and anonymous access.',
    )
  }
} finally {
  try {
    for (const [account, courseId] of createdCourses) {
      await signIn(account)

      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)

      if (error) throw error
    }
  } finally {
    if (supabase) await supabase.auth.signOut({ scope: 'local' })
    await server.close()
  }
}