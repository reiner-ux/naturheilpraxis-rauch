import React from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Development bypass: Available in dev mode AND preview environments
  // Add ?dev=true to URL to skip authentication during testing
  const isNonProduction = import.meta.env.DEV || window.location.hostname.includes('preview') || window.location.hostname.includes('lovableproject.com') || window.location.hostname.includes('localhost');
  const devBypass = isNonProduction && searchParams.get('dev') === 'true';

  if (devBypass) {
    // Development mode bypass - only works in non-production builds
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Redirect to auth page, saving the intended destination
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
