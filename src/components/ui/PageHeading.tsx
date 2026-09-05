import type { ReactNode } from 'react'

export function PageHeading({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h2 className="text-2xl font-semibold tracking-[-0.04em] md:text-3xl">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-[rgb(var(--muted))]">{description}</p>
      </div>
      {action}
    </div>
  )
}
