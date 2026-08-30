import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen p-2.5 md:p-4">
      <div className="glass mx-auto flex min-h-[calc(100vh-1.25rem)] max-w-[1680px] overflow-hidden rounded-[28px] md:min-h-[calc(100vh-2rem)]">
        <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />
        <div className="min-w-0 flex-1 bg-[rgb(var(--surface)/0.72)]">
          <Topbar onMenu={() => setMobileNavOpen(true)} />
          <main className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
