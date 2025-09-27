// Mock data for development and testing

export interface Question {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in seconds
  category: string;
}

export const mockQuestions: Question[] = [
  // Easy Questions (20s each)
  {
    id: 'q1',
    text: 'What is the difference between let, const, and var in JavaScript?',
    difficulty: 'easy',
    timeLimit: 20,
    category: 'JavaScript Fundamentals'
  },
  {
    id: 'q2', 
    text: 'Explain what React hooks are and name three commonly used hooks.',
    difficulty: 'easy',
    timeLimit: 20,
    category: 'React Basics'
  },
  
  // Medium Questions (60s each)
  {
    id: 'q3',
    text: 'How would you implement a debounce function in JavaScript? Provide a code example.',
    difficulty: 'medium',
    timeLimit: 60,
    category: 'JavaScript Advanced'
  },
  {
    id: 'q4',
    text: 'Explain the concept of state management in React. Compare useState, useReducer, and Context API.',
    difficulty: 'medium', 
    timeLimit: 60,
    category: 'React State Management'
  },
  
  // Hard Questions (120s each)
  {
    id: 'q5',
    text: 'Design a real-time chat application architecture. Discuss the backend, database, and frontend considerations including scalability, security, and performance optimizations.',
    difficulty: 'hard',
    timeLimit: 120,
    category: 'System Design'
  },
  {
    id: 'q6',
    text: 'Implement a custom React hook that manages complex form state with validation, error handling, and submission. Explain your design decisions and how you would test it.',
    difficulty: 'hard',
    timeLimit: 120,
    category: 'React Advanced Patterns'
  }
];

export const mockCandidates = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    resume: {
      fileName: 'alex_johnson_resume.pdf',
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      phone: '+1 (555) 123-4567',
      uploadedAt: '2024-01-15T10:30:00Z'
    },
    interviewScore: 8.5,
    interviewSummary: 'Strong technical skills, excellent problem-solving approach. Good communication and clear thinking process.',
    interviewedAt: '2024-01-15T14:30:00Z',
    status: 'completed' as const
  },
  {
    id: '2', 
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '+1 (555) 987-6543',
    resume: {
      fileName: 'sarah_chen_resume.pdf',
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com', 
      phone: '+1 (555) 987-6543',
      uploadedAt: '2024-01-16T09:15:00Z'
    },
    interviewScore: null,
    interviewSummary: null,
    interviewedAt: null,
    status: 'in-progress' as const
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    email: 'michael.r@email.com',
    phone: '+1 (555) 456-7890',
    resume: {
      fileName: 'michael_rodriguez_resume.pdf',
      name: 'Michael Rodriguez',
      email: 'michael.r@email.com',
      phone: '+1 (555) 456-7890',
      uploadedAt: '2024-01-14T16:45:00Z'
    },
    interviewScore: 9.2,
    interviewSummary: 'Exceptional candidate with deep full-stack knowledge. Demonstrated strong architecture thinking and best practices.',
    interviewedAt: '2024-01-14T18:00:00Z',
    status: 'completed' as const
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1 (555) 321-0987',
    resume: {
      fileName: 'emily_davis_resume.pdf',
      name: 'Emily Davis', 
      email: 'emily.davis@email.com',
      phone: '+1 (555) 321-0987',
      uploadedAt: '2024-01-17T11:20:00Z'
    },
    interviewScore: null,
    interviewSummary: null,
    interviewedAt: null,
    status: 'pending' as const
  }
];

export const generateMockSession = (candidateId: string) => ({
  sessionId: `session_${Date.now()}`,
  candidateId,
  questions: mockQuestions,
  startedAt: new Date().toISOString()
});

export const mockAISummary = {
  overallScore: 8.5,
  summary: `Candidate demonstrated strong technical knowledge across JavaScript, React, and system design. 
            
Strengths:
- Excellent understanding of React hooks and state management
- Clear problem-solving approach
- Good communication skills
- Strong grasp of JavaScript fundamentals

Areas for improvement:
- Could benefit from more experience with advanced React patterns
- System design could be more detailed regarding scalability considerations

Recommendation: Strong hire for mid-level full-stack developer position.`,
  
  questionScores: [
    { questionId: 'q1', score: 9, feedback: 'Perfect explanation of variable declarations' },
    { questionId: 'q2', score: 8, feedback: 'Good understanding of hooks, could elaborate more' },
    { questionId: 'q3', score: 8, feedback: 'Solid debounce implementation with minor improvements needed' },
    { questionId: 'q4', score: 9, feedback: 'Excellent comparison of state management approaches' },
    { questionId: 'q5', score: 7, feedback: 'Good architecture overview, needs more scalability details' },
    { questionId: 'q6', score: 9, feedback: 'Outstanding custom hook implementation and testing approach' }
  ]
};