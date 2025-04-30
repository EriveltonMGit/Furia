"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      checkAuth().then((authStatus) => {
        if (!authStatus) {
          router.push('/login');
        }
      });
    }
  }, [isAuthenticated, loading, router, checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
        <Loader2 className="h-8 w-8 text-[#00FF00] animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}