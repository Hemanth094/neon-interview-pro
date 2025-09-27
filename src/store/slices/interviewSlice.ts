// Interview session state management
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  text: string;
  difficulty: QuestionDifficulty;
  timeLimit: number; // in seconds
  category: string;
}

interface Answer {
  questionId: string;
  text: string;
  submittedAt: string;
  timeSpent: number;
  score?: number;
}

interface InterviewState {
  sessionId: string | null;
  candidateId: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Answer[];
  timeRemaining: number;
  isActive: boolean;
  isCompleted: boolean;
  finalScore: number | null;
  aiSummary: string | null;
  startedAt: string | null;
  completedAt: string | null;
}

const initialState: InterviewState = {
  sessionId: null,
  candidateId: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  timeRemaining: 0,
  isActive: false,
  isCompleted: false,
  finalScore: null,
  aiSummary: null,
  startedAt: null,
  completedAt: null,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    startInterview: (state, action: PayloadAction<{ sessionId: string; candidateId: string; questions: Question[] }>) => {
      const { sessionId, candidateId, questions } = action.payload;
      state.sessionId = sessionId;
      state.candidateId = candidateId;
      state.questions = questions;
      state.currentQuestionIndex = 0;
      state.timeRemaining = questions[0]?.timeLimit || 0;
      state.isActive = true;
      state.isCompleted = false;
      state.startedAt = new Date().toISOString();
      state.answers = [];
    },
    submitAnswer: (state, action: PayloadAction<Answer>) => {
      state.answers.push(action.payload);
      
      // Move to next question
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
        state.timeRemaining = state.questions[state.currentQuestionIndex].timeLimit;
      } else {
        // Interview completed
        state.isCompleted = true;
        state.isActive = false;
        state.completedAt = new Date().toISOString();
      }
    },
    updateTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = Math.max(0, action.payload);
    },
    setFinalResults: (state, action: PayloadAction<{ score: number; summary: string }>) => {
      state.finalScore = action.payload.score;
      state.aiSummary = action.payload.summary;
    },
    resetInterview: (state) => {
      return initialState;
    },
  },
});

export const { 
  startInterview, 
  submitAnswer, 
  updateTimeRemaining, 
  setFinalResults, 
  resetInterview 
} = interviewSlice.actions;

export default interviewSlice.reducer;