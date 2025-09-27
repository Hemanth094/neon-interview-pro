# 🚀 Crisp AI - Setup Guide

## Quick Start

### 1. Environment Setup

Create a `.env.local` file in the project root:

```bash
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 2. Clerk Configuration

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Get your Publishable Key from the dashboard
4. Add it to your `.env.local` file

### 3. User Roles Setup

In your Clerk dashboard:
1. Go to **Users & Authentication** → **Metadata**
2. Add a `role` field to user public metadata
3. Set values as either `candidate` or `interviewer`

### 4. Development Server

```bash
npm install
npm run dev
```

## 🎨 Design System

### Color Palette
- **Primary**: Electric Blue (`#0066ff`)
- **Secondary**: Cyber Purple (`#8b5cf6`)  
- **Accent**: Neon Teal (`#06b6d4`)
- **Background**: Deep Dark (`#0a0a0f`)

### Components
All components use the futuristic design system with glassmorphism effects:
- `variant="neon"` - Gradient buttons with glow
- `variant="glass"` - Transparent panels with blur
- `variant="hero"` - Large CTA buttons with pulse effect

## 🔧 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **State**: Redux Toolkit + Redux Persist
- **Auth**: Clerk (Email, Google, GitHub)
- **Animations**: Framer Motion
- **Build**: Vite

## 📱 Features

### For Candidates
- ✅ Resume upload and parsing
- ✅ AI-powered interview questions  
- ✅ Timed responses (20s/60s/120s)
- ✅ Real-time feedback
- ✅ Progress tracking
- ✅ Session persistence

### For Interviewers  
- ✅ Candidate management dashboard
- ✅ Interview results and analytics
- ✅ Detailed performance reports
- ✅ Search and filtering
- ✅ Export capabilities

## 🔥 Next Steps

1. **Complete Interview Flow**: Add chat interface and timer logic
2. **Resume Parser**: Implement PDF/DOCX parsing
3. **AI Integration**: Connect OpenAI API for question generation
4. **Real-time Features**: Add WebSocket for live interviews
5. **Analytics**: Advanced reporting and insights
6. **Mobile App**: React Native version

## 🚀 Deployment

The app is ready to deploy on Lovable, Vercel, or Netlify.

Remember to add your environment variables to your deployment platform!