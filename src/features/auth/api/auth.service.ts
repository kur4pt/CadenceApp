import { supabase } from '../../../lib/supabase/client'

export type SignInCredentials = {
  email: string
  password: string
}

export const authService = {
  async getSession() {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    return data.session
  },

  async signIn({ email, password }: SignInCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }
  },
}