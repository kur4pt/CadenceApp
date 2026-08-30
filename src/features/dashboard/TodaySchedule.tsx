const events = [
    { time: '9:00',  period: 'AM', title: 'Calculus II',      room: 'Math 204',         duration: '50 min' },
    { time: '11:00', period: 'AM', title: 'Computer Science', room: 'Engineering 103',  duration: '75 min' },
    { time: '2:30',  period: 'PM', title: 'English Seminar',  room: 'Liberal Arts 118', duration: '60 min' },
  ]
  
  export function TodaySchedule() {
    return (
      <section className="surface-card p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Today</h3>
            <p className="mt-0.5 text-xs text-[rgb(var(--muted))]">Your verified schedule will appear here.</p>
          </div>
          <button className="focus-ring rounded-lg px-2 py-1 text-xs font-medium text-[rgb(var(--accent))]">View calendar</button>
        </div>
        <div className="space-y-3">
          {events.map((event) => (
            <div key={`${event.time}-${event.title}`} className="grid grid-cols-[58px_1fr_auto] items-center gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-subtle)/0.55)] p-3.5">
              <div>
                <p className="text-sm font-semibold">{event.time}</p>
                <p className="text-[10px] uppercase tracking-wider text-[rgb(var(--muted))]">{event.period}</p>
              </div>
              <div className="min-w-0 border-l border-[rgb(var(--border))] pl-3">
                <p className="truncate text-sm font-medium">{event.title}</p>
                <p className="mt-0.5 truncate text-xs text-[rgb(var(--muted))]">{event.room}</p>
              </div>
              <span className="hidden text-xs text-[rgb(var(--muted))] sm:block">{event.duration}</span>
            </div>
          ))}
        </div>
      </section>
    )
  }
  