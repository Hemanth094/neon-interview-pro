// AI service for generating interview questions and evaluating answers
import { QuestionDifficulty, Question } from '@/store/slices/interviewSlice';

// Mock AI service - replace with actual Google AI API integration
export class AIService {
  private static readonly QUESTION_TEMPLATES = {
    easy: [
      "What is {concept}? Can you explain it in simple terms?",
      "How would you implement {feature} in React?",
      "What's the difference between {concept1} and {concept2}?",
      "Describe your experience with {technology}.",
      "What are the benefits of using {tool} in web development?"
    ],
    medium: [
      "Explain how you would optimize {scenario} for better performance.",
      "Walk me through your approach to solving {problem}.",
      "How would you handle {challenge} in a production environment?",
      "Describe the trade-offs between {approach1} and {approach2}.",
      "How would you debug {issue} in a React application?"
    ],
    hard: [
      "Design a scalable architecture for {complex_system}.",
      "How would you implement {advanced_feature} considering {constraints}?",
      "Explain your strategy for {complex_scenario} with multiple stakeholders.",
      "How would you optimize {performance_issue} at scale?",
      "Design and implement {complex_algorithm} with consideration for {factors}."
    ]
  };

  private static readonly CONCEPTS = {
    react: ['hooks', 'state management', 'component lifecycle', 'virtual DOM', 'JSX'],
    javascript: ['closures', 'promises', 'event loop', 'prototypes', 'async/await'],
    frontend: ['responsive design', 'accessibility', 'performance', 'bundling', 'testing'],
    backend: ['APIs', 'databases', 'authentication', 'caching', 'microservices'],
    general: ['problem solving', 'debugging', 'code review', 'team collaboration', 'project management']
  };

  /**
   * Generate interview questions based on difficulty and candidate background
   */
  static async generateQuestions(
    difficulty: QuestionDifficulty,
    count: number = 2,
    resumeContext?: string
  ): Promise<Question[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const questions: Question[] = [];
    const templates = this.QUESTION_TEMPLATES[difficulty];
    const timeLimit = this.getTimeLimit(difficulty);

    for (let i = 0; i < count; i++) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const question = this.populateTemplate(template, difficulty);
      
      questions.push({
        id: `${difficulty}_${Date.now()}_${i}`,
        text: question,
        difficulty,
        timeLimit,
        category: this.getRandomCategory()
      });
    }

