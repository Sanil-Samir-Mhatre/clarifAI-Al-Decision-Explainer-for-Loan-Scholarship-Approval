"""
Veridict — Supabase seed script

Creates 1 admin + 4 student auth users (via Supabase Auth admin API),
their profiles, applications, and pre-computed decisions.

Setup:
    pip install supabase
    export SUPABASE_URL="https://<project-ref>.supabase.co"
    export SUPABASE_SERVICE_ROLE_KEY="<service_role_key>"   # NOT the anon key
    python3 seed_supabase.py

Run schema.sql in the Supabase SQL editor FIRST, before this script.
"""
import os
from supabase import create_client, Client

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


# ---------------------------------------------------------------------------
# Rule engine — identical logic to your Flask /evaluate endpoint. Keep these
# in sync so seeded results match live evaluations.
# ---------------------------------------------------------------------------
def evaluate_rules(a: dict) -> dict:
    score = 100
    triggered = []
    hard_fail = False

    if a["credit_score"] < 580:
        triggered.append("Credit score below minimum threshold (580)")
        hard_fail = True
    if a["prior_default_flag"]:
        triggered.append("Prior loan default on file")
        hard_fail = True
    if a["loan_percent_income"] > 0.40:
        triggered.append("Loan-to-income ratio exceeds 40%")
        hard_fail = True

    if a["documents_missing_ct"] > 0:
        score -= 15 * a["documents_missing_ct"]
        triggered.append(f"{a['documents_missing_ct']} required document(s) missing")
    if a["academic_score"] < 60 and not a["eligibility_criteria_met"]:
        score -= 20
        triggered.append("Academic score below threshold and eligibility criteria not met")
    if a["existing_debt_ratio"] > 0.5:
        score -= 10
        triggered.append("Existing debt ratio above 50%")
    if a["employment_years"] < 1:
        score -= 5
        triggered.append("Employment history under 1 year")

    if a["credit_history_years"] > 10:
        score += 5
    if a["eligibility_criteria_met"] and a["documents_missing_ct"] == 0:
        score += 10

    if hard_fail:
        score = min(score, 20)
        verdict = "Reject"
    elif a["documents_missing_ct"] > 0 or (55 <= a["academic_score"] < 60):
        verdict = "Needs Review"
    else:
        verdict = "Approve" if score >= 60 else "Needs Review"

    score = max(0, min(100, score))
    dist_from_boundary = min(abs(score - 50), abs(score - 70))
    confidence = "High" if dist_from_boundary > 20 else ("Medium" if dist_from_boundary > 8 else "Low")

    fairness_flag = None
    if a["documents_missing_ct"] > 0 and a["income_annual"] < 100000:
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
    """Placeholder standing in for model.predict_proba() until wired to the
    real MLP — correlated with the same signals so the consensus panel
    looks coherent during a demo."""
    z = (
        0.03 * (a["academic_score"] - 60)
        + 0.00002 * (a["income_annual"] - 100000)
        + 0.01 * (a["credit_score"] - 600)
        - 2.0 * a["loan_percent_income"]
        - 1.5 * a["prior_default_flag"]
        - 0.6 * a["documents_missing_ct"]
    )
    prob = 1 / (1 + pow(2.718281828, -z))
    return round(prob * 100, 1)


