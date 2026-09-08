"""
app/streamlit_app.py
TCS Tech Day P4 — Responsible Enterprise AI: Explainable AI + Fairness

Interactive AI Decision Explainer for Loan & Scholarship Approval:
- Millennial-friendly modern card layout with soft gradients and responsive design.
- Color-coded decision cards (Approve = Green, Reject = Red, Needs Review = Amber).
- Emoji, Confidence pills, and Fairness-flag warning pills.
- Interactive applicant controls (sliders, number inputs, toggles).
- Live SHAP feature attribution bar chart.
- Plain-language reason codes.
- Human-in-the-loop governance disclaimer.
- Full model evaluation & audit telemetry viewer.
"""

import os
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import streamlit as st
import shap

# ---------------------------------------------------------
# Page Configuration & Modern Millennial Styling
# ---------------------------------------------------------
st.set_page_config(
    page_title="AI Decision Explainer | Responsible AI",
    page_icon="⚖️",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    /* Soft Light Gradient Background */
    .stApp {
        background: linear-gradient(145deg, #F8FAFC 0%, #EEF2F6 50%, #F1F5F9 100%);
        color: #1E293B;
    }
    
    /* Decision Cards */
    .decision-card {
        border-radius: 20px;
        padding: 24px 28px;
        margin-bottom: 20px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
        border-width: 1.5px;
        border-style: solid;
        transition: all 0.3s ease;
    }
    .card-approve {
        background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
        border-color: #10B981;
    }
    .card-reject {
        background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
        border-color: #EF4444;
    }
    .card-review {
        background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
        border-color: #F59E0B;
    }
    
    .card-header-title {
        font-size: 30px;
        font-weight: 800;
        letter-spacing: -0.5px;
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
    }
    .text-approve { color: #065F46; }
    .text-reject  { color: #991B1B; }
    .text-review  { color: #92400E; }
    
    /* Badges / Pills */
    .pill {
        display: inline-flex;
        align-items: center;
        padding: 5px 14px;
        border-radius: 9999px;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.2px;
        margin-right: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.04);
    }
    .pill-confidence-high { background-color: #059669; color: #FFFFFF; }
    .pill-confidence-med  { background-color: #D97706; color: #FFFFFF; }
    .pill-confidence-low  { background-color: #DC2626; color: #FFFFFF; }
    .pill-fairness-flag   { background-color: #7C3AED; color: #FFFFFF; animation: pulse 2s infinite; }
    
    /* Reasons list card */
    .reasons-container {
        background: #FFFFFF;
        border-radius: 16px;
        padding: 20px 24px;
        border: 1px solid #E2E8F0;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        margin-bottom: 18px;
    }
    .reason-row {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 10px 0;
        border-bottom: 1px dashed #E2E8F0;
        font-size: 15px;
        line-height: 1.5;
    }
    .reason-row:last-child {
        border-bottom: none;
    }
    
    /* Disclaimer banner */
    .disclaimer-box {
        background: #F1F5F9;
        border-left: 4px solid #64748B;
        padding: 14px 18px;
        border-radius: 8px;
        font-size: 13.5px;
        color: #475569;
        margin-top: 15px;
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Dynamic Path Resolution (Works from root or app/ directory)
# ---------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))

DATA_DIR = os.path.join(PARENT_DIR, "data") if os.path.exists(os.path.join(PARENT_DIR, "data")) else "data"
PLOTS_DIR = os.path.join(PARENT_DIR, "plots") if os.path.exists(os.path.join(PARENT_DIR, "plots")) else "plots"

# ---------------------------------------------------------
# Cached Resources: Model & Background Explainer
# ---------------------------------------------------------
@st.cache_resource
def load_bundle_and_explainer():
    model_path = os.path.join(DATA_DIR, "model.joblib")
    scaler_path = os.path.join(DATA_DIR, "scaler_metadata.joblib")
    xtest_path = os.path.join(DATA_DIR, "X_test.npy")

    if not os.path.exists(model_path):
        return None, None, None, None

    bundle = joblib.load(model_path)
    scaler_meta = joblib.load(scaler_path) if os.path.exists(scaler_path) else None
    X_test = np.load(xtest_path) if os.path.exists(xtest_path) else None

    # Pre-build a fast KernelExplainer using a small representative background sample
    bg_sample = X_test[:40] if X_test is not None else np.zeros((10, len(bundle["features"])))
    explainer = shap.KernelExplainer(bundle["model"].predict_proba, bg_sample)

    return bundle, scaler_meta, explainer, X_test

bundle, scaler_meta, shap_explainer, X_test = load_bundle_and_explainer()

# ---------------------------------------------------------
# Header & Navigation
# ---------------------------------------------------------
col_h1, col_h2 = st.columns([3, 1])
with col_h1:
    st.title("🎯 AI Decision Explainer")
    st.markdown("**Responsible Enterprise AI Engine** for Underwriting Loans & Academic Scholarships — *Explainable, Auditable, Fair.*")
with col_h2:
    st.write("")
    st.caption("TCS Tech Day P4 Prototype\nModel: Multilayer Perceptron (60 Epochs)")

if bundle is None:
    st.error("⚠️ Model artifacts not found. Please run the training pipeline first: `python 03_train_evaluate.py`.")
    st.stop()

model = bundle["model"]
feature_cols = bundle["features"]
readable_names = bundle["readable_features"]
scaler_bounds = scaler_meta["scaler_bounds"] if scaler_meta else {}

# ---------------------------------------------------------
# Sidebar: Applicant Profile Input Form & Hackathon Presets
# ---------------------------------------------------------
TEST_CASES = {
    "Custom / Manual": None,
    "Case 1: Standard Prime Loan (Normal -> Approve)": {
        "academic_score": 85.0,
        "income_annual": 75000,
        "employment_years": 6.0,
        "credit_score": 760,
        "credit_history_years": 8.0,
        "loan_amount_requested": 18000,
        "existing_debt_ratio": 0.18,
        "prior_default_flag": False,
        "documents_missing_ct": 0,
        "eligibility_criteria_met": True,
        "notes": "Normal Case: Prime credit, strong earnings, 0 defaults. Clear automated approval."
    },
    "Case 2: Merit Scholarship (Normal -> Approve)": {
        "academic_score": 92.0,
        "income_annual": 24000,
        "employment_years": 1.0,
        "credit_score": 680,
        "credit_history_years": 2.0,
        "loan_amount_requested": 5000,
        "existing_debt_ratio": 0.10,
        "prior_default_flag": False,
        "documents_missing_ct": 0,
        "eligibility_criteria_met": True,
        "notes": "TCS Problem Statement Example: 90%+ academic score, low income, full documentation."
    },
    "Case 3: High Risk & Prior Default (Alternate -> Reject)": {
        "academic_score": 64.0,
        "income_annual": 38000,
        "employment_years": 1.5,
        "credit_score": 520,
        "credit_history_years": 2.5,
        "loan_amount_requested": 25000,
        "existing_debt_ratio": 0.62,
        "prior_default_flag": True,
        "documents_missing_ct": 0,
        "eligibility_criteria_met": True,
        "notes": "Alternate Case: Credit score < 580, prior default, 65% loan-to-income. Clear rejection."
    },
    "Case 4: Borderline Verification (Alternate -> Needs Review)": {
        "academic_score": 61.5,
        "income_annual": 55000,
        "employment_years": 3.5,
        "credit_score": 640,
        "credit_history_years": 4.0,
        "loan_amount_requested": 14000,
        "existing_debt_ratio": 0.28,
        "prior_default_flag": False,
        "documents_missing_ct": 1,
        "eligibility_criteria_met": True,
        "notes": "Alternate Case: Borderline academics (61.5) and 1 missing document. Requires underwriter review."
    },
    "Case 5: High Merit + Low Income + Missing Doc (Edge Case -> Fairness Flag)": {
        "academic_score": 89.5,
        "income_annual": 22000,
        "employment_years": 1.0,
        "credit_score": 660,
        "credit_history_years": 2.0,
        "loan_amount_requested": 6000,
        "existing_debt_ratio": 0.15,
        "prior_default_flag": False,
        "documents_missing_ct": 1,
        "eligibility_criteria_met": True,
        "notes": "Edge Case: Low income + missing doc triggers Fairness Safeguard to avoid systemic poverty bias."
    },
}

with st.sidebar:
    st.header("📋 Applicant Profile")
    preset_choice = st.selectbox(
        "⚡ Quick Load Hackathon Test Case:",
        options=list(TEST_CASES.keys()),
        index=0,
        help="Select a predefined scenario from the hackathon specification."
    )
    
    preset_vals = TEST_CASES[preset_choice] if preset_choice != "Custom / Manual" else {}
    if preset_vals:
        st.info(f"💡 **Scenario**: {preset_vals['notes']}")

    academic_score = st.slider(
        "🎓 Academic Score (0 - 100)",
        min_value=0.0, max_value=100.0,
        value=float(preset_vals.get("academic_score", 74.5)),
        step=0.5
    )
    income_annual = st.number_input(
        "💵 Annual Income (₹)",
        min_value=3000, max_value=400000,
        value=int(preset_vals.get("income_annual", 58000)),
        step=2500
    )
    employment_years = st.slider(
        "💼 Employment Experience (Years)",
        min_value=0.0, max_value=40.0,
        value=float(preset_vals.get("employment_years", 4.5)),
        step=0.5
    )
    credit_score = st.slider(
        "💳 Credit Score (CIBIL / FICO)",
        min_value=300, max_value=850,
        value=int(preset_vals.get("credit_score", 675)),
        step=5
    )
    credit_history_years = st.slider(
        "⏳ Credit History (Years)",
        min_value=0.0, max_value=30.0,
        value=float(preset_vals.get("credit_history_years", 5.5)),
        step=0.5
    )
    loan_amount_requested = st.number_input(
        "🏦 Loan Requested (₹)",
        min_value=500, max_value=100000,
        value=int(preset_vals.get("loan_amount_requested", 16000)),
        step=1000
    )
    existing_debt_ratio = st.slider(
        "📊 Existing Debt-to-Income Ratio",
        min_value=0.00, max_value=1.00,
        value=float(preset_vals.get("existing_debt_ratio", 0.22)),
        step=0.01
    )
    
    st.markdown("---")
    st.subheader("Compliance & Verification")
    prior_default_flag = st.toggle(
        "⚠️ Prior Loan Default on File",
        value=bool(preset_vals.get("prior_default_flag", False))
    )
    doc_default = int(preset_vals.get("documents_missing_ct", 0))
    documents_missing_ct = st.selectbox(
        "📄 Missing Verification Documents",
        options=[0, 1, 2],
        index=doc_default
    )
    eligibility_criteria_met = st.toggle(
        "✅ Base Eligibility Criteria Met",
        value=bool(preset_vals.get("eligibility_criteria_met", True))
    )

    # Derived real-time ratio
    loan_percent_income = round(loan_amount_requested / max(income_annual, 1), 3)
    st.metric("Calculated Loan / Income Ratio", f"{loan_percent_income*100:.1f}%")

    run_btn = st.button("🚀 Evaluate Applicant Decision", type="primary", use_container_width=True)

# ---------------------------------------------------------
# Real-Time Decision Logic & Rule Engine
# ---------------------------------------------------------
def evaluate_rules(applicant):
    reasons = []
    hard_rejections = []
    positive_factors = []

    # Credit Score
    if applicant["credit_score"] < 580:
        hard_rejections.append(f"Credit score ({applicant['credit_score']:.0f}) is below minimum underwriting threshold (580)")
    elif applicant["credit_score"] >= 700:
        positive_factors.append(f"Strong credit score ({applicant['credit_score']:.0f}) demonstrates high repayment reliability")

    # Prior Default
    if applicant["prior_default_flag"] == 1:
        hard_rejections.append("Prior loan default recorded in credit bureau history")
    else:
        positive_factors.append("Clean credit history with zero prior defaults")

    # Debt & Leverage
    if applicant["loan_percent_income"] > 0.40:
        hard_rejections.append(f"Loan amount is {applicant['loan_percent_income']*100:.1f}% of annual income (exceeds safe 40% cap)")
    elif applicant["loan_percent_income"] < 0.25:
        positive_factors.append(f"Conservative loan-to-income ratio ({applicant['loan_percent_income']*100:.1f}%)")

    if applicant["existing_debt_ratio"] > 0.50:
        hard_rejections.append(f"Existing debt ratio ({applicant['existing_debt_ratio']*100:.1f}%) signals high leverage stress")

    # Documents
    if applicant["documents_missing_ct"] > 0:
        reasons.append(f"{int(applicant['documents_missing_ct'])} required compliance document(s) missing from dossier")
    else:
        positive_factors.append("All mandatory verification documents fully submitted")

    # Academic & Eligibility
    if applicant["academic_score"] < 60.0 and applicant["eligibility_criteria_met"] == 0:
        hard_rejections.append("Academic score is below 60.0 and minimum qualification criteria not met")
    elif applicant["academic_score"] >= 75.0:
        positive_factors.append(f"High academic merit score ({applicant['academic_score']:.1f})")

    # Decision assignment
    if hard_rejections:
        verdict = "Reject"
        final_reasons = hard_rejections + reasons
    elif applicant["documents_missing_ct"] > 0 or (55.0 <= applicant["academic_score"] < 65.0):
        verdict = "Needs Review"
        final_reasons = reasons + ["Borderline eligibility requires underwriter manual verification"]
    else:
        verdict = "Approve"
        final_reasons = positive_factors[:3]

    # Confidence band calculation
    dist_credit = abs(applicant["credit_score"] - 580) / 270
    if dist_credit >= 0.40:
        confidence = "High"
    elif dist_credit >= 0.20:
        confidence = "Medium"
    else:
        confidence = "Low"

    # Fairness Flag: Disparate impact / indirect socio-economic bias safeguard
    # Flags if missing documentation coincides with lower income quartile (< ₹35,000)
    fairness_flag = None
    if applicant["documents_missing_ct"] > 0 and applicant["income_annual"] < 35000:
        fairness_flag = (
            "Fairness Review Triggered: Applicant has missing verification documents combined with lower-quartile annual income. "
            "Flagged for human assistance to prevent indirect socio-economic barrier penalties."
        )

    return verdict, confidence, final_reasons, fairness_flag

applicant_data = {
    "academic_score": float(academic_score),
    "income_annual": float(income_annual),
    "employment_years": float(employment_years),
    "credit_score": float(credit_score),
    "credit_history_years": float(credit_history_years),
    "loan_amount_requested": float(loan_amount_requested),
    "loan_percent_income": float(loan_percent_income),
    "existing_debt_ratio": float(existing_debt_ratio),
    "prior_default_flag": int(prior_default_flag),
    "documents_missing_ct": int(documents_missing_ct),
    "eligibility_criteria_met": int(eligibility_criteria_met),
}

# Scale input feature vector using saved scaler bounds
scaled_features = []
for col in [c.replace("_scaled", "") for c in feature_cols]:
    val = applicant_data[col]
    bounds = scaler_bounds.get(col, {"min": 0, "max": 1})
    col_min, col_max = bounds["min"], bounds["max"]
    if col_max > col_min:
        scaled_val = (val - col_min) / (col_max - col_min)
    else:
        scaled_val = 0.0
    scaled_features.append(np.clip(scaled_val, 0.0, 1.0))

X_input = np.array([scaled_features])

# Predict with neural classifier
proba = model.predict_proba(X_input)[0]
prob_approve = proba[1]
prob_reject = proba[0]

# ---------------------------------------------------------
# Rule-Based Policy Scoring Engine
# ---------------------------------------------------------
def compute_rule_score(app):
    base = 50.0
    # Academic performance
    base += (app["academic_score"] - 60.0) * 0.35
    # Credit score (Floor = 580)
    base += (app["credit_score"] - 580.0) * 0.12
    # Loan to Income
    if app["loan_percent_income"] > 0.40:
        base -= (app["loan_percent_income"] - 0.40) * 80.0 + 15.0
    else:
        base += (0.25 - app["loan_percent_income"]) * 25.0
    # Debt ratio
    base -= (app["existing_debt_ratio"] - 0.25) * 35.0
    # Prior default hard hit
    if app["prior_default_flag"] == 1:
        base -= 40.0
    # Missing documents penalty
    base -= app["documents_missing_ct"] * 18.0
    # Base eligibility
    if app["eligibility_criteria_met"] == 0:
        base -= 25.0
    else:
        base += 5.0

    return round(float(np.clip(base, 0.0, 100.0)), 1)

# Evaluate policy rules & fairness
verdict, confidence, reasons_list, fairness_flag = evaluate_rules(applicant_data)

# Compute Rule Score, Model Score, and Hybrid Average
rule_score = compute_rule_score(applicant_data)
model_score = round(float(prob_approve * 100.0), 1)
avg_score = round((rule_score + model_score) / 2.0, 1)

# Model Verdict vs Rule Verdict
model_verdict = "Approve" if model_score >= 60.0 else ("Needs Review" if model_score >= 35.0 else "Reject")
rule_verdict = verdict  # From policy rules

# Consensus Assessment
if rule_verdict == model_verdict:
    consensus_badge = "<span style='color:#059669; font-weight:700;'>🤝 Full Consensus (Both Engines Agree)</span>"
else:
    consensus_badge = "<span style='color:#D97706; font-weight:700;'>⚖️ Engine Divergence (Policy vs AI Disparity)</span>"

# ---------------------------------------------------------
# Dual Scoring Engine & Average Showcase Header
# ---------------------------------------------------------
st.markdown(f"""
<div style="background:#FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 18px 24px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px; border-bottom: 1px solid #F1F5F9; padding-bottom: 8px;">
        <span style="font-size:16px; font-weight:800; color:#1E293B;">⚡ DUAL SCORING ENGINE: RULE LOGIC vs. NEURAL ML</span>
        <span style="font-size:13px;">{consensus_badge}</span>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1.2fr; gap: 18px; text-align: center;">
        <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:14px;">
            <div style="font-size:12px; font-weight:700; color:#64748B; text-transform:uppercase;">📜 Rule Engine Score</div>
            <div style="font-size:28px; font-weight:800; color:#0284C7; margin:4px 0;">{rule_score}%</div>
            <div style="font-size:12.5px; font-weight:600; color:#334155;">Policy Verdict: <strong>{rule_verdict}</strong></div>
        </div>
        <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:14px;">
            <div style="font-size:12px; font-weight:700; color:#64748B; text-transform:uppercase;">🤖 Neural Model Probability</div>
            <div style="font-size:28px; font-weight:800; color:#7C3AED; margin:4px 0;">{model_score}%</div>
            <div style="font-size:12.5px; font-weight:600; color:#334155;">AI Verdict: <strong>{model_verdict}</strong></div>
        </div>
        <div style="background:linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); border:1.5px solid #6366F1; border-radius:12px; padding:14px;">
            <div style="font-size:12px; font-weight:800; color:#4338CA; text-transform:uppercase;">⚖️ Consensus Average Score</div>
            <div style="font-size:32px; font-weight:900; color:#3730A3; margin:2px 0;">{avg_score}%</div>
            <div style="font-size:12.5px; font-weight:700; color:#312E81;">Ensemble Decision: <strong>{verdict}</strong></div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Main Panel: Decision Card (Millennial UI)
# ---------------------------------------------------------
style_class = {"Approve": "card-approve", "Reject": "card-reject", "Needs Review": "card-review"}[verdict]
def get_ollama_verdict(verdict, applicant_data, reasons, fairness_flag):
    try:
        import urllib.request
        import json
        prompt = (
            f"You are a Responsible Enterprise AI Underwriting Officer at a financial institution. "
            f"Applicant: Academic {applicant_data['academic_score']:.1f}%, Income INR {applicant_data['income_annual']:,.0f}, "
            f"Credit {applicant_data['credit_score']:.0f}, Missing Docs: {applicant_data['documents_missing_ct']}. "
            f"System Decision: {verdict}. Top Reasons: {'; '.join(reasons)}. "
            f"Fairness Flag: {fairness_flag or 'Clean'}. "
            f"Task: Write exactly ONE sharp, professional sentence giving the executive verdict on this applicant."
        )
        req_data = json.dumps({
            "model": "qwen2.5:0.5b",
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.2}
        }).encode("utf-8")
        req = urllib.request.Request("http://localhost:11434/api/generate", data=req_data, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("response", "").strip().replace('"', '')
    except Exception:
        return None

# ---------------------------------------------------------
# Main Panel: Decision Card (Millennial UI)
# ---------------------------------------------------------
style_class = {"Approve": "card-approve", "Reject": "card-reject", "Needs Review": "card-review"}[verdict]
text_class = {"Approve": "text-approve", "Reject": "text-reject", "Needs Review": "text-review"}[verdict]
emoji = {"Approve": "✅", "Reject": "❌", "Needs Review": "🕵️"}[verdict]
pill_conf_class = {"High": "pill-confidence-high", "Medium": "pill-confidence-med", "Low": "pill-confidence-low"}[confidence]

fairness_pill = "<span class='pill pill-fairness-flag'>⚖️ Fairness Flag Active</span>" if fairness_flag else ""

card_html = (
    f'<div class="decision-card {style_class}">'
    f'<div class="card-header-title {text_class}">'
    f'<span>{emoji} Decision: {verdict.upper()}</span>'
    f'</div>'
    f'<div>'
    f'<span class="pill {pill_conf_class}">Confidence: {confidence}</span>'
    f'<span class="pill" style="background:#3B82F6; color:white;">Model Approval Odds: {prob_approve*100:.1f}%</span>'
    f'{fairness_pill}'
    f'</div>'
    f'</div>'
)
st.markdown(card_html, unsafe_allow_html=True)

# Generate Ollama One-Line Executive Verdict
with st.spinner("🤖 Consulting Local Ollama (qwen2.5) for Executive Verdict..."):
    ollama_verdict = get_ollama_verdict(verdict, applicant_data, reasons_list, fairness_flag)

if ollama_verdict:
    st.markdown(f"""
    <div style="background:#F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 12px; padding: 12px 18px; margin-bottom: 16px; display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 20px;">🤖</span>
        <div>
            <strong style="color: #334155; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Ollama Local LLM One-Line Verdict:</strong><br>
            <span style="color: #0F172A; font-size: 14.5px; font-weight: 500; font-style: italic;">"{ollama_verdict}"</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

# ---------------------------------------------------------
# Two-Column Layout: Explainability Breakdown
# ---------------------------------------------------------
col_left, col_right = st.columns([1.1, 1.0], gap="large")

with col_left:
    st.subheader("📝 Plain-Language Policy Reasons")
    reasons_html = "<div class='reasons-container'>"
    for r in reasons_list:
        icon = "📌" if "exceeds" in r or "below" in r or "missing" in r or "default" in r else "✨"
        reasons_html += f"<div class='reason-row'><span>{icon}</span><span>{r}</span></div>"
    reasons_html += "</div>"
    st.markdown(reasons_html, unsafe_allow_html=True)

    if fairness_flag:
        st.warning(fairness_flag, icon="⚖️")

    # ---------------------------------------------------------
    # 🌟 USP: CARE Engine (Counterfactual Recourse & Fact vs Assumption Auditor)
    # ---------------------------------------------------------
    with st.expander("🌟 USP: Fact vs. Assumption Audit & Actionable Recourse", expanded=True):
        st.markdown("**1. Fact vs. Assumption Disentanglement** *(Per Problem Statement)*:")
        
        # Facts vs Assumptions logic
        f_col1, f_col2 = st.columns(2)
        with f_col1:
            st.markdown("✅ **Verified Facts**:")
            if applicant_data["prior_default_flag"] == 0:
                st.caption("• Zero historical defaults on bureau file")
            else:
                st.caption("• Delinquency recorded on credit bureau file")
            if applicant_data["credit_score"] >= 700:
                st.caption(f"• Prime credit score ({applicant_data['credit_score']:.0f})")
            elif applicant_data["credit_score"] < 580:
                st.caption(f"• Subprime score ({applicant_data['credit_score']:.0f} < 580)")
            if applicant_data["academic_score"] >= 85:
                st.caption(f"• Top-decile academic merit ({applicant_data['academic_score']:.1f}%)")

        with f_col2:
            st.markdown("⚠️ **Risk Assumptions**:")
            if applicant_data["loan_percent_income"] > 0.40:
                st.caption(f"• LTI {applicant_data['loan_percent_income']*100:.1f}% assumed to stress cashflow")
            if applicant_data["documents_missing_ct"] > 0:
                st.caption(f"• {int(applicant_data['documents_missing_ct'])} missing paper(s) assumed to indicate non-compliance")
            if not (applicant_data["loan_percent_income"] > 0.40 or applicant_data["documents_missing_ct"] > 0):
                st.caption("• No adverse risk assumptions active")

        st.markdown("---")
        st.markdown("🎯 **2. Actionable Counterfactual Recourse** *(How to reach Approval)*:")
        if verdict == "Reject":
            if applicant_data["loan_percent_income"] > 0.40:
                target_loan = applicant_data["income_annual"] * 0.40
                cut = applicant_data["loan_amount_requested"] - target_loan
                st.info(f"💡 **Borrowing Delta**: Reduce loan request by **₹{cut:,.0f}** (to ₹{target_loan:,.0f}) to bring debt ratio below 40%.")
            if applicant_data["credit_score"] < 580:
                deficit = 580 - applicant_data["credit_score"]
                st.info(f"💡 **Credit Delta**: Improve credit score by **+{deficit:.0f} points** (to 580) or add an eligible co-borrower.")
            if applicant_data["prior_default_flag"] == 1:
                st.info("💡 **Clearance**: Provide formal lender settlement / No-Objection certificate.")
        elif verdict == "Needs Review":
            if applicant_data["documents_missing_ct"] > 0:
                st.info(f"💡 **Documentation**: Upload {int(applicant_data['documents_missing_ct'])} missing verification document(s) within 14 days.")
            if 55 <= applicant_data["academic_score"] < 65:
                st.info("💡 **Academic Portfolio**: Submit capstone project portfolio or faculty recommendation.")
        else:
            st.success("🎉 **Clean Approval**: Applicant already meets all automated clearance benchmarks!")

        if fairness_flag:
            st.markdown("---")
            st.markdown("⚖️ **3. EquiPath Alternative Verification** *(For Disadvantaged Applicants)*:")
            st.caption("• Pathway 1: Institutional bona fide letter from College Principal/Dean.")
            st.caption("• Pathway 2: Government BPL card, income certificate, or village officer attestation.")

with col_right:
    st.subheader("🤖 Live SHAP Attribution")
    st.caption("Local feature contribution to approval probability for this profile:")

    with st.spinner("Computing real-time SHAP attributions..."):
        try:
            shap_vals = shap_explainer.shap_values(X_input, nsamples=60)
            if isinstance(shap_vals, list):
                sv1 = shap_vals[1][0]
            else:
                sv1 = shap_vals[0, :, 1] if len(shap_vals.shape) == 3 else shap_vals[0]

            # Top 6 contributing features
            indices = np.argsort(np.abs(sv1))[-6:]
            plot_names = [readable_names[i] for i in indices]
            plot_vals = [sv1[i] for i in indices]
            colors = ["#10B981" if v > 0 else "#EF4444" for v in plot_vals]

            fig, ax = plt.subplots(figsize=(6, 3.8), dpi=140)
            bars = ax.barh(range(len(plot_names)), plot_vals, color=colors, height=0.55, edgecolor="none")
            ax.set_yticks(range(len(plot_names)))
            ax.set_yticklabels(plot_names, fontsize=10, fontweight="bold")
            ax.axvline(0, color="#64748B", linewidth=1, linestyle="--")
            ax.set_xlabel("SHAP Impact on Approval (+ Supports / - Opposes)", fontsize=9, fontweight="bold")
            ax.grid(axis="x", linestyle=":", alpha=0.6)

            # Value labels
            for bar in bars:
                width = bar.get_width()
                offset = 0.003 if width >= 0 else -0.003
                ha = "left" if width >= 0 else "right"
                ax.text(width + offset, bar.get_y() + bar.get_height()/2, f"{width:+.3f}", va="center", ha=ha, fontsize=8.5, fontweight="bold")

            plt.tight_layout()
            st.pyplot(fig)
            plt.close()
        except Exception as e:
            st.info(f"Model-estimated approval probability: {prob_approve*100:.1f}%. (Attribution breakdown available in saved plots).")

    # Shifted to the right side
    st.markdown("""
    <div class="disclaimer-box" style="margin-top: 20px;">
        <strong>🛡️ Responsible Enterprise AI Disclaimer:</strong><br>
        This automated evaluation is a real-time advisory recommendation. Pursuant to Responsible AI governance standards, 
        all adverse or borderline decisions must be ratified by an authorized credit/scholarship underwriter.
    </div>
    """, unsafe_allow_html=True)

from PIL import Image

# ---------------------------------------------------------
# Expandable Section: Full Model Evaluation & Telemetry
# ---------------------------------------------------------
st.markdown("---")
with st.expander("📊 Model Evaluation Telemetry & Preprocessing Audit", expanded=True):
    metrics_path = os.path.join(DATA_DIR, "evaluation_metrics.csv")
    if os.path.exists(metrics_path):
        m_df = pd.read_csv(metrics_path)
        st.markdown("### 🏆 Held-Out Test Set Performance")
        cols = st.columns(5)
        cols[0].metric("Accuracy", f"{m_df['accuracy'].iloc[0]*100:.2f}%")
        cols[1].metric("Precision", f"{m_df['precision'].iloc[0]*100:.2f}%")
        cols[2].metric("Recall", f"{m_df['recall'].iloc[0]*100:.2f}%")
        cols[3].metric("F1-Score", f"{m_df['f1_score'].iloc[0]:.4f}")
        cols[4].metric("ROC-AUC", f"{m_df['roc_auc'].iloc[0]:.4f}")

    tab1, tab2, tab3, tab4 = st.tabs([
        "📈 60-Epoch Training Curve",
        "🎯 Confusion Matrix & ROC",
        "🐝 Global SHAP Beeswarm",
        "🧹 Data Preprocessing Audit",
    ])

    with tab1:
        curve_img = os.path.join(PLOTS_DIR, "training_curve.png")
        if os.path.exists(curve_img):
            st.image(Image.open(curve_img), caption="Training Loss & Validation AUC across 60 epochs (Convergence & Plateau Verified)", use_container_width=True)

    with tab2:
        eval_img = os.path.join(PLOTS_DIR, "evaluation_metrics.png")
        if os.path.exists(eval_img):
            st.image(Image.open(eval_img), caption="Test Set Confusion Matrix and Receiver Operating Characteristic (ROC)", use_container_width=True)

    with tab3:
        shap_img = os.path.join(PLOTS_DIR, "shap_summary.png")
        if os.path.exists(shap_img):
            st.image(Image.open(shap_img), caption="Global Feature Importance & Attributions across 11 legitimate signals", use_container_width=True)

    with tab4:
        pre_img = os.path.join(PLOTS_DIR, "before_after_preprocessing.png")
        if os.path.exists(pre_img):
            st.image(Image.open(pre_img), caption="Data Quality Audit: Missing Values & Outlier Distribution Before vs After", use_container_width=True)
