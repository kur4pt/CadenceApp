import type { LucideIcon } from 'lucide-react'

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="surface-card grid min-h-[340px] place-items-center p-8 text-center">
      <div className="max-w-sm">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-[rgb(var(--surface-subtle))] ring-1 ring-[rgb(var(--border))]">
          <Icon size={21} />
        </div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">{description}</p>
      </div>
    </div>
  )
}
