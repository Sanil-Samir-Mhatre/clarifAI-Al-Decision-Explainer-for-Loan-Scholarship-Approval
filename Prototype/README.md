# P4 — Responsible Enterprise AI: AI Decision Explainer for Loan/Scholarship Approval
*TCS Tech Day P4 Prototype — Explainable AI (XAI) & Fairness Safeguards*

This prototype provides an end-to-end, fully auditable, and explainable decision system for underwriting financial loans and academic scholarships. It uses only legitimate, policy-relevant signals, deliberately audits data quality issues, trains an explainable neural model over 60 logged epochs, integrates three complementary XAI methods (SHAP, LIME, and Rule-Based Reason Codes with Fairness Safeguards), and delivers a millennial-friendly, human-in-the-loop Streamlit application.

---

## 🚀 Execution Sequence

To run the complete pipeline from scratch:

```bash
# 1. Install dependencies
pip install pandas numpy scikit-learn matplotlib shap lime streamlit joblib

# 2. Programmatically generate large, unbiased, synthetic dataset (20,000+ rows)
python 01_generate_dataset.py   # -> data/raw_dataset.csv

# 3. Perform data quality audit, IQR capping, median imputation, and Min-Max scaling
python 02_preprocess.py         # -> data/processed_dataset.csv + plots/before_after_preprocessing.png

# 4. Train neural classifier across 60 logged epochs, verify plateau, and evaluate
python 03_train_evaluate.py     # -> data/model.joblib + plots/training_curve.png + plots/evaluation_metrics.png

# 5. Execute multi-method XAI suite (Global SHAP + Local LIME + Rule-based reasons & Fairness flag)
python 04_xai_explain.py        # -> plots/shap_summary.png + plots/lime_explanation.png

# 6. Launch interactive, millennial-friendly Streamlit web app
streamlit run app/streamlit_app.py
# (or: cd app && streamlit run streamlit_app.py)
```

---

## 📁 Repository Structure

```
Prototype/
├── 01_generate_dataset.py       # Generates 20,000 unbiased records with realistic messiness
├── 02_preprocess.py             # Audits & cleans data (IQR capping, imputation, scaling)
├── 03_train_evaluate.py         # 60-epoch logged training loop, evaluation metrics, model export
├── 04_xai_explain.py            # Tri-method XAI: Global SHAP, Local LIME, Rule-based codes & fairness
├── streamlit_app.py             # Root wrapper for the Streamlit app
├── app.py                       # Alternate alias for Streamlit
├── app/
│   └── streamlit_app.py         # Interactive UI with live SHAP attribution & decision cards
├── data/
│   ├── raw_dataset.csv          # Unprocessed dataset (contains NaNs, outliers, duplicates)
│   ├── processed_dataset.csv    # Preprocessed, cleaned, and scaled dataset
│   ├── evaluation_metrics.csv   # Accuracy, Precision, Recall, F1, and ROC-AUC
│   ├── model.joblib             # Trained MLPClassifier model bundle
│   ├── scaler_metadata.joblib   # Min-Max scaler bounds and median values
│   ├── X_test.npy               # Held-out test features
│   └── y_test.npy               # Held-out test labels
└── plots/
    ├── before_after_preprocessing.png  # Missing values & outlier distribution before vs after
    ├── training_curve.png              # Train loss and validation AUC across 60 epochs
    ├── evaluation_metrics.png          # Test confusion matrix and ROC curve
    ├── shap_summary.png                # Global SHAP beeswarm feature importance
    └── lime_explanation.png            # Local LIME explanation for single applicant
```

---

## 🛡️ Responsible AI & Fairness Highlights

1. **Strictly Unbiased Signals**:
   - Zero protected attributes (gender, race, religion, caste, disability, marital status).
   - Zero proxy variables (no postal/zip codes, no surnames).
   - Exclusively policy-relevant signals (academic merit, debt ratios, credit scores, verification completeness).

2. **Data Preprocessing Audit**:
   - Outliers capped using the statistical IQR method ($Q_3 + 3 \times \text{IQR}$).
   - Missing records median-imputed to prevent exclusion.
   - Exact audit reports generated before and after cleaning.

3. **Convergence Justification**:
   - Logged epoch training loop over 60 epochs demonstrating convergence and plateauing validation AUC (~40–55 epochs), proving the training duration is mathematically justified.

4. **Tri-Method Explainability**:
   - **Global SHAP**: Explains overall policy feature attribution and directionality.
   - **Local LIME**: Deconstructs individual applicant scores into weighted perturbation rules.
   - **Rule-Based Reason Codes**: Human-readable explanations for non-technical users and applicants.
   - **Fairness Safeguard**: Triggers an alert when low income coincides with missing paperwork, diverting to human officers to prevent indirect economic penalties.
