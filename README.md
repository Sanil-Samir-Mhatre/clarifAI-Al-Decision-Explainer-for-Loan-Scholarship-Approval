# ClarifAI - AI Decision Explainer for Loan/Scholarship Approval

**TCS Tech Day @ Fr. C. Rodrigues Institute of Technology**

ClarifAI is an explainable AI prototype designed to evaluate loan and scholarship applications using a responsible, transparent, and fair dual-scoring framework.

Created by **[Sanil Samir Mhatre](https://github.com/Sanil-Samir-Mhatre)**

## Problem Statement
AI systems may support decisions such as scholarship or loan approval, but applicants need to understand *why* a decision was made. ClarifAI is an **explainable AI prototype** that recommends approval, rejection, or manual review using mock applicant data. 

The explanations are simple, neutral, and non-biased, supporting transparency and **human review** rather than acting as an absolute final decision maker.

## Features
- **Dual-Scoring Engine:** Combines an interpretable rule-based engine with an AI probability model.
- **Explainable AI (XAI):** Uses live SHAP (SHapley Additive exPlanations) values to break down the impact of every feature on the final score.
- **Actionable Recourse:** Separates verified facts from risk assumptions, providing applicants with specific deltas (e.g., "Improve credit score by +20 points") to reach approval.
- **Fairness Consideration:** Automatically flags applications for manual review if they trigger fairness thresholds or exhibit potential bias.
- **Local AI:** Integrates with Ollama Local AI to generate plain-language executive summaries of the decision, without sending sensitive data to external APIs.

## Project Structure
- `frontend/`: Next.js & React frontend. Provides separate views for Students (Application Submission & History) and Admins (Application Queue, Metrics, & Review).
- `backend/`: Python/Flask backend. Houses the mock data evaluator, the rule-based logic, the local ML model predictions, and SHAP computations.

## How to Run

### Backend
1. Navigate to the `backend` directory.
2. Install requirements (e.g., `pip install flask shap scikit-learn pandas numpy`).
3. Run the Flask server:
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:5000`.

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`.

### Local AI (Ollama)
Ensure you have [Ollama](https://ollama.ai) installed and running locally on port `11434` with the appropriate model (e.g., `llama3` or `mistral`) to generate the one-line executive verdicts.

## Future Scope
- Multi-modal Analysis (OCR integration for document verification)
- Automated Fairness Audits (monitoring model drift)
- Conversational Agents for personalized financial coaching
- Blockchain Audit Trails for regulatory compliance