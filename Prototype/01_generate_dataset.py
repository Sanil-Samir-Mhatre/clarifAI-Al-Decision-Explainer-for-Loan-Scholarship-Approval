"""
01_generate_dataset.py
TCS Tech Day P4 — Responsible Enterprise AI: Explainable AI + Fairness

Generates a large, synthetic, UNBIASED loan/scholarship-approval dataset (20,000+ rows).
- Strictly excludes protected attributes: gender, race, religion, caste, disability,
  marital status, or proxy variables (pincode, zipcode, surname).
- Includes only legitimate financial and academic signals.
- Ground truth target (loan_status) generated from a transparent logistic function + noise.
- Deliberately injects realistic messiness: missing values, extreme IQR outliers, and duplicates.
"""

import os
import numpy as np
import pandas as pd

def generate_dataset(n_samples=20000, seed=42):
    rng = np.random.default_rng(seed)
    N = n_samples

    print(f"[1/4] Generating {N} synthetic applicant records with legitimate signals...")

    # --- Core legitimate policy signals ---
    academic_score = np.clip(rng.normal(70, 15, N), 0, 100).round(1)
    income_annual = np.clip(rng.lognormal(mean=10.8, sigma=0.6, size=N), 3000, 400000).round(0)
    employment_years = np.clip(rng.exponential(4, N), 0, 40).round(1)
    credit_score = np.clip(rng.normal(650, 90, N), 300, 850).round(0)
    credit_history_years = np.clip(rng.exponential(6, N), 0, 30).round(1)
    loan_amount_requested = np.clip(rng.lognormal(mean=9.2, sigma=0.7, size=N), 500, 100000).round(0)
    loan_percent_income = (loan_amount_requested / income_annual).round(3)
    existing_debt_ratio = np.clip(rng.beta(2, 5, N), 0, 1).round(3)
    prior_default_flag = rng.choice([0, 1], N, p=[0.88, 0.12])
    documents_missing_ct = rng.choice([0, 0, 0, 1, 1, 2], N)  # Skewed toward complete
    eligibility_criteria_met = rng.choice([0, 1], N, p=[0.15, 0.85])

    # --- Ground-truth decision (transparent logistic function + noise) ---
    z = (
        0.035 * (academic_score - 70)
        + 0.000012 * (income_annual - 50000)
        + 0.010 * (credit_score - 650)
        - 2.4 * loan_percent_income
        - 1.8 * prior_default_flag
        - 0.9 * documents_missing_ct
        + 1.4 * eligibility_criteria_met
        - 3.0 * existing_debt_ratio
        + rng.normal(0, 0.9, N)  # Policy stochasticity / realistic noise
    )
    prob_approve = 1 / (1 + np.exp(-z))
    loan_status = (prob_approve >= 0.5).astype(int)

    df = pd.DataFrame({
        "applicant_id": [f"APP{i:06d}" for i in range(N)],
        "academic_score": academic_score,
        "income_annual": income_annual,
        "employment_years": employment_years,
        "credit_score": credit_score,
        "credit_history_years": credit_history_years,
        "loan_amount_requested": loan_amount_requested,
        "loan_percent_income": loan_percent_income,
        "existing_debt_ratio": existing_debt_ratio,
        "prior_default_flag": prior_default_flag,
        "documents_missing_ct": documents_missing_ct,
        "eligibility_criteria_met": eligibility_criteria_met,
        "loan_status": loan_status,
    })

    print("[2/4] Deliberately injecting realistic data messiness...")
    # Inject ~4% missing values into income_annual
    missing_mask_inc = rng.random(N) < 0.04
    df.loc[missing_mask_inc, "income_annual"] = np.nan

    # Inject ~3% missing values into employment_years
    missing_mask_emp = rng.random(N) < 0.03
    df.loc[missing_mask_emp, "employment_years"] = np.nan

    # Inject 15 extreme high-income outliers (simulating clerical keystroke errors, e.g. x25)
    outlier_idx = rng.choice(N, 15, replace=False)
    valid_outliers = [i for i in outlier_idx if not pd.isna(df.loc[i, "income_annual"])]
    df.loc[valid_outliers, "income_annual"] = df.loc[valid_outliers, "income_annual"] * 25

    # Inject 25 accidental duplicate rows
    dup_idx = rng.choice(N, 25, replace=False)
    df = pd.concat([df, df.loc[dup_idx]], ignore_index=True)

    print(f"[3/4] Saving dataset to data/raw_dataset.csv...")
    os.makedirs("data", exist_ok=True)
    df.to_csv("data/raw_dataset.csv", index=False)

    print(f"[4/4] Dataset generation complete!")
    print(f"  Total rows: {len(df):,} (includes {len(dup_idx)} injected duplicates)")
    print(f"  Missing income values: {df['income_annual'].isna().sum():,} ({df['income_annual'].isna().mean()*100:.2f}%)")
    print(f"  Missing employment values: {df['employment_years'].isna().sum():,} ({df['employment_years'].isna().mean()*100:.2f}%)")
    print(f"  Approval rate: {df['loan_status'].mean()*100:.1f}%")
    print("\nFirst 3 records:\n", df.head(3).to_string())

if __name__ == "__main__":
    generate_dataset()
