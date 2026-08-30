import {
    BookOpen,
    CalendarDays,
    ClipboardCheck,
    FileUp,
    GraduationCap,
    LayoutDashboard,
    Settings,
    Sparkles,
    X,
  } from 'lucide-react'
  import { NavLink } from 'react-router-dom'
  
  const navItems = [
    { label: 'Overview', to: '/overview', icon: LayoutDashboard },
    { label: 'Calendar', to: '/calendar', icon: CalendarDays },
    { label: 'Classes', to: '/classes', icon: BookOpen },
    { label: 'Assignments', to: '/assignments', icon: ClipboardCheck },
    { label: 'Exams', to: '/exams', icon: GraduationCap },
    { label: 'Uploads', to: '/uploads', icon: FileUp },
  ]
  
  type SidebarProps = {
    mobileOpen: boolean
    onMobileClose: () => void
  }
  
  function SidebarContent({ onNavigate, mobile }: { onNavigate?: () => void; mobile?: boolean }) {
    return (
      <>
        <div className="mb-7 flex items-center gap-3 px-2">
          <div className="grid size-10 place-items-center rounded-2xl bg-[rgb(var(--foreground))] text-[rgb(var(--surface))] shadow-sm">
            <Sparkles size={19} strokeWidth={2.1} />
          </div>
          <div>
            <p className="text-[15px] font-semibold tracking-[-0.025em]">Cadence</p>
            <p className="text-xs text-[rgb(var(--muted))]">Student workspace</p>
          </div>
          {mobile && (
            <button onClick={onNavigate} className="focus-ring ml-auto grid size-9 place-items-center rounded-xl border border-[rgb(var(--border))]" aria-label="Close navigation">
              <X size={17} />
            </button>
          )}
        </div>
  
        <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[rgb(var(--muted))]">Workspace</p>
        <nav className="space-y-1">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-[rgb(var(--surface))] font-medium text-[rgb(var(--foreground))] shadow-sm ring-1 ring-[rgb(var(--border))]'
                    : 'text-[rgb(var(--muted))] hover:bg-[rgb(var(--surface)/0.65)] hover:text-[rgb(var(--foreground))]'
                }`
              }
            >
              <Icon size={17} strokeWidth={1.9} />
              {label}
            </NavLink>
          ))}
        </nav>
  
        <div className="mt-auto space-y-3">
          <NavLink
            to="/settings"
            onClick={onNavigate}
            className={({ isActive }) =>
              `focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                isActive
                  ? 'bg-[rgb(var(--surface))] font-medium shadow-sm ring-1 ring-[rgb(var(--border))]'
                  : 'text-[rgb(var(--muted))] hover:bg-[rgb(var(--surface)/0.65)] hover:text-[rgb(var(--foreground))]'
              }`
            }
          >
            <Settings size={17} />
            Settings
          </NavLink>
  
          <div className="flex items-center gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface)/0.72)] p-3">
            <div className="grid size-9 place-items-center rounded-full bg-[rgb(var(--foreground))] text-xs font-semibold text-[rgb(var(--surface))]">NU</div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Student</p>
              <p className="truncate text-xs text-[rgb(var(--muted))]">MVP account</p>
            </div>
          </div>
        </div>
      </>
    )
  }
  
  export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
    return (
      <>
        <aside className="hidden w-[250px] shrink-0 flex-col border-r border-[rgb(var(--border)/0.78)] bg-[rgb(var(--surface)/0.48)] px-4 py-5 md:flex">
          <SidebarContent />
        </aside>
  
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button className="absolute inset-0 bg-black/30 backdrop-blur-sm" aria-label="Close navigation" onClick={onMobileClose} />
            <aside className="glass relative z-10 flex h-full w-[280px] flex-col rounded-r-[28px] px-4 py-5 shadow-2xl">
              <SidebarContent mobile onNavigate={onMobileClose} />
            </aside>
          </div>
        )}
      </>
    )
  }
  