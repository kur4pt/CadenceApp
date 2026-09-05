import { BookOpen, CalendarDays, ClipboardCheck, FileUp, GraduationCap, LayoutDashboard, } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { AccountCard } from '../../features/auth/components/AccountCard'

const navItems = [
    { label: 'Overview',    to: '/overview', icon: LayoutDashboard },
    { label: 'Calendar',    to: '/calendar', icon: CalendarDays },
    { label: 'Classes',     to: '/classes', icon: BookOpen },
    { label: 'Assignments', to: '/assignments', icon: ClipboardCheck },
    { label: 'Exams',       to: '/exams', icon: GraduationCap },
    { label: 'Uploads',     to: '/uploads', icon: FileUp },
]

type SidebarProps = {
    mobileOpen: boolean
    onMobileClose: () => void
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void; mobile?: boolean }) {
    return (
        <>
            <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[rgb(var(--muted))]">
                Workspace
            </p>
            <nav className="space-y-1">
                {navItems.map(({ label, to, icon: Icon }) => (
                    <NavLink 
                        key={to} 
                        to={to} 
                        onClick={onNavigate} 
                        className={({ isActive }) => 
                        `focus-ring flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${
                            isActive 
                                ? 'glass bg-[rgb(var(--accent))] font-medium text-[rgb(var(--accent))] shadow-sm ring-1 ring-[rgb(var(--accent))]'
                                : 'text-[rgb(var(--muted))] hover:bg-[rgb(var(--surface)/0.69)] hover:text-[rgb(var(--accent))]'
                            }`
                        }>
                        <Icon size={16} strokeWidth={2} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto space-y-4">
                <NavLink
                    to='/settings'
                    onClick={onNavigate}
                >
                    <AccountCard />
                </NavLink>
            </div>
        </>
    )
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
    return (
        <>
            <aside className='hidden w-62.5 shrink-0 flex-col border-r border-[rgb(var(--border)/0.8)] bg-[rgb(var(--surface)/0.48)] px-4 py-5 md:flex'>
                <SidebarContent />
            </aside>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <button className="absolute inset-0 bg-black/30 backdrop-blur-sm" aria-label='Close naviation' onClick={onMobileClose}/>
                    <aside className="glass relative z-10 flex h-full w-70 flex-col rounded-r-[28px] px-4 py-5 shadow-2xl">
                        <SidebarContent mobile onNavigate={onMobileClose}/>
                    </aside>
                </div>
            )}
        </>
    )
}