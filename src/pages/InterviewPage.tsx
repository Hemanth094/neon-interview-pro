// Interview page for candidates - chat interface with AI
import React from 'react';
import { motion } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Brain, CheckCircle, Upload } from 'lucide-react';

const InterviewPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<InterviewHome />} />
          <Route path="/upload" element={<ResumeUpload />} />
          <Route path="/chat" element={<InterviewChat />} />
          <Route path="/results" element={<InterviewResults />} />
        </Routes>
      </div>
    </div>
  );
};

// Interview home/status page
const InterviewHome: React.FC = () => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-4">
          AI Interview Assistant
        </h1>
        <p className="text-xl text-muted-foreground">
          Get ready for your Full-Stack Developer interview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Resume Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Upload your resume for personalized questions
            </p>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400/50">
              Pending
            </Badge>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Interview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              6 adaptive questions with timed responses
            </p>
            <Badge variant="outline" className="text-muted-foreground">
              Not Started
            </Badge>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Detailed feedback and scoring
            </p>
            <Badge variant="outline" className="text-muted-foreground">
              Locked
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Interview Process</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">2</span>
              </div>
              <span>Easy Questions</span>
            </div>
            <Badge variant="outline">20s each</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="text-secondary font-bold">2</span>
              </div>
              <span>Medium Questions</span>
            </div>
            <Badge variant="outline">60s each</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center">
                <span className="text-destructive font-bold">2</span>
              </div>
              <span>Hard Questions</span>
            </div>
            <Badge variant="outline">120s each</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <Button variant="neon" size="lg" className="hover:scale-105">
          Start Interview Process
        </Button>
      </div>
    </motion.div>
  );
};

// Placeholder components for other routes
const ResumeUpload: React.FC = () => (
  <div className="text-center">
    <h2 className="text-2xl font-bold gradient-text mb-4">Resume Upload</h2>
    <p className="text-muted-foreground">Coming soon...</p>
  </div>
);

const InterviewChat: React.FC = () => (
  <div className="text-center">
    <h2 className="text-2xl font-bold gradient-text mb-4">Interview Chat</h2>
    <p className="text-muted-foreground">Coming soon...</p>
  </div>
);

const InterviewResults: React.FC = () => (
  <div className="text-center">
    <h2 className="text-2xl font-bold gradient-text mb-4">Interview Results</h2>
    <p className="text-muted-foreground">Coming soon...</p>
  </div>
);

export default InterviewPage;