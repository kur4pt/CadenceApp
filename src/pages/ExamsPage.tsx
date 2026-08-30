import { GraduationCap } from 'lucide-react'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeading } from '../components/ui/PageHeading'

export function ExamsPage () {
    return (
        <>
        <PageHeading title='Exams' description='Exam dates, locations, and syllabus-derived context will be kept sepreately from ordinary class meetings.'/>
        <EmptyState icon={GraduationCap} title="No exams yet" description='Later, syllabus parsing will create draft exam records that require student verification.'/>
        </>
    )
}