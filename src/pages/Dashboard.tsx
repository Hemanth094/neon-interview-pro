// Dashboard for interviewers to manage candidates
import React from 'react';
import { motion } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Search, 
  Filter,
  Eye,
  Download 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/candidates" element={<CandidateList />} />
          <Route path="/candidate/:id" element={<CandidateDetail />} />
        </Routes>
      </div>
    </div>
  );
};

// Main dashboard overview
const DashboardHome: React.FC = () => {
  const stats = [
    { title: "Total Candidates", value: "1,247", change: "+12%", icon: Users, trend: "up" },
    { title: "Completed Interviews", value: "856", change: "+8%", icon: CheckCircle, trend: "up" },
    { title: "Average Score", value: "7.8/10", change: "+0.3", icon: TrendingUp, trend: "up" },
    { title: "Avg. Interview Time", value: "18m", change: "-2m", icon: Clock, trend: "down" },
  ];

  const recentCandidates = [
    { id: 1, name: "John Doe", email: "john@example.com", score: 8.5, status: "completed", time: "2h ago" },
    { id: 2, name: "Sarah Chen", email: "sarah@example.com", score: 7.2, status: "in-progress", time: "4h ago" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", score: 9.1, status: "completed", time: "6h ago" },
    { id: 4, name: "Anna Smith", email: "anna@example.com", score: null, status: "pending", time: "1d ago" },
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Interviewer Dashboard
        </h1>
        <p className="text-xl text-muted-foreground">
          Manage candidates and track interview performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-panel hover:border-primary/50 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Recent Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <div className="font-medium">{candidate.name}</div>
                    <div className="text-sm text-muted-foreground">{candidate.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      {candidate.score && (
                        <span className="font-bold text-primary">{candidate.score}</span>
                      )}
                      <Badge variant={
                        candidate.status === 'completed' ? 'default' :
                        candidate.status === 'in-progress' ? 'secondary' : 'outline'
                      }>
                        {candidate.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{candidate.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Candidates
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="neon" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              View All Candidates
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

// Placeholder components
const CandidateList: React.FC = () => (
  <div className="text-center">
    <h2 className="text-2xl font-bold gradient-text mb-4">All Candidates</h2>
    <p className="text-muted-foreground">Coming soon...</p>
  </div>
);

const CandidateDetail: React.FC = () => (
  <div className="text-center">
    <h2 className="text-2xl font-bold gradient-text mb-4">Candidate Details</h2>
    <p className="text-muted-foreground">Coming soon...</p>
  </div>
);

export default Dashboard;