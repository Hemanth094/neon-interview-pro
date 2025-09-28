// Role selection page for new users
import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ParticleBackground from '@/components/ui/ParticleBackground';
import FuturisticLoader from '@/components/ui/FuturisticLoader';

const RoleSelection: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'interviewer' | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleSelect = async (role: 'candidate' | 'interviewer') => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      // Update user metadata with selected role
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: role
        }
      });

      toast({
        title: "Role Selected!",
        description: `You are now registered as ${role === 'candidate' ? 'a candidate' : 'an interviewer'}.`,
      });

      // Redirect based on role
      if (role === 'candidate') {
        navigate('/interview', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update your role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isUpdating) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10">
          <FuturisticLoader size="lg" message="Setting up your account..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <ParticleBackground />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-4xl mx-auto px-4"
      >
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl font-bold gradient-text mb-4"
          >
            Welcome to Crisp AI
          </motion.h1>
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground"
          >
            Choose your role to get started
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Candidate Role */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <Card 
              className={`glass-panel cursor-pointer transition-all hover:border-primary/70 ${
                selectedRole === 'candidate' ? 'border-primary shadow-primary/20' : ''
              }`}
              onClick={() => setSelectedRole('candidate')}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <img 
                        src="/favicon.svg" 
                        alt="Crisp AI Logo" 
                        className="h-6 w-6" 
                      />
                    </div>
                    <span>Candidate</span>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary/50">
                    Take Interview
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Take AI-powered interviews with adaptive questions and real-time feedback.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <ChevronRight className="h-4 w-4 text-accent" />
                    <span>Upload resume for personalized questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ChevronRight className="h-4 w-4 text-accent" />
                    <span>6 adaptive questions with timed responses</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ChevronRight className="h-4 w-4 text-accent" />
                    <span>Detailed AI feedback and scoring</span>
                  </div>
                </div>

                {selectedRole === 'candidate' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Button 
                      variant="neon" 
                      className="w-full mt-4"
                      onClick={() => handleRoleSelect('candidate')}
                    >
                      Start as Candidate
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Interviewer Role */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <Card 
              className={`glass-panel cursor-pointer transition-all hover:border-secondary/70 ${
                selectedRole === 'interviewer' ? 'border-secondary shadow-secondary/20' : ''
              }`}
              onClick={() => setSelectedRole('interviewer')}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/20">
                      <Users className="h-6 w-6 text-secondary" />
                    </div>
                    <span>Interviewer</span>
                  </div>
                  <Badge variant="outline" className="text-secondary border-secondary/50">
                    Manage Interviews
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Review candidate interviews, analyze performance, and manage the interview process.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <ChevronRight className="h-4 w-4 text-accent" />
                    <span>View all candidate interviews</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ChevronRight className="h-4 w-4 text-accent" />
                    <span>Detailed performance analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ChevronRight className="h-4 w-4 text-accent" />
                    <span>Export results and insights</span>
                  </div>
                </div>

                {selectedRole === 'interviewer' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Button 
                      variant="cyber" 
                      className="w-full mt-4"
                      onClick={() => handleRoleSelect('interviewer')}
                    >
                      Start as Interviewer
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground">
            You can change your role later in your account settings
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RoleSelection;