# ---------------------------------------------------------------------------
# Seed data — 4 students matching the mock application documents
# ---------------------------------------------------------------------------
STUDENTS = [
    {
        "email": "ananya.deshmukh@veridict.app",
        "name": "Ananya Deshmukh",
        "password": "Approve@123",
        "application": dict(
            case_ref="VER-APP-001", label="Clear Approve",
            academic_score=89, income_annual=180000, employment_years=3.5,
            credit_score=754, credit_history_years=6.2,
            loan_amount_requested=60000, loan_percent_income=round(60000/180000, 3),
            existing_debt_ratio=0.12, prior_default_flag=0,
            documents_missing_ct=0, eligibility_criteria_met=1,
        ),
    },
    {
        "email": "rohan.kulkarni@veridict.app",
        "name": "Rohan Kulkarni",
        "password": "Reject@123",
        "application": dict(
            case_ref="VER-APP-002", label="Clear Reject",
            academic_score=64, income_annual=240000, employment_years=1.2,
            credit_score=518, credit_history_years=2.0,
            loan_amount_requested=140000, loan_percent_income=round(140000/240000, 3),
            existing_debt_ratio=0.61, prior_default_flag=1,
            documents_missing_ct=0, eligibility_criteria_met=1,
        ),
    },
    {
        "email": "sanika.pillai@veridict.app",
        "name": "Sanika Pillai",
        "password": "Review@123",
        "application": dict(
            case_ref="VER-APP-003", label="Needs Review (Borderline)",
            academic_score=61, income_annual=310000, employment_years=0.8,
            credit_score=607, credit_history_years=3.4,
            loan_amount_requested=45000, loan_percent_income=round(45000/310000, 3),
            existing_debt_ratio=0.28, prior_default_flag=0,
            documents_missing_ct=1, eligibility_criteria_met=1,
        ),
    },
    {
        "email": "imran.sheikh@veridict.app",
        "name": "Imran Sheikh",
        "password": "Edge@123",
        "application": dict(
            case_ref="VER-APP-004", label="Edge Case (Fairness Review)",
            academic_score=58, income_annual=96000, employment_years=0.3,
            credit_score=615, credit_history_years=1.1,
            loan_amount_requested=30000, loan_percent_income=round(30000/96000, 3),
            existing_debt_ratio=0.22, prior_default_flag=0,
            documents_missing_ct=1, eligibility_criteria_met=0,
        ),
    },
]

ADMIN = {"email": "admin@veridict.app", "name": "Admin", "password": "Admin@123"}


def create_auth_user(email: str, password: str, name: str, role: str) -> str:
    """Creates a confirmed Supabase Auth user and returns its UUID."""
    result = supabase.auth.admin.create_user({
        "email": email,
        "password": password,
        "email_confirm": True,
        "user_metadata": {"name": name, "role": role},
    })
    return result.user.id


def main():
    admin_id = create_auth_user(ADMIN["email"], ADMIN["password"], ADMIN["name"], "admin")
    supabase.table("profiles").insert({
        "id": admin_id, "email": ADMIN["email"], "name": ADMIN["name"], "role": "admin",
    }).execute()
    print(f"Seeded admin: {ADMIN['email']} / {ADMIN['password']}")

    for s in STUDENTS:
        user_id = create_auth_user(s["email"], s["password"], s["name"], "student")
        supabase.table("profiles").insert({
            "id": user_id, "email": s["email"], "name": s["name"], "role": "student",
        }).execute()

        app_data = s["application"]
        app_row = supabase.table("applications").insert({
            "user_id": user_id,
            "case_ref": app_data["case_ref"],
            "label": app_data["label"],
            "profile": app_data,
            "status": "submitted",
        }).execute()
        application_id = app_row.data[0]["id"]

        rule_result = evaluate_rules(app_data)
        model_score = fake_model_score(app_data)
        consensus = round((rule_result["rule_score"] + model_score) / 2, 1)
        final_verdict = rule_result["verdict"]

        supabase.table("decisions").insert({
            "application_id": application_id,
            "user_id": user_id,
            "rule_score": rule_result["rule_score"],
            "model_score": model_score,
            "consensus_score": consensus,
            "verdict": final_verdict,
            "confidence": rule_result["confidence"],
            "triggered_rules": rule_result["triggered_rules"],
            "fairness_flag": rule_result["fairness_flag"],
            "ollama_summary": None,
        }).execute()

        supabase.table("applications").update({"status": final_verdict}).eq("id", application_id).execute()

        print(f"Seeded {s['email']} / {s['password']}  ->  {app_data['case_ref']} "
              f"({app_data['label']}): rule={rule_result['rule_score']} "
              f"model={model_score} consensus={consensus} verdict={final_verdict}")

    print("\nSeed complete. Tables: profiles, applications, decisions, audit_log")


if __name__ == "__main__":
    main()
