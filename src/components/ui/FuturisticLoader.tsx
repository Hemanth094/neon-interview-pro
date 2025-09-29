// Futuristic loader component with Crisp AI logo
import React from 'react';
import { motion } from 'framer-motion';

interface FuturisticLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const FuturisticLoader: React.FC<FuturisticLoaderProps> = ({ 
  message = 'Loading...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      {/* Animated Logo Container */}
      <div className="relative flex items-center justify-center">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute rounded-full border-2 border-primary/30 border-t-primary"
          style={{ 
            width: size === 'lg' ? '120px' : size === 'md' ? '80px' : '48px', 
            height: size === 'lg' ? '120px' : size === 'md' ? '80px' : '48px' 
          }}
        />
        
        {/* Inner pulsing ring */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full border border-accent/40"
          style={{ 
            width: size === 'lg' ? '100px' : size === 'md' ? '60px' : '36px', 
            height: size === 'lg' ? '100px' : size === 'md' ? '60px' : '36px' 
          }}
        />
        
        {/* Logo container with glow */}
        <motion.div
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(59, 130, 246, 0.5)',
              '0 0 40px rgba(59, 130, 246, 0.8)',
              '0 0 20px rgba(59, 130, 246, 0.5)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`${sizeClasses[size]} bg-background border-2 border-primary/50 rounded-full flex items-center justify-center relative z-10`}
        >
          {/* Crisp AI Logo */}
          <motion.div
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center justify-center"
          >
            <img 
              src="/src/assets/crisp-ai-logo.png" 
              alt="Crisp AI Logo" 
              className={size === 'lg' ? 'h-12 w-12' : size === 'md' ? 'h-8 w-8' : 'h-5 w-5'} 
            />
          </motion.div>
        </motion.div>
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, -40, -20],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: '50%',
            }}
          />
        ))}
      </div>

      {/* Loading text */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-center space-y-2"
      >
        <p className={`${textSizes[size]} font-medium gradient-text`}>
          Crisp AI
        </p>
        <p className={`${size === 'sm' ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
          {message}
        </p>
      </motion.div>

      {/* Scanning line effect */}
      <motion.div
        animate={{ x: [-100, 100] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-32 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent relative overflow-hidden"
      />
    </div>
  );
};

export default FuturisticLoader;