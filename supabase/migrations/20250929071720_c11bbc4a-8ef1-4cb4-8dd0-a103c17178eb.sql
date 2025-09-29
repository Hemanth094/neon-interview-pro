-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'candidate', 'interviewer');

-- Create user profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role app_role NOT NULL DEFAULT 'candidate',
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create interviews table
CREATE TABLE public.interviews (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    interviewer_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    position TEXT NOT NULL,
    difficulty_level TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'pending',
    total_questions INTEGER DEFAULT 6,
    current_question_index INTEGER DEFAULT 0,
    overall_score DECIMAL(3,2),
    feedback TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create questions table
CREATE TABLE public.questions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'technical',
    difficulty TEXT NOT NULL DEFAULT 'medium',
    time_limit INTEGER NOT NULL DEFAULT 120, -- seconds
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create answers table
CREATE TABLE public.answers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
    answer_text TEXT,
    audio_url TEXT,
    transcript TEXT,
    time_taken INTEGER, -- seconds
    score DECIMAL(3,2),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Interviews policies
CREATE POLICY "Candidates can view their own interviews" 
ON public.interviews 
FOR SELECT 
USING (auth.uid() = candidate_id OR public.has_role(auth.uid(), 'interviewer') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Candidates can create their own interviews" 
ON public.interviews 
FOR INSERT 
WITH CHECK (auth.uid() = candidate_id);

CREATE POLICY "Interviewers and admins can update interviews" 
ON public.interviews 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'interviewer') OR public.has_role(auth.uid(), 'admin') OR auth.uid() = candidate_id);

-- Questions policies
CREATE POLICY "Users can view questions for their interviews" 
ON public.questions 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.interviews 
        WHERE id = interview_id 
        AND (candidate_id = auth.uid() OR public.has_role(auth.uid(), 'interviewer') OR public.has_role(auth.uid(), 'admin'))
    )
);

CREATE POLICY "System can insert questions" 
ON public.questions 
FOR INSERT 
WITH CHECK (true);

-- Answers policies
CREATE POLICY "Users can view answers for their interviews" 
ON public.answers 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.interviews 
        WHERE id = interview_id 
        AND (candidate_id = auth.uid() OR public.has_role(auth.uid(), 'interviewer') OR public.has_role(auth.uid(), 'admin'))
    )
);

CREATE POLICY "Candidates can insert answers for their interviews" 
ON public.answers 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.interviews 
        WHERE id = interview_id 
        AND candidate_id = auth.uid()
    )
);

CREATE POLICY "System can update answers" 
ON public.answers 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at
    BEFORE UPDATE ON public.interviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_answers_updated_at
    BEFORE UPDATE ON public.answers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();