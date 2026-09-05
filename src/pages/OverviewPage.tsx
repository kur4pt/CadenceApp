import { CalendarCheck2, FileUp, Sparkles } from 'lucide-react'
import { UrgentCard } from '../features/dashboard/UrgentCard'
import { TodaySchedule } from '../features/dashboard/TodaySchedule'
import { PageHeading } from '../components/ui/PageHeading'

export function OverviewPage() {
    return (
        <>
            <PageHeading title="Good afternoon." description='Your academic day,  deadlines, and all important scedule will converage here.'/>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
                <TodaySchedule />
                <UrgentCard />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
                {[
                    { icon: FileUp,         title: 'Import Syllabus', copy: 'Drop a PDF or image. Cadence will extract draft academic events for review' },
                    { icon: CalendarCheck2, title: 'Verify schedule', copy: 'Nothing reaches the caonical calendar until you confirm the extracted details.' },
                    { icon: Sparkles,       title: 'Urgency engine',  copy: 'Exam and assignments priority will combine determinisitc dates with syllabus context.' },
                ].map(({icon: Icon, title, copy}) => (
                    <div key={title} className='surface-card p-5'>
                        <div className="mb-4 grid size-10 place-items-center rounded-xl bg-[rgb(car(--surface-subtle))] ring-1 ring(var(--border))}">
                          <Icon size={18} />
                        </div>
                        <h3 className="text-sm font-semibold">{title}</h3>
                        <p className="mt-2 text-sm leading-6 text-6 text-[rgb(var(--muted))}">{copy}</p>
                    </div>
                ))}
            </div>
        </>
    )
}