import { Sparkle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { isSupabaseConfigured } from '../lib/supabase'

export function LoginPage() {
    return (
        <main className="grid min-h-screen place items-center p-5">
            <section className="glass w-full max-w-md rounded-[28px] p-7">
                <div className="mb-7 flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-2xl bg-[rgb(var(--foreground))] text-[rgb(var(--surface))]">
                        <Sparkle size={18}/>
                    </div>
                    <div>
                        <h1 className="font-semibold">Cadence</h1>
                        <p className="text-xs text-[rgb(var(--muted))]">Student workspace</p>
                    </div>
                    <h2 className="text-2xl font-semibold tracking-[-0.04em">Welcome back</h2>
                    <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">Auth wiring is scaffolded for Supabase. Add the environment variables before enabling sign-in.</p>
                    <div className="mt-6 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-subtle))] p-3 text-xs text-[rgb(var(--muted))]">Supabase: {isSupabaseConfigured ? 'configured': 'not configured'}</div>
                    <Link to="/overview" className='focus-ring mt-5 flex h-10 items-center justify-center rounded-xl bg-[rgb(var(--forgrounded))] text-sm font-medium text-[rgb(var(--surface))]'>Enter foundation preview</Link>
                </div>
            </section>
        </main>
    )
}