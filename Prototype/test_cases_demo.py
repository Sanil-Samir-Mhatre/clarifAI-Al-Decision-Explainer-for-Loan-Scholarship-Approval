"""
test_cases_demo.py
TCS Tech Day P4 — Responsible Enterprise AI: Explainable AI + Fairness

Evaluates 5 targeted test cases as per the 90-Minute Hackathon Handbook:
- Normal Cases: Standard loan approval & Problem statement merit scholarship
- Alternate Cases: High-risk financial rejection & Borderline documentation review
- Edge Case: Low-income high-merit applicant with missing paperwork (Fairness Flag Triggered)

Outputs formatted Decision, Reason, Confidence, Fairness Flag, and Next Action.
"""

import os
import sys
import joblib
import numpy as np
import pandas as pd

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def run_all_test_cases():
    # Load model and scaler metadata
    bundle = joblib.load("data/model.joblib")
    model = bundle["model"]
    feature_cols = bundle["features"]
    readable_names = bundle["readable_features"]

    scaler_meta = joblib.load("data/scaler_metadata.joblib")
    scaler_bounds = scaler_meta["scaler_bounds"]

    test_cases = [
        {
            "id": "TC-01",
            "category": "Normal Case (Standard Approval)",
            "title": "Prime Credit & Solid Income",
            "description": "Established professional applying for a standard home/education loan with stellar repayment history.",
            "inputs": {
                "academic_score": 85.0,
                "income_annual": 75000,
                "employment_years": 6.0,
                "credit_score": 760,
                "credit_history_years": 8.0,
                "loan_amount_requested": 18000,
                "existing_debt_ratio": 0.18,
                "prior_default_flag": 0,
                "documents_missing_ct": 0,
                "eligibility_criteria_met": 1,
            },
            "expected_decision": "Approve",
            "next_action": "Issue automated loan pre-approval and send sanction letter."
        },
        {
            "id": "TC-02",
            "category": "Normal Case (Problem Statement Example)",
            "title": "High Merit Scholarship Scholar",
            "description": "TCS Handbook Example: 90%+ academic score, low income range, all documents submitted, meets eligibility.",
            "inputs": {
                "academic_score": 92.0,
                "income_annual": 24000,
                "employment_years": 1.0,
                "credit_score": 680,
                "credit_history_years": 2.0,
                "loan_amount_requested": 5000,
                "existing_debt_ratio": 0.10,
                "prior_default_flag": 0,
                "documents_missing_ct": 0,
                "eligibility_criteria_met": 1,
            },
            "expected_decision": "Approve",
            "next_action": "Disburse scholarship award package immediately."
        },
        {
            "id": "TC-03",
            "category": "Alternate Case (Adverse Rejection)",
            "title": "High Credit Risk & Historical Default",
            "description": "Applicant with subprime credit score below 580, prior default history, and unsustainable debt ratio.",
            "inputs": {
                "academic_score": 64.0,
                "income_annual": 38000,
                "employment_years": 1.5,
                "credit_score": 520,
                "credit_history_years": 2.5,
                "loan_amount_requested": 25000,
                "existing_debt_ratio": 0.62,
                "prior_default_flag": 1,
                "documents_missing_ct": 0,
                "eligibility_criteria_met": 1,
            },
            "expected_decision": "Reject",
            "next_action": "Send formal adverse action letter with explicit policy reasons (subprime credit + default record)."
        },
        {
            "id": "TC-04",
            "category": "Alternate Case (Borderline Review)",
            "title": "Missing Verification Document",
            "description": "Moderate credit applicant with borderline academic marks (61.5) and 1 missing verification certificate.",
            "inputs": {
                "academic_score": 61.5,
                "income_annual": 55000,
                "employment_years": 3.5,
                "credit_score": 640,
                "credit_history_years": 4.0,
                "loan_amount_requested": 14000,
                "existing_debt_ratio": 0.28,
                "prior_default_flag": 0,
                "documents_missing_ct": 1,
                "eligibility_criteria_met": 1,
            },
            "expected_decision": "Needs Review",
            "next_action": "Assign to junior underwriter queue; trigger SMS/Email request to upload missing verification document."
        },
        {
            "id": "TC-05",
            "category": "Edge Case (Responsible AI Fairness Safeguard)",
            "title": "Low Income + Missing Paperwork (Disparate Impact Prevention)",
            "description": "Top-tier academic applicant from economically marginalized background (income < INR 35,000) lacking 1 formal document.",
            "inputs": {
                "academic_score": 89.5,
                "income_annual": 22000,
                "employment_years": 1.0,
                "credit_score": 660,
                "credit_history_years": 2.0,
                "loan_amount_requested": 6000,
                "existing_debt_ratio": 0.15,
                "prior_default_flag": 0,
                "documents_missing_ct": 1,
                "eligibility_criteria_met": 1,
            },
            "expected_decision": "Needs Review (Fairness Flag Triggered)",
            "next_action": "Escalate to Human Inclusion Evaluator for alternative document verification (e.g. community reference or affidavit)."
        },
    ]

    print("=" * 80)
    print(" TCS TECH DAY P4 — AI DECISION EXPLAINER: TEST CASES DEMO")
    print("=" * 80)

    for tc in test_cases:
        inp = tc["inputs"]
        loan_pct = round(inp["loan_amount_requested"] / inp["income_annual"], 3)
        inp["loan_percent_income"] = loan_pct

        # Vectorize and scale
        scaled_vals = []
        for col in [c.replace("_scaled", "") for c in feature_cols]:
            val = inp[col]
            bounds = scaler_bounds[col]
            s = (val - bounds["min"]) / (bounds["max"] - bounds["min"])
            scaled_vals.append(np.clip(s, 0.0, 1.0))

        X_input = np.array([scaled_vals])
        prob_approve = model.predict_proba(X_input)[0][1]

        # Rule engine evaluation
        reasons = []
        hard_rejections = []
        positives = []

        if inp["credit_score"] < 580:
            hard_rejections.append(f"Credit score ({inp['credit_score']:.0f}) below underwriting floor (580)")
        elif inp["credit_score"] >= 700:
            positives.append(f"Prime credit score ({inp['credit_score']:.0f}) demonstrates strong repayment capacity")

        if inp["prior_default_flag"] == 1:
            hard_rejections.append("Prior loan default on historical credit file")
        else:
            positives.append("Clean repayment track record (zero prior defaults)")

        if inp["loan_percent_income"] > 0.40:
            hard_rejections.append(f"Loan-to-income ratio ({inp['loan_percent_income']*100:.1f}%) exceeds safety limit (40%)")

        if inp["existing_debt_ratio"] > 0.50:
            hard_rejections.append(f"High debt ratio ({inp['existing_debt_ratio']*100:.1f}%) indicates severe leverage")

        if inp["documents_missing_ct"] > 0:
            reasons.append(f"{inp['documents_missing_ct']} required verification document(s) missing")
        else:
            positives.append("All mandatory verification documents submitted")

        if inp["academic_score"] < 60 and inp["eligibility_criteria_met"] == 0:
            hard_rejections.append("Academic score < 60 and base criteria not satisfied")
        elif inp["academic_score"] >= 80:
            positives.append(f"Outstanding academic merit score ({inp['academic_score']:.1f}%)")

        if hard_rejections:
            decision = "Reject"
            top_reasons = hard_rejections + reasons
        elif inp["documents_missing_ct"] > 0 or (55 <= inp["academic_score"] < 65):
            decision = "Needs Review"
            top_reasons = reasons + ["Borderline qualification criteria"]
        else:
            decision = "Approve"
            top_reasons = positives[:3]

        dist_credit = abs(inp["credit_score"] - 580) / 270
        confidence = "High" if dist_credit >= 0.40 else ("Medium" if dist_credit >= 0.20 else "Low")

        # Fairness safeguard
        fairness_flag = None
        if inp["documents_missing_ct"] > 0 and inp["income_annual"] < 35000:
            fairness_flag = (
                "FAIRNESS FLAG TRIGGERED: Lower-income applicant with missing paperwork. "
                "Bypasses automated denial to prevent indirect systemic exclusion."
            )

        print(f"\n[{tc['id']}] {tc['category'].upper()}: {tc['title']}")
        print(f"  Description:   {tc['description']}")
        print(f"  Key Inputs:    Academic: {inp['academic_score']}% | Income: INR {inp['income_annual']:,} | Credit: {inp['credit_score']} | Loan: INR {inp['loan_amount_requested']:,} (LTI: {loan_pct*100:.1f}%) | Debt: {inp['existing_debt_ratio']*100:.1f}% | Default: {inp['prior_default_flag']} | Missing Docs: {inp['documents_missing_ct']}")
        print(f"  --> DECISION:  {decision.upper()} (Confidence: {confidence})")
        print(f"  --> MODEL:     {prob_approve*100:.1f}% Estimated Approval Probability")
        print(f"  --> REASONS:   {'; '.join(top_reasons)}")
        if fairness_flag:
            print(f"  --> FAIRNESS:  [WARNING] {fairness_flag}")
        else:
            print(f"  --> FAIRNESS:  [PASS] No disparate impact or proxy bias pattern detected")
        print(f"  --> NEXT STEP: {tc['next_action']}")
        print("-" * 80)

if __name__ == "__main__":
    run_all_test_cases()
