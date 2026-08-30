import { FileUp, ShieldCheck } from 'lucide-react'
import { PageHeading } from '../components/ui/PageHeading'

export function UploadsPage() {
  return (
    <>
      <PageHeading title="Uploads" description="Schedules and syllabi will enter Cadence through a review-first import pipeline." />
      <div className="surface-card border-dashed p-8 md:p-12">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[rgb(var(--surface-subtle))] ring-1 ring-[rgb(var(--border))]"><FileUp size={22} /></div>
          <h3 className="mt-5 font-semibold">Drop schedules and syllabi here</h3>
          <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">PDF, image, and DOCX handling will be added after the calendar model is stable.</p>
          <button className="focus-ring mt-5 rounded-xl bg-[rgb(var(--foreground))] px-4 py-2.5 text-sm font-medium text-[rgb(var(--surface))]">Choose files</button>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[rgb(var(--muted))]"><ShieldCheck size={14} /> Imports remain drafts until verified.</div>
        </div>
      </div>
    </>
  )
}
