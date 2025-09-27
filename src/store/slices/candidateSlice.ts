// Candidates management for interviewer dashboard
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ResumeData {
  fileName: string;
  name: string;
  email: string;
  phone: string;
  uploadedAt: string;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  resume: ResumeData | null;
  interviewScore: number | null;
  interviewSummary: string | null;
  interviewedAt: string | null;
  status: 'pending' | 'in-progress' | 'completed';
}

interface CandidateState {
  candidates: Candidate[];
  selectedCandidate: Candidate | null;
}

const initialState: CandidateState = {
  candidates: [],
  selectedCandidate: null,
};

const candidateSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidate: (state, action: PayloadAction<Candidate>) => {
      state.candidates.push(action.payload);
    },
    updateCandidate: (state, action: PayloadAction<Partial<Candidate> & { id: string }>) => {
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = { ...state.candidates[index], ...action.payload };
      }
    },
    setSelectedCandidate: (state, action: PayloadAction<Candidate | null>) => {
      state.selectedCandidate = action.payload;
    },
    updateCandidateStatus: (state, action: PayloadAction<{ id: string; status: Candidate['status'] }>) => {
      const candidate = state.candidates.find(c => c.id === action.payload.id);
      if (candidate) {
        candidate.status = action.payload.status;
      }
    },
  },
});

export const { 
  addCandidate, 
  updateCandidate, 
  setSelectedCandidate, 
  updateCandidateStatus 
} = candidateSlice.actions;

export default candidateSlice.reducer;