# FinancePal Pro

A modern financial companion built with Next.js 15, Firebase, and AI-powered insights.

## Features
- **EMI Calculator**: Calculate monthly loan repayments.
- **SIP Calculator**: Plan your mutual fund investments.
- **GST Calculator**: Split inclusive/exclusive taxes.
- **Budget Tracker**: Securely track income and expenses in real-time with Firestore.
- **AI Insights**: Personalized financial tips based on your spending habits.
- **Currency Converter**: Live-updating currency rates.

## Deployment on Vercel
1.  **Clone** this repository to GitHub.
2.  **Import** the project to Vercel.
3.  Add `GOOGLE_GENAI_API_KEY` from Google AI Studio to your Vercel Environment Variables.
4.  Ensure `NEXT_PUBLIC_FIREBASE_*` variables match your project settings.
5.  Deploy!

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database/Auth**: Firebase Firestore & Authentication
- **AI**: Genkit with Google Gemini 2.5 Flash
- **Styling**: Tailwind CSS & ShadCN UI
- **Icons**: Lucide React
