import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-start py-space-3xl px-container-padding-mobile md:px-container-padding-desktop relative overflow-y-auto">
      {/* Background glow effects */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="w-full max-w-[1000px] z-10 flex flex-col gap-space-xl">
          <div className="mb-space-2xl text-center flex flex-col items-center pt-space-md">
             <Link href="/login" className="text-on-surface-variant hover:text-primary transition-all flex items-center gap-2 mb-space-2xl w-fit px-5 py-2 rounded-full border border-surface-container-highest bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-0.5">
                <span className="text-lg leading-none">←</span> <span className="font-label-md">Back to Login</span>
             </Link>
             
             <div className="inline-block mb-space-md">
               <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-primary/20">
                 System Architecture & Telemetry
               </span>
             </div>
             
             <h1 className="text-5xl md:text-7xl font-black text-on-surface tracking-tighter mb-space-md pb-2">
               About <span className="text-primary">ClarifAI</span>
             </h1>
             
             <div className="typing-container">
               <p className="font-body-xl text-on-surface-variant max-w-[600px] leading-relaxed typing-effect">
                 The motivation and live metrics behind our Responsible Decision Engine
               </p>
             </div>
          </div>

          <div className="flex flex-col gap-space-xl">
            {/* The Journey & Motivation */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-surface-container-highest p-space-2xl text-on-surface">
              <h2 className="font-headline-md mb-space-lg text-primary flex items-center gap-3">
                 <span className="text-2xl">🚀</span> My Journey & Motivation
              </h2>
              <div className="flex flex-col gap-space-lg font-body-lg text-on-surface-variant leading-relaxed">
                 <p>
                   When I first started looking into how modern financial and educational institutions automate their decision-making for loans and scholarships, I was struck by the lack of transparency. I realized that while highly accurate, these "black-box" machine learning models often leave applicants in the dark. They can perpetuate hidden biases, result in unfair rejections, and offer zero actionable recourse for a rejected applicant.
                 </p>
                 <p>
                   I built <strong>ClarifAI</strong> to bridge this gap. My motivation was deeply personal: I wanted to build a system that wasn't just smart, but also fair and interpretable. It’s not enough to just say "No"—an applicant deserves to know <em>why</em> and <em>how</em> they can improve. ClarifAI is my answer to the growing need for responsible, transparent AI in high-stakes environments.
                 </p>
              </div>
            </div>

            {/* Architecture Image */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-surface-container-highest p-space-2xl text-on-surface flex flex-col items-center">
              <h2 className="font-headline-md mb-space-lg text-primary flex items-center gap-3 w-full">
                 <span className="text-2xl">🏛️</span> System Architecture
              </h2>
              <img src="/plots/architecture_user.png" alt="ClarifAI System Architecture" className="w-full max-w-4xl rounded-xl shadow-md border border-surface-container-highest animate-fade-in-scale" />
            </div>

            {/* Technical Details */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-surface-container-highest p-space-2xl text-on-surface">
              <h2 className="font-headline-md mb-space-lg text-primary flex items-center gap-3">
                 <span className="text-2xl">⚙️</span> Technical Details
              </h2>
              <div className="flex flex-col gap-space-lg font-body-lg text-on-surface-variant leading-relaxed">
                 <p>
                   ClarifAI operates on a dual-scoring framework. It combines a highly interpretable deterministic rule-based engine with a gradient-boosted/neural network model. By disentangling verified facts (e.g., missing documents, hard credit limits) from softer risk assumptions (e.g., historical correlations), the system provides administrators with a holistic, unbiased view of an applicant.
                 </p>
                 <p>
                   <strong>Frontend:</strong> Built with Next.js and React, featuring a glassmorphic, responsive design that prioritizes data visualization. Live SHAP (SHapley Additive exPlanations) values are rendered directly into the UI, breaking down exactly <em>why</em> a model made its prediction, feature by feature.
                 </p>
                 <p>
                   <strong>Backend & AI:</strong> A robust Python/Flask backend orchestrates the logic. It interfaces with an Ollama-hosted local LLM (like Llama 3) to generate one-line executive verdicts without relying on external, costly APIs. Supabase manages our data storage, ensuring high availability and secure applicant data management.
                 </p>
              </div>
            </div>

            {/* Future Scope */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-surface-container-highest p-space-2xl text-on-surface">
              <h2 className="font-headline-md mb-space-lg text-primary flex items-center gap-3">
                 <span className="text-2xl">🔭</span> Future Scope
              </h2>
              <div className="flex flex-col gap-space-lg font-body-lg text-on-surface-variant leading-relaxed">
                 <p>
                   Looking ahead, ClarifAI has the potential to evolve into a full-scale enterprise AI governance platform. Future improvements include:
                 </p>
                 <ul className="list-disc pl-6 space-y-2">
                   <li><strong>Multi-modal Analysis:</strong> Integrating OCR to automatically parse and verify uploaded PDF documents and identity proofs.</li>
                   <li><strong>Automated Fairness Audits:</strong> Continuous background telemetry that alerts administrators if a deployed model drifts or begins exhibiting demographic bias.</li>
                   <li><strong>Conversational Agent:</strong> A chatbot interface where applicants can discuss their rejection reasons and receive personalized financial coaching to improve their standing.</li>
                   <li><strong>Blockchain Audit Trails:</strong> Storing immutable records of AI decisions to ensure absolute compliance and regulatory transparency.</li>
                 </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-space-2xl mb-space-md border-t border-surface-container-highest pt-space-2xl">
             <h2 className="font-headline-lg text-headline-lg text-on-surface">Engine Performance Metrics</h2>
             <p className="text-on-surface-variant font-body-lg">Live telemetry from the ClarifAI Dual-Scoring Engine</p>
          </div>

          {/* Held-Out Metrics */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-highest p-space-xl">
              <h3 className="font-headline-sm mb-space-lg flex items-center gap-2"><span className="text-xl">🏆</span> Held-Out Test Set Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-space-md">
                 <div>
                    <div className="text-on-surface-variant text-sm font-semibold">Accuracy</div>
                    <div className="text-2xl font-bold text-on-surface">85.02%</div>
                 </div>
                 <div>
                    <div className="text-on-surface-variant text-sm font-semibold">Precision</div>
                    <div className="text-2xl font-bold text-on-surface">72.89%</div>
                 </div>
                 <div>
                    <div className="text-on-surface-variant text-sm font-semibold">Recall</div>
                    <div className="text-2xl font-bold text-on-surface">80.53%</div>
                 </div>
                 <div>
                    <div className="text-on-surface-variant text-sm font-semibold">F1-Score</div>
                    <div className="text-2xl font-bold text-on-surface">0.7652</div>
                 </div>
                 <div>
                    <div className="text-on-surface-variant text-sm font-semibold">ROC-AUC</div>
                    <div className="text-2xl font-bold text-on-surface">0.9253</div>
                 </div>
              </div>
          </div>

          {/* Plots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xl mt-space-md pb-space-3xl">
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-highest p-space-md shadow-sm transition-transform hover:scale-[1.02]">
                  <h4 className="font-label-lg mb-space-sm text-center text-on-surface">🎯 Confusion Matrix & ROC</h4>
                  <img src="/plots/evaluation_metrics.png" alt="Confusion Matrix and ROC" className="w-full rounded-lg" />
              </div>
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-highest p-space-md shadow-sm transition-transform hover:scale-[1.02]">
                  <h4 className="font-label-lg mb-space-sm text-center text-on-surface">🐝 Global SHAP Beeswarm</h4>
                  <img src="/plots/shap_summary.png" alt="SHAP Summary" className="w-full rounded-lg" />
              </div>
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-highest p-space-md shadow-sm transition-transform hover:scale-[1.02]">
                  <h4 className="font-label-lg mb-space-sm text-center text-on-surface">📈 Training Curve</h4>
                  <img src="/plots/training_curve.png" alt="Training Curve" className="w-full rounded-lg" />
              </div>
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-highest p-space-md shadow-sm transition-transform hover:scale-[1.02]">
                  <h4 className="font-label-lg mb-space-sm text-center text-on-surface">🧹 Preprocessing Audit</h4>
                  <img src="/plots/before_after_preprocessing.png" alt="Preprocessing" className="w-full rounded-lg" />
              </div>
          </div>
      </div>
    </div>
  );
}
