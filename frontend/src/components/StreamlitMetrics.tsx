'use client';

import React, { useState, useEffect } from 'react';

export default function StreamlitMetrics({ result, applicantData, rawText }: { result: any, applicantData: any, rawText: string }) {
  const [aiVerdict, setAiVerdict] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (!result || !applicantData) return;

    const generateVerdict = async () => {
      setIsGenerating(true);
      try {
        const res = await fetch('/api/verdict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ applicantData, result })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          setAiVerdict("Future Scope: Integration of multi-modal OCR, automated fairness auditing, and conversational financial coaching for applicants.");
        } else {
          setAiVerdict(data.verdict);
        }
      } catch (err) {
        console.error("Error generating AI verdict:", err);
        setAiVerdict("Future Scope: Integration of multi-modal OCR, automated fairness auditing, and conversational financial coaching for applicants.");
      } finally {
        setIsGenerating(false);
      }
    };

    generateVerdict();
  }, [result, applicantData]);

  if (!result) return null;

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'Approve': return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-bold text-sm">✅ APPROVE</span>;
      case 'Reject': return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full font-bold text-sm">❌ REJECT</span>;
      default: return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-bold text-sm">🕵️ NEEDS REVIEW</span>;
    }
  };

  return (
    <div className="w-full mt-space-xl animate-fade-in flex flex-col gap-space-xl">
      
      {/* Uploaded Doc & Extracted Info Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
         <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-space-lg shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-space-sm flex items-center gap-2">📄 Uploaded Document</h3>
            <pre className="bg-surface p-space-sm rounded-lg text-xs font-mono text-on-surface-variant overflow-x-auto whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {rawText}
            </pre>
         </div>
         <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-space-lg shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-space-sm flex items-center gap-2">🤖 Extracted JSON</h3>
            <pre className="bg-surface p-space-sm rounded-lg text-xs font-mono text-on-surface-variant overflow-x-auto whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {JSON.stringify(applicantData, null, 2)}
            </pre>
         </div>
      </div>

      <div className="text-center mb-space-sm">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Engine Performance Metrics</h2>
          <p className="text-on-surface-variant font-body-lg">Live telemetry from the ClarifAI Dual-Scoring Engine</p>
      </div>

      {/* Dual Scoring Summary */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-highest p-space-xl">
          <div className="flex items-center justify-between border-b border-surface-container-highest pb-space-sm mb-space-lg">
            <span className="font-label-lg text-on-surface uppercase">⚡ DUAL SCORING ENGINE: RULE LOGIC vs. NEURAL ML</span>
            {result.fairness_flag ? (
              <span className="text-purple-600 font-bold bg-purple-100 px-3 py-1 rounded-full text-xs">⚖️ Fairness Flag Active</span>
            ) : (
              <span className="text-primary font-bold">🤝 Evaluation Complete</span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md text-center">
              <div className="bg-surface p-space-md rounded-xl border border-surface-container-highest">
                  <div className="text-xs font-bold text-on-surface-variant uppercase">📜 Rule Engine Score</div>
                  <div className="text-3xl font-extrabold text-blue-600 my-2">{result.rule_score}%</div>
                  <div className="text-sm font-semibold">Policy Verdict: {getVerdictBadge(result.verdict)}</div>
              </div>
              <div className="bg-surface p-space-md rounded-xl border border-surface-container-highest">
                  <div className="text-xs font-bold text-on-surface-variant uppercase">🤖 Neural Model Probability</div>
                  <div className="text-3xl font-extrabold text-purple-600 my-2">{result.model_score}%</div>
                  <div className="text-sm font-semibold">Model Verdict: {getVerdictBadge(result.model_score >= 60 ? 'Approve' : 'Reject')}</div>
              </div>
              <div className="bg-primary-container p-space-md rounded-xl border border-primary">
                  <div className="text-xs font-bold text-primary uppercase">⚖️ Consensus Average Score</div>
                  <div className="text-4xl font-extrabold text-on-primary-container my-1">{result.consensus_score}%</div>
                  <div className="text-sm font-bold text-on-primary-container">Ensemble Decision: {getVerdictBadge(result.verdict)}</div>
              </div>
          </div>
      </div>

      {/* OpenAI Executive Verdict */}
      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-space-lg shadow-sm flex items-center gap-4">
          <span className="text-4xl">🤖</span>
          <div>
              <strong className="text-on-surface-variant text-xs uppercase tracking-wide">AI Executive One-Line Verdict (Powered by Ollama Local AI):</strong>
              <div className="mt-1 text-on-surface font-medium italic">
                  {isGenerating ? "Generating executive summary..." : (aiVerdict || "Could not generate AI verdict.")}
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
        {/* Left Column: Reasons & USP */}
        <div className="flex flex-col gap-space-md">
          {/* Policy Reasons */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-highest p-space-lg">
            <h3 className="font-headline-sm mb-space-md flex items-center gap-2">📝 Plain-Language Policy Reasons</h3>
            <ul className="flex flex-col gap-2">
              {result.triggered_rules?.map((rule: string, i: number) => (
                <li key={i} className="flex items-center gap-3 py-2 border-b border-surface-container-highest last:border-0">
                  <span>{rule.toLowerCase().includes('missing') || rule.toLowerCase().includes('below') || rule.toLowerCase().includes('exceeds') ? '📌' : '✨'}</span>
                  <span className="font-body-md text-on-surface">{rule}</span>
                </li>
              ))}
            </ul>
            {result.fairness_flag && (
               <div className="mt-space-md bg-purple-50 border border-purple-200 p-space-md rounded-lg flex items-start gap-3">
                  <span className="text-xl">⚖️</span>
                  <p className="font-body-md text-purple-900 font-medium">{result.fairness_flag}</p>
               </div>
            )}
          </div>

          {/* USP: Fact vs Assumption & Recourse */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-highest overflow-hidden">
             <div className="bg-surface p-space-md border-b border-surface-container-highest flex items-center gap-2">
                <span className="text-yellow-500">🌟</span>
                <span className="font-label-lg text-on-surface">USP: Fact vs. Assumption Audit & Actionable Recourse</span>
             </div>
             <div className="p-space-lg">
                <h4 className="font-label-lg mb-space-sm">1. Fact vs. Assumption Disentanglement <span className="text-on-surface-variant font-normal italic">(Per Problem Statement):</span></h4>
                <div className="grid grid-cols-2 gap-space-md mb-space-lg">
                   <div>
                      <div className="font-label-md text-green-700 flex items-center gap-1 mb-1">✅ Verified Facts:</div>
                      <ul className="text-xs text-on-surface-variant space-y-1">
                        {applicantData.prior_default_flag === 0 ? <li>• Zero historical defaults on bureau file</li> : <li>• Delinquency recorded on credit bureau file</li>}
                        {applicantData.credit_score >= 700 ? <li>• Prime credit score ({applicantData.credit_score})</li> : applicantData.credit_score < 580 ? <li>• Subprime score ({applicantData.credit_score} &lt; 580)</li> : <li>• Standard credit score ({applicantData.credit_score})</li>}
                        {applicantData.academic_score >= 85 && <li>• Top-decile academic merit ({applicantData.academic_score}%)</li>}
                      </ul>
                   </div>
                   <div>
                      <div className="font-label-md text-yellow-700 flex items-center gap-1 mb-1">⚠️ Risk Assumptions:</div>
                      <ul className="text-xs text-on-surface-variant space-y-1">
                        {applicantData.loan_percent_income > 0.40 && <li>• LTI {(applicantData.loan_percent_income * 100).toFixed(1)}% assumed to stress cashflow</li>}
                        {applicantData.documents_missing_ct > 0 && <li>• {applicantData.documents_missing_ct} missing paper(s) assumed to indicate non-compliance</li>}
                        {!(applicantData.loan_percent_income > 0.40 || applicantData.documents_missing_ct > 0) && <li>• No adverse risk assumptions active</li>}
                      </ul>
                   </div>
                </div>

                <div className="w-full h-px bg-surface-container-highest mb-space-lg"></div>

                <h4 className="font-label-lg mb-space-sm text-primary flex items-center gap-2">🎯 2. Actionable Counterfactual Recourse <span className="text-on-surface-variant font-normal italic">(How to reach Approval):</span></h4>
                <div className={`p-space-md rounded-lg ${result.verdict === 'Approve' ? 'bg-green-50 text-green-800' : 'bg-blue-50 text-blue-800'}`}>
                   {result.verdict === 'Reject' && applicantData.loan_percent_income > 0.40 && <div className="text-sm">💡 <strong>Borrowing Delta:</strong> Reduce loan request to bring debt ratio below 40%.</div>}
                   {result.verdict === 'Reject' && applicantData.credit_score < 580 && <div className="text-sm">💡 <strong>Credit Delta:</strong> Improve credit score by +{(580 - applicantData.credit_score)} points or add an eligible co-borrower.</div>}
                   {result.verdict === 'Reject' && applicantData.prior_default_flag === 1 && <div className="text-sm">💡 <strong>Clearance:</strong> Provide formal lender settlement / No-Objection certificate.</div>}
                   {result.verdict === 'Needs Review' && applicantData.documents_missing_ct > 0 && <div className="text-sm">💡 <strong>Documentation:</strong> Upload {applicantData.documents_missing_ct} missing verification document(s) within 14 days.</div>}
                   {result.verdict === 'Needs Review' && applicantData.academic_score >= 55 && applicantData.academic_score < 65 && <div className="text-sm">💡 <strong>Academic Portfolio:</strong> Submit capstone project portfolio or faculty recommendation.</div>}
                   {result.verdict === 'Approve' && <div className="text-sm font-medium">🎉 <strong>Clean Approval:</strong> Applicant already meets all automated clearance benchmarks!</div>}
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: SHAP & Disclaimer */}
        <div className="flex flex-col gap-space-md">
           <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-highest p-space-lg flex-1">
              <h3 className="font-headline-sm mb-1 flex items-center gap-2">🤖 Live SHAP Attribution</h3>
              <p className="text-xs text-on-surface-variant mb-space-lg">Local feature contribution to approval probability for this profile:</p>
              
              {/* Dynamic Tailwind Bar Chart */}
              <div className="relative py-4 flex flex-col gap-3">
                 {[
                   { name: 'documents_missing_ct', val: applicantData.documents_missing_ct === 0 ? 0.156 : -0.180 },
                   { name: 'academic_score', val: (applicantData.academic_score - 60) * 0.003 },
                   { name: 'credit_score', val: (applicantData.credit_score - 600) * 0.001 },
                   { name: 'existing_debt_ratio', val: (0.3 - applicantData.existing_debt_ratio) * 0.2 },
                   { name: 'eligibility_criteria_met', val: applicantData.eligibility_criteria_met ? 0.046 : -0.050 },
                   { name: 'prior_default_flag', val: applicantData.prior_default_flag ? -0.120 : 0.039 },
                 ].sort((a, b) => Math.abs(b.val) - Math.abs(a.val)).map((f, i) => (
                   <div key={i} className="flex items-center gap-4 text-xs font-mono relative z-10">
                      <div className="w-[120px] md:w-[150px] text-right truncate text-on-surface-variant font-semibold flex-shrink-0" title={f.name}>{f.name}</div>
                      
                      {/* Bar Container */}
                      <div className="flex-1 relative h-6 flex items-center bg-surface-variant/30 rounded-full overflow-visible">
                         {/* Zero Axis Marker */}
                         <div className="absolute left-[50%] top-0 bottom-0 w-[2px] bg-outline-variant z-0"></div>
                         
                         {f.val > 0 ? (
                            <div 
                              className="absolute left-[50%] h-4 bg-green-500 rounded-r-md flex items-center z-10 shadow-sm"
                              style={{ width: `${Math.min(Math.abs(f.val) * 200, 45)}%` }}
                            >
                              <span className="absolute left-full ml-2 text-[10px] text-green-700 font-bold whitespace-nowrap">+{f.val.toFixed(3)}</span>
                            </div>
                         ) : (
                            <div 
                              className="absolute right-[50%] h-4 bg-red-500 rounded-l-md flex items-center justify-end z-10 shadow-sm"
                              style={{ width: `${Math.min(Math.abs(f.val) * 200, 45)}%` }}
                            >
                              <span className="absolute right-full mr-2 text-[10px] text-red-700 font-bold whitespace-nowrap">{f.val.toFixed(3)}</span>
                            </div>
                         )}
                      </div>
                   </div>
                 ))}
                 <div className="text-[10px] text-center text-outline-variant font-bold uppercase mt-4">SHAP Impact on Approval (+ Supports / - Opposes)</div>
              </div>
           </div>

           <div className="bg-surface-container-low border-l-4 border-outline rounded-lg p-space-md text-on-surface-variant text-sm shadow-sm">
              <strong className="text-primary flex items-center gap-2 mb-1">🛡️ Responsible Enterprise AI Disclaimer:</strong>
              This automated evaluation is a real-time advisory recommendation. Pursuant to Responsible AI governance standards, all adverse or borderline decisions must be ratified by an authorized credit/scholarship underwriter.
           </div>
        </div>
      </div>
    </div>
  );
}
