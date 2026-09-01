import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function AccountCard() {
    const { user, signOut, isSigningOut, } = useAuth()
    const navigate = useNavigate()
    async function handleSignOut() {
        try {
            await signOut()
            navigate('/login', { replace: true })
        } catch (error) {
            console.error('Failed to sign out', error)
        }
    }

    const email = user?.email ?? 'Unknown user'

    const displayName = 
        user?.user_metadata?.full_name ?? 
        user?.user_metadata?.name ?? 
        email.split('@')[0]

    const initials = displayName
        .split(' ')
        .map((part: string) => part[0])
        .join('').slice(0.2)
        .toUpperCase()

    return (
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface_/0.75)) p-4">
            <div className="flex items-center gap-4">
                <div className="grid size-8 shrink-0 place-items-center rounded-full bg-[rgb(var(--foreground))] text-xs font-semibold text-[rgb(var(--surface))]">
                    {initials}
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                        {displayName}
                    </p>

                    <p className="truncate text-xs text-[rgb(var(--muted))]">
                        {email}
                    </p>
                </div>
            </div>

            <div className="mt-4 border-t border-[rgb(var(--border))] pt-2">
                <button type="button" 
                onClick={handleSignOut}
                disabled={isSigningOut} 
                className='focus-ring flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm text-[rgb(var(--muted))] transition hover:bg-[rgb(var(--surface))] hover:text-[rgb(var(--foreground))] disabled:cursor-not-allowed disabled:opacity-50 '>
                    <LogOut size={16} />    
                    {isSigningOut ? 'Signing out...' : 'Sign out'}
                </button>
            </div>
        </div>
    )
}