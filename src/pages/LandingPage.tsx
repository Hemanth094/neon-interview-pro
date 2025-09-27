// Futuristic landing page with hero section and CTA
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ParticleBackground from '@/components/ui/ParticleBackground';
import { 
  Zap, 
  Brain, 
  Clock, 
  Shield, 
  Target, 
  TrendingUp, 
  Users, 
  Sparkles,
  ArrowRight,
  CheckCircle 
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Questions",
      description: "Advanced AI generates tailored questions based on Full-Stack development roles"
    },
    {
      icon: Clock,
      title: "Timed Challenges",
      description: "Real interview pressure with adaptive time limits for different difficulty levels"
    },
    {
      icon: Target,
      title: "Skill Assessment",
      description: "Comprehensive evaluation across easy, medium, and hard technical challenges"
    },
    {
      icon: Shield,
      title: "Secure Sessions",
      description: "Enterprise-grade security with persistent session management"
    }
  ];

  const stats = [
    { value: "95%", label: "Success Rate" },
    { value: "10K+", label: "Interviews" },
    { value: "500+", label: "Companies" },
    { value: "4.9/5", label: "Rating" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Next-Gen AI Interview Platform</span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Your AI-Powered</span>
              <br />
              <span className="text-glow-primary">Interview Journey</span>
              <br />
              <span className="text-accent">Starts Here</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience the future of technical interviews with our advanced AI assistant. 
              Get real-time feedback, adaptive questioning, and comprehensive skill assessment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/login">
                <Button variant="hero" size="xl" className="group">
                  Start Interview
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="glass" size="xl">
                Watch Demo
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4 text-accent border-accent/50">
              Advanced Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Powered by Next-Gen AI
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience cutting-edge technology designed to simulate real interview scenarios
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="glass-panel border-border/50 h-full hover:border-primary/50 transition-all duration-300">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-primary transition-all">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple, fast, and effective interview process</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Upload Resume", desc: "Quick PDF upload with automatic parsing" },
              { step: "02", title: "AI Interview", desc: "6 adaptive questions with real-time feedback" },
              { step: "03", title: "Get Results", desc: "Instant scoring and detailed performance analysis" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="h-16 w-16 rounded-full glass-panel border-2 border-primary/30 flex items-center justify-center mx-auto glow-primary">
                    <span className="text-2xl font-bold text-primary">{item.step}</span>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="glass-panel rounded-3xl p-12 text-center max-w-4xl mx-auto border border-primary/20"
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Ready to Ace Your Interview?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers who have improved their interview skills with Crisp AI
            </p>
            <Link to="/login">
              <Button variant="hero" size="xl" className="pulse-neon">
                Get Started Now
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;