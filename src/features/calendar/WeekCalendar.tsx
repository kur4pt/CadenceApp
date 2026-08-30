import { ChevronLeft, ChevronRight, Filter, Plus } from 'lucide-react'

const days = [
  ['MON', '24'],
  ['TUE', '25'],
  ['WED', '26'],
  ['THU', '27'],
  ['FRI', '28'],
]

const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

const sampleEvents = [
  { day: 0, top: 58, height: 86, title: 'Calculus II', meta: '9:00–9:50', className: 'bg-violet-100 text-violet-950 border-violet-200' },
  { day: 1, top: 164, height: 104, title: 'Computer Science', meta: '11:00–12:15', className: 'bg-emerald-100 text-emerald-950 border-emerald-200' },
  { day: 2, top: 93, height: 86, title: 'Physics', meta: '10:00–10:50', className: 'bg-sky-100 text-sky-950 border-sky-200' },
  { day: 3, top: 286, height: 86, title: 'English Seminar', meta: '1:30–2:20', className: 'bg-amber-100 text-amber-950 border-amber-200' },
  { day: 4, top: 198, height: 94, title: 'Study Block', meta: '11:30–12:30', className: 'bg-rose-100 text-rose-950 border-rose-200' },
]

export function WeekCalendar() {
  return (
    <section className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgb(var(--border))] p-4">
        <div className="flex items-center gap-2">
          <button className="focus-ring grid size-9 place-items-center rounded-xl border border-[rgb(var(--border))]"><ChevronLeft size={16} /></button>
          <button className="focus-ring grid size-9 place-items-center rounded-xl border border-[rgb(var(--border))]"><ChevronRight size={16} /></button>
          <div className="ml-2">
            <p className="text-sm font-semibold">August 24–28</p>
            <p className="text-xs text-[rgb(var(--muted))]">Fall semester</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="focus-ring flex h-9 items-center gap-2 rounded-xl border border-[rgb(var(--border))] px-3 text-sm"><Filter size={15} /> Filter</button>
          <button className="focus-ring flex h-9 items-center gap-2 rounded-xl bg-[rgb(var(--foreground))] px-3 text-sm font-medium text-[rgb(var(--surface))]"><Plus size={15} /> Add event</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[820px]">
          <div className="grid grid-cols-[72px_repeat(5,minmax(140px,1fr))] border-b border-[rgb(var(--border))]">
            <div />
            {days.map(([day, date], index) => (
              <div key={day} className={`border-l border-[rgb(var(--border))] px-3 py-3 text-center ${index === 0 ? 'bg-[rgb(var(--surface-subtle))]' : ''}`}>
                <p className="text-[10px] font-medium tracking-[0.12em] text-[rgb(var(--muted))]">{day}</p>
                <p className="mt-1 text-sm font-semibold">{date}</p>
              </div>
            ))}
          </div>

          <div className="relative grid h-[560px] grid-cols-[72px_repeat(5,minmax(140px,1fr))]">
            <div className="relative">
              {times.map((time, index) => (
                <span key={time} className="absolute right-3 -translate-y-1/2 text-[10px] text-[rgb(var(--muted))]" style={{ top: index * 62 + 24 }}>{time}</span>
              ))}
            </div>
            {days.map(([day]) => (
              <div key={day} className="relative border-l border-[rgb(var(--border))] bg-[linear-gradient(to_bottom,transparent_61px,rgb(var(--border))_62px)] bg-[length:100%_62px]" />
            ))}

            {sampleEvents.map((event) => (
              <button
                key={`${event.day}-${event.title}`}
                className={`focus-ring absolute z-10 rounded-xl border p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${event.className}`}
                style={{
                  left: `calc(72px + ${event.day} * ((100% - 72px) / 5) + 8px)`,
                  width: 'calc((100% - 72px) / 5 - 16px)',
                  top: event.top,
                  height: event.height,
                }}
              >
                <p className="truncate text-xs font-semibold">{event.title}</p>
                <p className="mt-1 text-[10px] opacity-70">{event.meta}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
