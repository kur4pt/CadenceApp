import { useEffect, type PropsWithChildren } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase/client'
import { authService, type SignInCredentials, } from '../api/auth.service'
import { AuthContext } from './AuthContext'

const AUTH_SESSION_KEY = ['auth', 'session'] as const

export function AuthProvider({ children }: PropsWithChildren) {
    const queryClient = useQueryClient()

    const sessionQuery = useQuery({
        queryKey: AUTH_SESSION_KEY,
        queryFn: authService.getSession,
        staleTime: Infinity,
    })

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            queryClient.setQueryData(AUTH_SESSION_KEY, session) 
        })

         return() => {
            subscription.unsubscribe() 
        }
    }, [queryClient])

    const signInMutation = useMutation({
        mutationFn: (credentials: SignInCredentials) => 
            authService.signIn(credentials),
        
        onSuccess: ({ session }) => {
            queryClient.setQueryData(AUTH_SESSION_KEY, session)
        },
    })

    const signOutMutation = useMutation({
        mutationFn: authService.signOut,

        onSuccess: () => {
            queryClient.setQueryData(AUTH_SESSION_KEY, null)

            queryClient.removeQueries({
                predicate: (query) => query.queryKey[0] !== 'auth',
            })
        },
    })

    async function signIn( credentials: SignInCredentials ) {
        await signInMutation.mutateAsync(credentials)
    }

    async function signOut() {
        await signOutMutation.mutateAsync()
    }

    return (
        <AuthContext.Provider
            value={{
                session: sessionQuery.data ?? null,
                user: sessionQuery.data?.user ?? null,

                isAuthenticated: !!sessionQuery.data,
                isLoading: sessionQuery.isPending,

                signIn,
                signOut,

                isSigningIn: signInMutation.isPending,
                isSigningOut: signOutMutation.isPending,

                signInError: signInMutation.error,
                signOutError: signOutMutation.error,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}