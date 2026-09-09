import { NextResponse } from 'next/server';

function evaluateRules(a: any) {
    let score = 100;
    const triggered: string[] = [];
    let hard_fail = false;

    if ((a.credit_score ?? 0) < 580) {
        triggered.push("Credit score below minimum threshold (580)");
        hard_fail = true;
    }
    if (a.prior_default_flag ?? 0) {
        triggered.push("Prior loan default on file");
        hard_fail = true;
    }
    if ((a.loan_percent_income ?? 0) > 0.40) {
        triggered.push("Loan-to-income ratio exceeds 40%");
        hard_fail = true;
    }

    if ((a.documents_missing_ct ?? 0) > 0) {
        score -= 15 * a.documents_missing_ct;
        triggered.push(`${a.documents_missing_ct} required document(s) missing`);
    }
    if ((a.academic_score ?? 0) < 60 && !(a.eligibility_criteria_met ?? 0)) {
        score -= 20;
        triggered.push("Academic score below threshold and eligibility criteria not met");
    }
    if ((a.existing_debt_ratio ?? 0) > 0.5) {
        score -= 10;
        triggered.push("Existing debt ratio above 50%");
    }
    if ((a.employment_years ?? 0) < 1) {
        score -= 5;
        triggered.push("Employment history under 1 year");
    }

    if ((a.credit_history_years ?? 0) > 10) {
        score += 5;
    }
    if ((a.eligibility_criteria_met ?? 0) && (a.documents_missing_ct ?? 0) === 0) {
        score += 10;
    }

    let verdict;
    if (hard_fail) {
        score = Math.min(score, 20);
        verdict = "Reject";
    } else if ((a.documents_missing_ct ?? 0) > 0 || ((a.academic_score ?? 0) >= 55 && (a.academic_score ?? 0) < 60)) {
        verdict = "Needs Review";
    } else {
        verdict = score >= 60 ? "Approve" : "Needs Review";
    }

    score = Math.max(0, Math.min(100, score));
    const dist_from_boundary = Math.min(Math.abs(score - 50), Math.abs(score - 70));
    const confidence = dist_from_boundary > 20 ? "High" : (dist_from_boundary > 8 ? "Medium" : "Low");

    let fairness_flag = null;
    if ((a.documents_missing_ct ?? 0) > 0 && (a.income_annual ?? 0) < 100000) {
        fairness_flag = "Low income + missing document overlap — routed to human review to avoid indirect income bias.";
    }

    if (triggered.length === 0) {
        triggered.push("All eligibility rules passed");
    }

    return {
        rule_score: Number(score.toFixed(1)),
        verdict: verdict,
        confidence: confidence,
        triggered_rules: triggered,
        fairness_flag: fairness_flag,
    };
}

function fakeModelScore(a: any) {
    const z = (
        0.03 * ((a.academic_score ?? 60) - 60)
        + 0.00002 * ((a.income_annual ?? 100000) - 100000)
        + 0.01 * ((a.credit_score ?? 600) - 600)
        - 2.0 * (a.loan_percent_income ?? 0)
        - 1.5 * (a.prior_default_flag ?? 0)
        - 0.6 * (a.documents_missing_ct ?? 0)
    );
    const prob = 1 / (1 + Math.pow(2.718281828, -z));
    return Number((prob * 100).toFixed(1));
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        if (!data || !data.application) {
            return NextResponse.json({ error: "Missing 'application' field in JSON body" }, { status: 400 });
        }
        
        const app_data = data.application;
        
        const rule_result = evaluateRules(app_data);
        const model_score = fakeModelScore(app_data);
        
        const consensus_score = Number(((rule_result.rule_score + model_score) / 2).toFixed(1));
        
        const response = {
            rule_score: rule_result.rule_score,
            model_score: model_score,
            consensus_score: consensus_score,
            verdict: rule_result.verdict,
            confidence: rule_result.confidence,
            triggered_rules: rule_result.triggered_rules,
            fairness_flag: rule_result.fairness_flag
        };
        
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
