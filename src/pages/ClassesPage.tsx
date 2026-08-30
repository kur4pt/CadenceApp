import { BookOpen } from 'lucide-react'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeading } from '../components/ui/PageHeading'

export function ClassesPage () {
    return (
        <>
        <PageHeading title='Classes' description='Course records and recurring class meetings will live here.'/>
        <EmptyState icon={BookOpen} title='No classes yet.' description='Manual class creation is part of the next milestone, followed by verified import from upload schedules.'/>
        </>
    )
}