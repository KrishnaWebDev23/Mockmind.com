# MockMind ---

MockMind is an AI-powered mock interview coaching platform that helps candidates practice technical and behavioral interviews through realistic, adaptive AI-driven sessions — from resume-based question generation to a full spoken interview flow and a detailed performance report at the end.

Built as a solo portfolio project targeting frontend and full-stack internship roles.

## Features ---

- **Resume-based interview setup** — Upload a resume and have it automatically analyzed and used to auto-fill interview configuration via Gemini.
- **AI interviewer with voice** — The AI delivers a spoken welcome and introduction, asks questions, and responds with real-time follow-ups.
- **Dual-mode voice input** — Live on-screen transcription via the Web Speech API, paired with reliable stored transcription via Groq Whisper (MediaRecorder), with a typed-answer fallback.
- **Adaptive follow-up questions** — Generated in real time during the interview using Groq/LLaMA for low-latency responses.
- **Detailed performance reports** — Scores across Communication Skills, Technical Knowledge, Problem Solving, and Confidence & Clarity, along with per-question breakdowns and identified areas for improvement.
- **Protected interview sessions** — Reload and session guards to prevent loss of interview progress.
- **Custom whiteboard tool (MindBoard)** — A self-built, Excalidraw-style whiteboard integrated into the platform.


## Tech Stack ---

Frontend: React, TypeScript, Tailwind CSS
State Management: Zustand
Backend / Auth / Database: Supabase (PostgreSQL with Row-Level Security)
Animation: Framer Motion
Data Visualization: Recharts
Question Generation & Evaluation: Gemini 2.5 Flash
Real-Time Follow-Up Questions: Groq (LLaMA)
Speech-to-Text: Groq Whisper, Web Speech API
Text-to-Speech: Gemini TTS

## Architecture ---

MockMind uses a hybrid AI architecture. Gemini handles question generation, resume analysis, and final evaluation, while Groq/LLaMA handles low-latency, real-time follow-up questions during the interview. Fallback logic between the two services is driven by their respective rate-limit behavior (RPM/TPM versus RPD resets).

## Core Flow ---

1. **Landing** — Introduction to the platform.
2. **Auth** — Sign up and log in via Supabase.
3. **Dashboard** — Overview, navigation, and past activity.
4. **Interview Setup** — Resume upload, AI-assisted auto-fill, and session configuration.
5. **Interview Session** — AI interviewer (video and voice) asks questions, listens, and follows up in real time.
6. **Results / Performance** — Category scores, per-question breakdown, and improvement areas.

## Project Structure ---

```
src/
├── components/       # Reusable UI (Sidebar, AssessmentCard, QuestionsBarchart, etc.)
├── pages/            # Landing, Auth, Dashboard, Interview, Results
├── store/            # Zustand stores (auth, interview config, performance)
├── lib/              # Gemini/Groq API integration (gemini.ts, transcribeAudio, etc.)
└── routes/           # PublicRoute, ProtectedRoute, guards
```

## Status ---

Actively in development. The core interview flow — setup, session, and evaluation — is functional, including voice input and AI-generated follow-ups. Current focus is on accessibility, SEO, and Lighthouse performance improvements.

**Planned / deferred:**
- Multi-interview history view
- Audio-based confidence evaluation
- Sidebar navigation refinement (History / Settings)

## About

MockMind was designed and built from the ground up to develop a deep, practical understanding of real-world frontend and full-stack engineering: state management, API integration, authentication flows, real-time AI interaction, and performance optimization.
