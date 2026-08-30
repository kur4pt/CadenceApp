import { ArrowUpRight, Clock3, Sparkles } from 'lucide-react'

const urgentItems = [
    { title: 'Calculus midterm', meta: 'Tomorrow - 9:00 AM',    tone: 'Exam' },
    { title: 'CS problem set',   meta: 'Due today - 11:59 AM',  tone: 'Exam' },
]

export function UrgentCard() {
    return (
        <section className="surface-card overflow-hidden">
            <div className="flex items-center justify-between border-b border[rgb(var(--border))] px-5 py-4">
                <div className="flex items-center gap-2">
                    <Sparkles size={16} />
                    <h3 className="text-sm font-semibold">Urgent</h3>
                </div>
                <span className="rounded-full bg-[rgb(var(--surface-subtle))] px-2.5 py-1 text-[11px] text-[rgb(cacr(-muted))]">Preview</span>
            </div>

            <div className="divide-y divide-[rgb(var(-border))]">
                {urgentItems.map((item) => (
                    <button key={item.title} className='focus-ring flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-[rgb(car(--surface-subtle))]'>
                        <div className="grid size-9 place-items-center rounded-xl bg-[rgb(var(--accent)/0.1)] text-[rgb(var(--accent))]">
                            <Clock3 size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{item.title}</p>
                            <p className="mt-0.5 text-sm text-[rgb(var(--muted))]">{item.meta}</p>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[rgb(var(--muted))]">
                            {item.tone}
                            <ArrowUpRight size={15}/>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    )
}