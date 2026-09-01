import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'

export function ProtectedzRoute() {
    const { isAuthenticated,isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return (
            <main className='grid min-h-screen place-items-center'>
                <p>Loading...</p>
            </main>
        )
    }
    
    if (!isAuthenticated) {
        return (
            <Navigate to="/login" replace state={{ from: location }} />
        )
    }

    return <Outlet />

}