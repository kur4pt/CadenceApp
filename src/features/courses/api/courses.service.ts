import { supabase } from '../../../lib/supabase/client'
import type { Database } from '../../../lib/database'

export type Course = Database['public']['Tables']['courses']['Row']
export type CreateCourseInput = Pick<Course, 'name'> & Partial<Pick<Course, 'code' | 'instructor' | 'semester_id'>>
export type UpdateCourseInput = Partial<CreateCourseInput>

function validateId(id: string) {
    if (typeof id !== 'string' || !/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)) {
        throw new Error('A valid UUID is required')
    }
}

function validateInput(input: UpdateCourseInput, creating = false) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
        throw new Error('Course details are required')
    }

    const values: UpdateCourseInput = {}
    if (creating || input.name !== undefined) {
        if (typeof input.name !== 'string' || !input.name.trim()) {
            throw new Error('Course name is required')
        }
        values.name = input.name.trim()
    }

    for (const field of ['code', 'instructor'] as const) {
        const value = input[field]
        if (value !== undefined) {
            if (value !== null && typeof value !== 'string') {
                throw new Error(`Course ${field} must be text or null`)
            }
            values[field] = value?.trim() || null
        }
    }

    if (input.semester_id !== undefined) {
        if (input.semester_id !== null) validateId(input.semester_id)
        values.semester_id = input.semester_id
    }

    if (!Object.keys(values).length) {
        throw new Error('No course changes provided')
    }
    
    return values
}

async function currentUserId() {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    if (!data.user) throw new Error('Sign in to mange courses.')
    return data.user.id
}

export const coursesService = {
    async list(): Promise<Course[]> {
        const userId = await currentUserId()
        const { data, error } = await supabase.from('courses')
            .select('*').eq('user_id', userId).order('name').order('id')
            .returns<Course[]>()
        if (error) throw error
        return data
    },

    async create(input: CreateCourseInput): Promise<Course> {
        const values = validateInput(input, true)
        const userId = await currentUserId()
        const { data, error } = await supabase.from('courses')
            .insert({ ...values, user_id: userId }).select('*').single<Course>()
        if (error) throw error
        return data
    },

    async update(id: string, input: UpdateCourseInput): Promise<Course> {
        validateId(id)
        const values = validateInput(input)
        const userId = await currentUserId()
        const { data, error } = await supabase.from('courses')
            .update(values).eq('id', id).eq('user_id', userId)
            .select('*').single<Course>()
        if (error) throw error
        return data
    },

    async delete(id: string): Promise<void> {
        validateId(id)
        const userId = await currentUserId()
        const { error } = await supabase.from('courses')
            .delete().eq('id', id).eq('user_id', userId).select('id').single()
        if (error) throw error
    }
}