// Main navigation component
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const location = useLocation();

  const handleSignOut = () => {
    signOut();
  };

  const userRole = user?.unsafeMetadata?.role as string;
  
  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover-glow-primary">
          <img 
            src="/favicon.svg" 
            alt="Crisp AI Logo" 
            className="h-6 w-6" 
          />
          <span className="font-bold text-xl gradient-text">Crisp AI</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {user && (
            <>
              {userRole === 'candidate' && (
                <Link 
                  to="/interview" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all hover:text-primary ${
                    location.pathname === '/interview' ? 'text-primary glow-primary' : 'text-muted-foreground'
                  }`}
                >
                  Interview
                </Link>
              )}
              {userRole === 'interviewer' && (
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all hover:text-primary ${
                    location.pathname === '/dashboard' ? 'text-primary glow-primary' : 'text-muted-foreground'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary/30">
                    <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
                    <AvatarFallback className="bg-card text-card-foreground">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-panel" align="end">
                <DropdownMenuItem className="flex-col items-start">
                  <div className="font-medium">{user.fullName}</div>
                  <div className="text-xs text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="neon" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;