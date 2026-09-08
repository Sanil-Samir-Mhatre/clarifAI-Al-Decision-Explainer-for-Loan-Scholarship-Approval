"""
02_preprocess.py
TCS Tech Day P4 — Responsible Enterprise AI: Explainable AI + Fairness

Performs rigorous data quality audits and preprocessing:
1. BEFORE audit: missing counts, dtypes, duplicates, extreme outliers.
2. Cleaning pipeline:
   - Deduplication
   - Outlier capping via IQR method on income_annual
   - Median imputation for missing values
   - Min-Max scaling of all feature columns for neural classifier stability
3. AFTER audit: verification of 0 NaNs, 0 duplicates, bounded distributions.
4. Comparative visualization: side-by-side missing values and outlier resolution.
"""

import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import joblib

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def preprocess_data():
    os.makedirs("plots", exist_ok=True)
    os.makedirs("data", exist_ok=True)

    print("=========================================================")
    print(" 1. DATA AUDIT: BEFORE PREPROCESSING")
    print("=========================================================")
    raw = pd.read_csv("data/raw_dataset.csv")

    dup_count = raw.duplicated().sum()
    missing_report = pd.DataFrame({
        "missing_count": raw.isna().sum(),
        "missing_pct": (raw.isna().sum() / len(raw) * 100).round(2),
        "dtype": raw.dtypes.astype(str),
    })

    # Outlier detection via IQR on income_annual
    q1 = raw["income_annual"].quantile(0.25)
    q3 = raw["income_annual"].quantile(0.75)
    iqr = q3 - q1
    upper_fence = q3 + 3.0 * iqr
    outlier_count_before = (raw["income_annual"] > upper_fence).sum()

    print(f"Total records: {len(raw):,}")
    print(f"Duplicate rows detected: {dup_count}")
    print(f"Extreme outliers detected in income_annual (> {upper_fence:,.0f}): {outlier_count_before}")
    print("\nMissing values & data types summary:")
    print(missing_report[missing_report["missing_count"] > 0].to_string())

    # ---------------------------------------------------------
    # 2. DATA CLEANING
    # ---------------------------------------------------------
    print("\n=========================================================")
    print(" 2. EXECUTING DATA CLEANING PIPELINE")
    print("=========================================================")
    
    # Step A: Drop duplicate rows
    df = raw.drop_duplicates().copy()
    print(f"-> Dropped {dup_count} duplicate records (New shape: {df.shape})")

    # Step B: Cap extreme outliers on income_annual (IQR method)
    q1_clean = df["income_annual"].quantile(0.25)
    q3_clean = df["income_annual"].quantile(0.75)
    iqr_clean = q3_clean - q1_clean
    upper_cap = q3_clean + 3.0 * iqr_clean
    n_capped = (df["income_annual"] > upper_cap).sum()
    df["income_annual"] = df["income_annual"].clip(upper=upper_cap)
    print(f"-> Capped {n_capped} extreme income outliers at INR {upper_cap:,.0f}")

    # Step C: Median-impute missing values
    impute_cols = ["income_annual", "employment_years"]
    impute_medians = {}
    for col in impute_cols:
        med = df[col].median()
        impute_medians[col] = med
        df[col] = df[col].fillna(med)
        print(f"-> Median-imputed missing values in '{col}' with {med:.2f}")

    # Re-calculate derived ratio to maintain exact consistency
    df["loan_percent_income"] = (df["loan_amount_requested"] / df["income_annual"]).round(3)

    # Step D: Min-Max feature scaling for all 11 model features
    feature_cols = [
        "academic_score",
        "income_annual",
        "employment_years",
        "credit_score",
        "credit_history_years",
        "loan_amount_requested",
        "loan_percent_income",
        "existing_debt_ratio",
        "prior_default_flag",
        "documents_missing_ct",
        "eligibility_criteria_met",
    ]

    scaler_bounds = {}
    scaled_df = df.copy()
    for col in feature_cols:
        col_min = float(df[col].min())
        col_max = float(df[col].max())
        scaler_bounds[col] = {"min": col_min, "max": col_max}
        if col_max > col_min:
            scaled_df[col + "_scaled"] = (df[col] - col_min) / (col_max - col_min)
        else:
            scaled_df[col + "_scaled"] = 0.0

    # Persist scaler bounds & preprocessing metadata
    joblib.dump({
        "scaler_bounds": scaler_bounds,
        "impute_medians": impute_medians,
        "upper_cap_income": upper_cap,
        "feature_cols": feature_cols,
    }, "data/scaler_metadata.joblib")

    scaled_df.to_csv("data/processed_dataset.csv", index=False)
    print(f"-> Saved processed dataset to data/processed_dataset.csv ({len(scaled_df):,} rows)")

    # ---------------------------------------------------------
    # 3. DATA AUDIT: AFTER PREPROCESSING
    # ---------------------------------------------------------
    print("\n=========================================================")
    print(" 3. DATA AUDIT: AFTER PREPROCESSING")
    print("=========================================================")
    print(f"Remaining duplicates: {df.duplicated().sum()}")
    print(f"Remaining missing values: {df.isna().sum().sum()}")
    print(f"Remaining extreme outliers (> INR {upper_cap:,.0f}): {(df['income_annual'] > upper_cap).sum()}")
    print(f"Max income_annual: INR {df['income_annual'].max():,.0f}")
    print(f"Min income_annual: INR {df['income_annual'].min():,.0f}")

    # ---------------------------------------------------------
    # 4. SIDE-BY-SIDE BEFORE VS AFTER VISUALIZATION
    # ---------------------------------------------------------
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.8), dpi=140)

    # Subplot 1: Missing values comparison
    missing_cols = ["income_annual", "employment_years"]
    before_vals = [raw[c].isna().sum() for c in missing_cols]
    after_vals = [df[c].isna().sum() for c in missing_cols]

    x = np.arange(len(missing_cols))
    width = 0.35

    axes[0].bar(x - width/2, before_vals, width, label="Before (Raw)", color="#D85A30", edgecolor="#8C2D19")
    axes[0].bar(x + width/2, after_vals, width, label="After (Cleaned & Imputed)", color="#1D9E75", edgecolor="#0D5941")
    axes[0].set_xticks(x)
    axes[0].set_xticklabels(missing_cols, fontsize=10, fontweight="bold")
    axes[0].set_ylabel("Missing Value Count", fontsize=11)
    axes[0].set_title("Missing Values: Before vs After Preprocessing", fontsize=12, fontweight="bold", pad=10)
    axes[0].legend(frameon=True, facecolor="#FAFAFA")
    axes[0].grid(axis="y", linestyle="--", alpha=0.5)

    # Subplot 2: Distribution histogram of outlier-affected column
    clip_view = upper_cap * 1.15
    raw_income = raw["income_annual"].dropna()
    axes[1].hist(raw_income[raw_income <= clip_view], bins=45, alpha=0.55, color="#D85A30", label="Before (Clipped View)")
    axes[1].hist(df["income_annual"], bins=45, alpha=0.65, color="#1D9E75", label="After (IQR Capped)")
    axes[1].axvline(upper_cap, color="#B91C1C", linestyle="--", linewidth=1.5, label=f"IQR Cap (₹{upper_cap:,.0f})")
    axes[1].set_xlabel("Annual Income (₹)", fontsize=11)
    axes[1].set_ylabel("Frequency", fontsize=11)
    axes[1].set_title("Annual Income Distribution: Outlier Resolution", fontsize=12, fontweight="bold", pad=10)
    axes[1].legend(frameon=True, facecolor="#FAFAFA")
    axes[1].grid(axis="y", linestyle="--", alpha=0.5)

    plt.tight_layout()
    plot_path = "plots/before_after_preprocessing.png"
    plt.savefig(plot_path)
    plt.close()
    print(f"\n[Artifact Saved] Preprocessing audit comparison saved to {plot_path}")

if __name__ == "__main__":
    preprocess_data()
