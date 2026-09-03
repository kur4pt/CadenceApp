import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const {
    signIn,
    isSigningIn,
    signInError,
    isAuthenticated,
    isLoading,
  } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      await signIn({
        email,
        password,
      })
    } catch {
      // error is exposed through signInError
    }
  }

  if (isLoading) {
    return (
        <main className='grid min-h-screen place-items-center'>
            <p>Loading...</p>
        </main>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/overview" replace />
  }

  return (
    <main className='grid  grid-cols-2 min-h-screen place-items-center p-5'>
        <section className='glass w-full max-w-md rounded-[28px] p-8'> 

            <div className='mb-7 flex flex-col items-center gap-5'>
                <h1 className='text-2xl font-semibold tracking-[-0.04em]'>Welcome back</h1>
                <p>Sign in to Cadence.</p>
            </div>


            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                 <label className='flex flex-col gap-2'>
                    Email
                    <input 
                        className='glass w-full rounded-2xl p-4'
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </label>

                <label className='flex flex-col gap-2'>
                    Password
                    <input
                        className='glass w-full rounded-2xl p-4'
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </label>

                {signInError && (
                    <p role="alert">
                    {signInError instanceof Error
                        ? signInError.message
                        : 'Unable to sign in.'}
                    </p>
                )}

                 <button 
                    className=' flex w-full items-center justify-center rounded-[16px] p-4' 
                    type="submit" disabled={isSigningIn}>
                    {isSigningIn ? 'Signing in...' : 'Sign in'}
                </button>
            </form>
        </section>

        {/*   
          add interative assii art.
          add interactive box that can be moved around and interacts with ascii art. 
        
        */}

    </main>
  )
}