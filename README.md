# FinancePal Pro

A modern financial companion built with Next.js 15, Firebase, and AI-powered insights.

## Features
- **EMI Calculator**: Calculate monthly loan repayments with precise manual inputs.
- **SIP Calculator**: Plan your mutual fund investments with expected returns.
- **GST Calculator**: Split inclusive/exclusive taxes across standard slabs (5%, 12%, 18%, 28%).
- **Budget Tracker**: Securely track income and expenses in real-time with Firestore.
- **AI Insights**: Personalized financial tips based on your spending habits using Gemini AI.
- **Currency Converter**: Live-updating currency rates with hydration-safe rendering.

## Deployment Instructions

### 1. Push to GitHub
If you haven't already, you can push this project to GitHub using these commands in your terminal:

```bash
# Initialize the repository
git init

# Add all files
git add .

# Create the initial commit
git commit -m "Initial commit of FinancePal Pro"

# Link to your new GitHub repository
# Replace <URL> with your actual repository URL (e.g., https://github.com/user/finance-pal.git)
git remote add origin <URL>

# Push the code
git push -u origin main
```

### 2. Deploy on Vercel
1.  **Import** the project from your GitHub repository to Vercel.
2.  **Environment Variables**: Add the following in Vercel Settings:
    - `GOOGLE_GENAI_API_KEY`: Your Gemini API key from Google AI Studio.
3.  **Firebase Config**: Ensure your `src/firebase/config.ts` matches your Firebase Project settings.
4.  **Build Command**: `npm run build`
5.  **Deploy!**

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database/Auth**: Firebase Firestore & Authentication
- **AI**: Genkit with Google Gemini 2.5 Flash
- **Styling**: Tailwind CSS & ShadCN UI
- **Icons**: Lucide React
