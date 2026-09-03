import      { createContext }       from 'react'
import type { Session, User}        from '@supabase/supabase-js'
import type { SignInCredentials }   from '../api/auth.service'

export type AuthContextValue = {
    session: Session | null
    user: User | null

    isAuthenticated: boolean
    isLoading: boolean

    signIn: (credentials: SignInCredentials) => Promise<void>
    signOut: () => Promise<void>

    isSigningIn: boolean
    isSigningOut: boolean

    signInError: Error | null
    signOutError: Error | null
}

export const AuthContext = createContext<AuthContextValue | null>(null)