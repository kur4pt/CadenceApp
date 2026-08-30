import { PageHeading } from '../components/ui/PageHeading'
import { WeekCalendar } from '../features/calendar/WeekCalendar'

export function CalendarPage() {
    return (
        <>
            <PageHeading title='Calendar' description='The week view is the primary scheduling surface. Drag, resize, and recurrence controls land in the next milestone.'/>
            <WeekCalendar/>
        </>
    )
}