    return questions;
  }

  /**
   * Evaluate candidate's answer using AI
   */
  static async evaluateAnswer(
    questionText: string,
    answerText: string,
    difficulty: QuestionDifficulty,
    timeSpent: number
  ): Promise<{ score: number; feedback: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

    // Mock evaluation logic
    const baseScore = this.calculateBaseScore(answerText, difficulty);
    const timeBonus = this.calculateTimeBonus(timeSpent, difficulty);
    const finalScore = Math.min(10, Math.max(0, baseScore + timeBonus));

    const feedback = this.generateFeedback(finalScore, difficulty, timeSpent);

    return {
      score: Math.round(finalScore * 10) / 10,
      feedback
    };
  }

  /**
   * Generate final interview summary
   */
  static async generateSummary(
    answers: Array<{
      questionText: string;
      answerText: string;
      difficulty: QuestionDifficulty;
      score?: number;
      timeSpent: number;
    }>
  ): Promise<{ overallScore: number; summary: string; strengths: string[]; improvements: string[] }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    const scores = answers.filter(a => a.score).map(a => a.score!);
    const overallScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;

    const strengths = this.identifyStrengths(answers, overallScore);
    const improvements = this.identifyImprovements(answers, overallScore);
    const summary = this.generateOverallSummary(overallScore, strengths, improvements);

    return {
      overallScore: Math.round(overallScore * 10) / 10,
      summary,
      strengths,
      improvements
    };
  }

  // Helper methods
  private static getTimeLimit(difficulty: QuestionDifficulty): number {
    const limits = { easy: 20, medium: 60, hard: 120 };
    return limits[difficulty];
  }

  private static populateTemplate(template: string, difficulty: QuestionDifficulty): string {
    const concepts = this.CONCEPTS;
    const allConcepts = Object.values(concepts).flat();
    
    return template
      .replace('{concept}', this.getRandomItem(allConcepts))
      .replace('{concept1}', this.getRandomItem(concepts.react))
      .replace('{concept2}', this.getRandomItem(concepts.javascript))
      .replace('{technology}', this.getRandomItem(concepts.frontend))
      .replace('{feature}', this.getRandomItem(['a form', 'a modal', 'a carousel', 'a dropdown']))
      .replace('{tool}', this.getRandomItem(['TypeScript', 'Redux', 'Next.js', 'Tailwind CSS']))
      .replace('{scenario}', this.getRandomItem(['a large dataset', 'image loading', 'API calls', 'user interactions']))
      .replace('{problem}', this.getRandomItem(['memory leaks', 'slow rendering', 'API errors', 'state synchronization']))
      .replace('{challenge}', this.getRandomItem(['high traffic', 'complex state', 'real-time updates', 'data consistency']))
      .replace('{approach1}', this.getRandomItem(['server-side rendering', 'client-side routing', 'REST APIs']))
      .replace('{approach2}', this.getRandomItem(['static generation', 'hash routing', 'GraphQL']))
      .replace('{complex_system}', this.getRandomItem(['e-commerce platform', 'social media app', 'real-time chat', 'video streaming']))
      .replace('{advanced_feature}', this.getRandomItem(['real-time collaboration', 'offline functionality', 'micro-frontends', 'progressive web app']))
      .replace('{constraints}', this.getRandomItem(['limited bandwidth', 'legacy browser support', 'mobile-first design', 'accessibility requirements']))
      .replace('{complex_scenario}', this.getRandomItem(['migrating a monolith', 'implementing CI/CD', 'scaling infrastructure', 'data migration']))
      .replace('{performance_issue}', this.getRandomItem(['bundle size', 'render blocking', 'memory usage', 'network latency']))
      .replace('{complex_algorithm}', this.getRandomItem(['search functionality', 'recommendation engine', 'data synchronization', 'caching strategy']))
      .replace('{factors}', this.getRandomItem(['scalability and maintainability', 'performance and security', 'user experience and accessibility', 'cost and reliability']))
      .replace('{issue}', this.getRandomItem(['infinite re-renders', 'memory leaks', 'failed API calls', 'broken routing']));
  }

  private static getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static getRandomCategory(): string {
    const categories = ['React', 'JavaScript', 'Frontend', 'Backend', 'System Design', 'Problem Solving'];
    return this.getRandomItem(categories);
  }

  private static calculateBaseScore(answer: string, difficulty: QuestionDifficulty): number {
    const length = answer.length;
    const wordCount = answer.split(' ').length;
    
    // Basic scoring based on answer length and complexity
    let score = Math.min(8, Math.max(2, length / 50));
    
    // Adjust for difficulty
    const difficultyMultiplier = { easy: 1, medium: 0.8, hard: 0.6 };
    score *= difficultyMultiplier[difficulty];
    
    // Bonus for key technical terms
    const technicalTerms = ['react', 'component', 'hook', 'state', 'props', 'api', 'async', 'performance', 'optimization', 'scalability'];
    const termMatches = technicalTerms.filter(term => answer.toLowerCase().includes(term)).length;
    score += Math.min(2, termMatches * 0.3);
    
    return score;
  }

  private static calculateTimeBonus(timeSpent: number, difficulty: QuestionDifficulty): number {
    const timeLimit = this.getTimeLimit(difficulty);
    const timeRatio = timeSpent / timeLimit;
    
    // Bonus for answering efficiently (between 50-80% of time limit)
    if (timeRatio >= 0.5 && timeRatio <= 0.8) {
      return 0.5;
    } else if (timeRatio < 0.5) {
      return 0.2; // Small bonus for very quick answers
    }
    
    return 0;
  }

  private static generateFeedback(score: number, difficulty: QuestionDifficulty, timeSpent: number): string {
    const timeLimit = this.getTimeLimit(difficulty);
    const timeRatio = timeSpent / timeLimit;
    
    let feedback = '';
    
    if (score >= 8) {
      feedback = 'Excellent answer! You demonstrated strong understanding and provided comprehensive details.';
    } else if (score >= 6) {
      feedback = 'Good answer! You covered the key points well. Consider adding more specific examples.';
    } else if (score >= 4) {
      feedback = 'Decent answer. You understood the basics but could elaborate more on the implementation details.';
    } else {
      feedback = 'Your answer could be improved. Try to provide more specific examples and technical details.';
    }
    
    if (timeRatio <= 0.5) {
      feedback += ' You answered very quickly - consider taking more time to elaborate.';
    } else if (timeRatio >= 0.9) {
      feedback += ' You used most of the available time - good thoroughness!';
    }
    
    return feedback;
  }

  private static identifyStrengths(answers: any[], overallScore: number): string[] {
    const strengths = [];
    
    if (overallScore >= 7) {
      strengths.push('Strong technical knowledge');
      strengths.push('Clear communication skills');
    }
    
    const easyAnswers = answers.filter(a => a.difficulty === 'easy');
    const easyAvg = easyAnswers.length > 0 ? easyAnswers.reduce((sum, a) => sum + (a.score || 0), 0) / easyAnswers.length : 0;
    
    if (easyAvg >= 7) {
      strengths.push('Solid fundamental understanding');
    }
    
    const hardAnswers = answers.filter(a => a.difficulty === 'hard');
    const hardAvg = hardAnswers.length > 0 ? hardAnswers.reduce((sum, a) => sum + (a.score || 0), 0) / hardAnswers.length : 0;
    
    if (hardAvg >= 6) {
      strengths.push('Handles complex problems well');
    }
    
    const avgTimeRatio = answers.reduce((sum, a) => {
      const timeLimit = this.getTimeLimit(a.difficulty);
      return sum + (a.timeSpent / timeLimit);
    }, 0) / answers.length;
    
    if (avgTimeRatio <= 0.7) {
      strengths.push('Efficient problem solving');
    }
    
    return strengths.length > 0 ? strengths : ['Shows potential for growth'];
  }

  private static identifyImprovements(answers: any[], overallScore: number): string[] {
    const improvements = [];
    
    if (overallScore < 6) {
      improvements.push('Focus on providing more detailed technical explanations');
    }
    
    const shortAnswers = answers.filter(a => a.answerText.length < 100).length;
    if (shortAnswers > answers.length / 2) {
      improvements.push('Elaborate more on your answers with specific examples');
    }
    
    const hardAnswers = answers.filter(a => a.difficulty === 'hard');
    const hardAvg = hardAnswers.length > 0 ? hardAnswers.reduce((sum, a) => sum + (a.score || 0), 0) / hardAnswers.length : 0;
    
    if (hardAvg < 5) {
      improvements.push('Practice more complex system design and architecture questions');
    }
    
    improvements.push('Continue practicing interview scenarios');
    
    return improvements;
  }

  private static generateOverallSummary(score: number, strengths: string[], improvements: string[]): string {
    let summary = '';
    
    if (score >= 8) {
      summary = 'Outstanding performance! You demonstrated excellent technical knowledge and communication skills. ';
    } else if (score >= 6) {
      summary = 'Good performance overall! You showed solid understanding of key concepts. ';
    } else if (score >= 4) {
      summary = 'Fair performance. You have a basic understanding but there\'s room for improvement. ';
    } else {
      summary = 'There\'s significant room for improvement. Focus on strengthening your technical fundamentals. ';
    }
    
    summary += `Your key strengths include: ${strengths.join(', ')}. `;
    summary += `Areas for development: ${improvements.join(', ')}.`;
    
    return summary;
  }
}