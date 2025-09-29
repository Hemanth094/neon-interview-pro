// Main App component with Clerk authentication and Redux setup
import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { store, persistor } from '@/store';
import Navigation from '@/components/layout/Navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import RoleSelection from '@/pages/RoleSelection';
import InterviewPage from '@/pages/InterviewPage';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import FuturisticLoader from '@/components/ui/FuturisticLoader';

// Clerk Publishable Key (safe for client-side use)
// Note: This is a development key with usage limits - replace with production key for deployment
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_d29ydGh5LXBvcnBvaXNlLTM0LmNsZXJrLmFjY291bnRzLmRldiQ';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Loading component for Redux persistence
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <FuturisticLoader size="lg" message="Loading Crisp AI..." />
  </div>
);

const App: React.FC = () => {
  return (
    <ClerkProvider 
      publishableKey={CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: 'hsl(220, 100%, 50%)',
          colorBackground: 'hsl(240, 10%, 4%)',
          colorInputBackground: 'hsl(240, 15%, 12%)',
          colorInputText: 'hsl(210, 40%, 98%)',
        }
      }}
    >
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <BrowserRouter
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true
                }}
              >
                <div className="min-h-screen bg-background text-foreground">
                  <Navigation />
                  
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/select-role" element={<RoleSelection />} />
                    
                    {/* Protected Routes */}
                    <Route 
                      path="/interview/*" 
                      element={
                        <ProtectedRoute allowedRoles={['candidate']}>
                          <InterviewPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard/*" 
                      element={
                        <ProtectedRoute allowedRoles={['interviewer']}>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Catch-all 404 route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  
                  <Toaster />
                  <Sonner 
                    theme="dark"
                    toastOptions={{
                      style: {
                        background: 'hsl(240 15% 8%)',
                        border: '1px solid hsl(240 15% 20%)',
                        color: 'hsl(210 40% 98%)',
                      },
                    }}
                  />
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </ClerkProvider>
  );
};

export default App;