import { useEffect } from 'react'
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { supabase } from '../../../lib/supabase/client'
import {
  authService,
  type SignInCredentials,
} from '../api/auth.service'

const AUTH_SESSION_KEY = ['auth', 'session'] as const

export function useAuth() {
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
        console.log(`[Cadence Auth]`, {
            event,
            userId: session?.user.id,
            email: session?.user.email,
        })
        queryClient.setQueryData(AUTH_SESSION_KEY, session)
    })

    return () => {
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
      queryClient.clear()
    },
  })

  return {
    session: sessionQuery.data ?? null,
    user: sessionQuery.data?.user ?? null,

    isAuthenticated: Boolean(sessionQuery.data),
    isLoading: sessionQuery.isLoading,

    signIn: signInMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,

    isSigningIn: signInMutation.isPending,
    isSigningOut: signOutMutation.isPending,

    signInError: signInMutation.error,
  }
}