// Custom hook to handle authentication and role-based redirects
import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useAuthRedirect = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoaded) return;

    // If user is signed in and on login page, redirect based on role or to role selection
    if (user && location.pathname === '/login') {
      const userRole = user.unsafeMetadata?.role as string;
      
      if (userRole === 'candidate') {
        navigate('/interview', { replace: true });
        toast({
          title: "Welcome back!",
          description: "Redirected to your interview dashboard.",
        });
      } else if (userRole === 'interviewer') {
        navigate('/dashboard', { replace: true });
        toast({
          title: "Welcome back!",
          description: "Redirected to your interviewer dashboard.",
        });
      } else {
        // No role set, redirect to role selection
        navigate('/select-role', { replace: true });
      }
    }
  }, [user, isLoaded, location.pathname, navigate, toast]);

  return { user, isLoaded };
};