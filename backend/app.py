import os
from flask import Flask, request, jsonify
from flask_cors import CORS
# import shap
# import joblib
# import numpy as np

app = Flask(__name__)
CORS(app) # allow requests from nextjs

def evaluate_rules(a: dict) -> dict:
    score = 100
    triggered = []
    hard_fail = False

    if a.get("credit_score", 0) < 580:
        triggered.append("Credit score below minimum threshold (580)")
        hard_fail = True
    if a.get("prior_default_flag", 0):
        triggered.append("Prior loan default on file")
        hard_fail = True
    if a.get("loan_percent_income", 0) > 0.40:
        triggered.append("Loan-to-income ratio exceeds 40%")
        hard_fail = True

    if a.get("documents_missing_ct", 0) > 0:
        score -= 15 * a["documents_missing_ct"]
        triggered.append(f"{a['documents_missing_ct']} required document(s) missing")
    if a.get("academic_score", 0) < 60 and not a.get("eligibility_criteria_met", 0):
        score -= 20
        triggered.append("Academic score below threshold and eligibility criteria not met")
    if a.get("existing_debt_ratio", 0) > 0.5:
        score -= 10
        triggered.append("Existing debt ratio above 50%")
    if a.get("employment_years", 0) < 1:
        score -= 5
        triggered.append("Employment history under 1 year")

    if a.get("credit_history_years", 0) > 10:
        score += 5
    if a.get("eligibility_criteria_met", 0) and a.get("documents_missing_ct", 0) == 0:
        score += 10

    if hard_fail:
        score = min(score, 20)
        verdict = "Reject"
    elif a.get("documents_missing_ct", 0) > 0 or (55 <= a.get("academic_score", 0) < 60):
        verdict = "Needs Review"
    else:
        verdict = "Approve" if score >= 60 else "Needs Review"

    score = max(0, min(100, score))
    dist_from_boundary = min(abs(score - 50), abs(score - 70))
    confidence = "High" if dist_from_boundary > 20 else ("Medium" if dist_from_boundary > 8 else "Low")

    fairness_flag = None
    if a.get("documents_missing_ct", 0) > 0 and a.get("income_annual", 0) < 100000:
        fairness_flag = ("Low income + missing document overlap — routed to human "
                          "review to avoid indirect income bias.")

    if not triggered:
        triggered.append("All eligibility rules passed")

    return {
        "rule_score": round(score, 1),
        "verdict": verdict,
        "confidence": confidence,
        "triggered_rules": triggered,
        "fairness_flag": fairness_flag,
    }

def fake_model_score(a: dict) -> float:
    z = (
        0.03 * (a.get("academic_score", 60) - 60)
        + 0.00002 * (a.get("income_annual", 100000) - 100000)
        + 0.01 * (a.get("credit_score", 600) - 600)
        - 2.0 * a.get("loan_percent_income", 0)
        - 1.5 * a.get("prior_default_flag", 0)
        - 0.6 * a.get("documents_missing_ct", 0)
    )
    prob = 1 / (1 + pow(2.718281828, -z))
    return round(prob * 100, 1)

@app.route('/evaluate', methods=['POST'])
def evaluate():
    data = request.json
    if not data or 'application' not in data:
        return jsonify({"error": "Missing 'application' field in JSON body"}), 400
    
    app_data = data['application']
    
    rule_result = evaluate_rules(app_data)
    model_score = fake_model_score(app_data)
    
    consensus_score = round((rule_result["rule_score"] + model_score) / 2, 1)
    
    response = {
        "rule_score": rule_result["rule_score"],
        "model_score": model_score,
        "consensus_score": consensus_score,
        "verdict": rule_result["verdict"],
        "confidence": rule_result["confidence"],
        "triggered_rules": rule_result["triggered_rules"],
        "fairness_flag": rule_result["fairness_flag"]
    }
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
