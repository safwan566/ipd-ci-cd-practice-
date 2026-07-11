'use client';

import { useUser } from '@/contexts/UserContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, isPostLoginLoading } = useUser();

    console.log('ProtectedRoute - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'isPostLoginLoading:', isPostLoginLoading);

    // useEffect(() => {
    //     if (!isLoading && !isAuthenticated) {
    //         router.push('/auth/login');
    //     }
    // }, [isAuthenticated, isLoading, router]);

    // // Show loading state while checking authentication
    // if (isLoading || isPostLoginLoading) {
    //     return <FullScreenLoader />;
    // }

    // // Only render children if authenticated
    // if (!isAuthenticated) {
    //     return null;
    // }

    return <>{children}</>;
}
