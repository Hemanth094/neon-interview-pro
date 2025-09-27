// Authentication page with Clerk integration
import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import ParticleBackground from '@/components/ui/ParticleBackground';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <ParticleBackground />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="glass-panel p-8 rounded-2xl border border-border/50 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Welcome to Crisp AI</h1>
            <p className="text-muted-foreground">Your AI-Powered Interview Journey Starts Here</p>
          </div>
          
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-transparent border-0 shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "glass-panel hover:bg-card/80 border-border/50 text-foreground",
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground hover-glow-primary",
                formFieldInput: "glass-panel border-border/50 text-foreground placeholder:text-muted-foreground",
                footerActionText: "text-muted-foreground",
                footerActionLink: "text-primary hover:text-primary/80",
              }
            }}
            redirectUrl="/dashboard"
            afterSignInUrl="/dashboard"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;