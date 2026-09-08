# Test Cases Specification & Verification Guide
*TCS Tech Day P4 — Responsible Enterprise AI: AI Decision Explainer*
*Compliant with 90-Minute Student Hackathon Handbook Rubric*

This folder contains the complete test suite designed for verifying and demonstrating the AI Decision Explainer prototype.

---

## 📂 Folder Contents

- **`test_cases.json`**: Master JSON array with all 5 test cases, complete input profiles, expected decisions, confidence levels, neural model approval probabilities, reason codes, fairness flags, and next actions.
- **`test_cases.csv`**: Tabular spreadsheet format ready for inspection in Excel or automated pandas loading.
- **`tc01_normal_prime_approval.json`**: Normal Case 1 (Standard Loan Approval).
- **`tc02_normal_scholarship_approval.json`**: Normal Case 2 (TCS Handbook Merit Scholarship Example).
- **`tc03_alternate_adverse_rejection.json`**: Alternate Case 1 (Subprime Credit & Prior Default Rejection).
- **`tc04_alternate_borderline_review.json`**: Alternate Case 2 (Missing Document & Borderline Review).
- **`tc05_edge_fairness_safeguard.json`**: Edge Case (Low Income + Missing Paperwork Fairness Safeguard).

---

## 🎯 Master Test Matrix (User → Input → Output → Success)

| ID | Category | Scenario Title | Inputs Summary | Decision & Confidence | Model Odds | Fairness Note | Next Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | **Normal Case** | Prime Credit & Solid Income | Acad: `85.0%`, Inc: `₹75k`, Credit: `760`, Loan: `₹18k`, Debt: `18%`, Default: `0`, Docs Miss: `0` | **APPROVE** (High) | `98.0%` | None (Clean) | Automated sanction letter issued |
| **TC-02** | **Normal Case** | High Merit Scholar (TCS Example) | Acad: `92.0%`, Inc: `₹24k`, Credit: `680`, Loan: `₹5k`, Debt: `10%`, Default: `0`, Docs Miss: `0` | **APPROVE** (Medium) | `92.9%` | None (Clean) | Fast-track scholarship grant disbursement |
| **TC-03** | **Alternate Case** | High Credit Risk & Prior Default | Acad: `64.0%`, Inc: `₹38k`, Credit: `520`, Loan: `₹25k` (LTI: `65.8%`), Debt: `62%`, Default: `1`, Docs Miss: `0` | **REJECT** (Medium) | `0.0%` | None (Clean) | Issue formal adverse action notice with policy reasons |
| **TC-04** | **Alternate Case** | Borderline Verification | Acad: `61.5%`, Inc: `₹55k`, Credit: `640`, Loan: `₹14k`, Debt: `28%`, Default: `0`, Docs Miss: `1` | **NEEDS REVIEW** (Medium) | `12.1%` | None (Clean) | Route to underwriter; prompt applicant for missing document |
| **TC-05** | **Edge Case** | Low-Income + Missing Paperwork | Acad: `89.5%`, Inc: `₹22k`, Credit: `660`, Loan: `₹6k`, Debt: `15%`, Default: `0`, Docs Miss: `1` | **NEEDS REVIEW** (Medium) | `56.1%` | ⚠️ **FAIRNESS TRIGGERED** | Escalate to Human Inclusion Officer for alternative proof |

---

## 🚀 How to Run the Test Cases

### 1. Interactive Web Demo (Streamlit)
Open the app running at `http://localhost:8501`:
1. Use the **"⚡ Quick Load Hackathon Test Case"** dropdown at the top of the sidebar.
2. Select any test case (`Case 1` through `Case 5`).
3. Sliders and inputs automatically snap to the test case values, live SHAP attribution updates instantly, and decision cards reflect the outcome.

### 2. Automated Terminal Runner
Run the verification script from the project root:
```bash
python test_cases_demo.py
```
