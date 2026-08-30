import { ClipboardCheck } from 'lucide-react'
import { PageHeading } from '../components/ui/PageHeading'
import { EmptyState } from '../components/ui/EmptyState'

export function AssignmentsPage() {
    return (    
        <>
        <PageHeading title='Assignments' description='Track due dates, completion state, and scheduled work blocks.'/>
            <EmptyState icon={ClipboardCheck} title='No assignments yet' description='Assignment will be at attachable to courses and surfaced in the urgency systems.'/>
        </>
    )
}