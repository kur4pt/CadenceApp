import { Bell, Menu, Plus, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const pageNames: Record<string, string> = {
  '/overview': 'Overview',
  '/calendar': 'Calendar',
  '/classes': 'Classes',
  '/assignments': 'Assignments',
  '/exams': 'Exams',
  '/uploads': 'Uploads',
  '/settings': 'Settings',
}

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { pathname } = useLocation()

  return (
    <header className="flex h-[72px] items-center justify-between border-b border-[rgb(var(--border)/0.8)] px-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="focus-ring grid size-9 place-items-center rounded-xl border border-[rgb(var(--border))] md:hidden" aria-label="Open navigation">
          <Menu size={18} />
        </button>
        <div>
          <p className="text-xs text-[rgb(var(--muted))]">Cadence</p>
          <h1 className="text-sm font-semibold tracking-[-0.015em]">{pageNames[pathname] ?? 'Workspace'}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="focus-ring hidden h-9 items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 text-sm text-[rgb(var(--muted))] sm:flex">
          <Search size={16} />
          Search
          <kbd className="ml-3 rounded-md border border-[rgb(var(--border))] px-1.5 py-0.5 text-[10px]">⌘K</kbd>
        </button>
        <button className="focus-ring relative grid size-9 place-items-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))]" aria-label="Notifications">
          <Bell size={17} />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[rgb(var(--accent))]" />
        </button>
        <button className="focus-ring flex h-9 items-center gap-2 rounded-xl bg-[rgb(var(--foreground))] px-3 text-sm font-medium text-[rgb(var(--surface))] shadow-sm">
          <Plus size={16} />
          <span className="hidden sm:inline">New</span>
        </button>
      </div>
    </header>
  )
}
