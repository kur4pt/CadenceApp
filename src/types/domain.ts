export type EventKind = 'class' | 'exam' | 'assignment' | 'office_hours' | 'study' | 'personal'
export type EventStatus = 'draft' | 'needs_review' | 'confirmed' | 'ignored'

export type CalendarEvent = {
  id: string
  userId: string
  courseId?: string | null
  kind: EventKind
  title: string
  description?: string | null
  location?: string | null
  startsAt: string
  endsAt?: string | null
  status: EventStatus
  sourceUploadId?: string | null
  createdAt: string
  updatedAt: string
}

export type ParsedScheduleItem = {
  id: string
  title: string
  type: EventKind
  startDate?: string
  endDate?: string
  startTime?: string
  endTime?: string
  days?: string[]
  location?: string
  professor?: string
  courseCode?: string
  confidence: number
  missingFields: string[]
  sourceText?: string
  status: 'needs_review' | 'ready' | 'confirmed' | 'ignored'
}
