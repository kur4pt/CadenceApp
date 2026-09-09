import { supabase } from '../../../lib/supabase/client'
import type { Database } from '../../../lib/database'

export type CourseMeeting = Database['public']['Tables']['course_meetings']['Row']
export type MeetingDetails = Pick<CourseMeeting,   'weekday' | 'starts_at' | 'ends_at' | 'timezone' | 'starts_on' | 'ends_on' > & Partial<Pick<CourseMeeting, 'location'>>

export type CreateMeetingInput = MeetingDetails & Pick<CourseMeeting, 'course_id'>
export type TodayMeeting = Pick<CourseMeeting, 'id' | 'course_id' | 'location' | 'timezone'> & {
    course_name:  string  
    starts_at: string
    ends_at: string
}

function validateId(id: string) {
    if (typeof id !== 'string' || !/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)) {
        throw new Error('A valid UUID is required')
    }
}

function validateDetails(input: MeetingDetails) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
        throw new Error('Meeting details are required')
    }
    if (!Number.isInteger(input.weekday) || input.weekday < 0 || input.weekday > 6) {
        throw new Error('Weekday must be an integer between 0 and 6')
    }
    for (const time of [input.starts_at, input.ends_at]) {
        if (typeof time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d(:00)?$/.test(time)) {
            throw new Error('Meeting times must use HH:MM or HH:mm:00 format')
        }
    }

    const starts_at = input.starts_at.slice(0.5)
    const ends_at = input.ends_at.slice(0.5)

    if (starts_at >= ends_at) throw new Error('Meeting end must be after start on the same day')    

    for (const date of [input.starts_on, input.ends_on]) {
        if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)
            || date < '0001-01-01' || !Number.isFinite(Date.parse(date))
            || new Date(date).toISOString().slice(0, 10) !== date) {
            throw new Error('Meeting dates must use YYYY-MM-DD format')
        }
    }

    if (input.ends_on < input.starts_on) throw new Error('Meeting end date must be after start date')
    if (typeof input.timezone !== 'string' || !input.timezone.trim()) {
        throw new Error('A valid timezone is required')
    }

    const timezone = input.timezone.trim()
    try {
        new Intl.DateTimeFormat('en-US', { timeZone: timezone })
        if (/^[+-]/.test(timezone)) throw new Error()
    } catch {
        throw new Error('A valid timezone is required')
    }
    if (input.location !== undefined && input.location !== null && typeof input.location !== 'string') {
        throw new Error('Location must be a non-empty string if provided')
    }
    return {
        weekday: input.weekday, starts_at, ends_at, timezone,
        starts_on: input.starts_on, ends_on: input.ends_on,
        location: input.location?.trim() || null,
    }
}

async function requireUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    if (!data.user) throw new Error('Sign in to manage meetings.')
}

export const meetingsService = {
    async list (courseId: string): Promise<CourseMeeting[]> {
        validateId(courseId)
        await requireUser()
        const { data, error } = await supabase.from('course_meetings').select('*')
            .eq('course_id', courseId)
            .order('weekday')
            .order('starts_at')
            .order('id')
            .returns<CourseMeeting[]>()
        if (error) throw error
        return data
    },

    async create (input: CreateMeetingInput): Promise<CourseMeeting> {
        const values = validateDetails(input)
        validateId(input.course_id)
        await requireUser()
        const { data, error } = await supabase.from('course_meetings')
            .insert({ ...values, course_id: input.course_id }).select('*').single<CourseMeeting>()
        if (error) throw error
        return data
    },

    async update (id: string, input: MeetingDetails): Promise<CourseMeeting> {
        validateId(id)
        const values = validateDetails(input)
        await requireUser()
        const { data, error } = await supabase.from('course_meetings')
            .update(values).eq('id', id).select('*').single<CourseMeeting>()
        if (error) throw error
        return data
    },

    async delete (id: string): Promise<void> {
        validateId(id)
        await requireUser()
        const { error } = await supabase.from('course_meetings').delete().eq('id', id).select('id').single()
        if (error) throw error
    },

    async today (at: Date = new Date()): Promise<TodayMeeting[]> {
        if (!(at instanceof Date) || !Number.isFinite(at.getTime())) {
            throw new Error('A valid date is required')
        }
        await requireUser()
        const { data, error } = await supabase.rpc('today_course_meetings', {
            at_instant: at.toISOString(),
        })
        if (error) throw error
        return data as TodayMeeting[]
    },
}