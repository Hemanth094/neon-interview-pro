// Redirect to landing page - this file is now replaced by LandingPage.tsx
import { Navigate } from 'react-router-dom';

const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
