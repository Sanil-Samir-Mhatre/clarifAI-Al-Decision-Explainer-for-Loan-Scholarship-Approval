'use client';

import React from 'react';

export default function AdminMetricsPage() {
  return (
    <div className="max-w-max-content-width mx-auto px-container-padding-mobile md:px-container-padding-desktop py-space-xl animate-fade-in">
      <div className="text-center mb-space-xl">
          <h1 className="font-display-hero-mobile md:font-display-hero text-on-surface mb-space-xs">Engine Metrics</h1>
          <p className="font-body-lg text-on-surface-variant">System-wide telemetry, evaluation metrics, and bias auditing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md text-center mb-space-xl">
         <div className="bg-surface-container-lowest border border-surface-container-highest p-space-lg rounded-2xl shadow-sm">
            <h3 className="font-label-lg text-on-surface-variant uppercase mb-1">Global Agreement Rate</h3>
            <p className="font-display-hero text-primary">94.2%</p>
            <p className="text-xs font-medium text-on-surface-variant">Rule Engine vs ML Model</p>
         </div>
         <div className="bg-surface-container-lowest border border-surface-container-highest p-space-lg rounded-2xl shadow-sm">
            <h3 className="font-label-lg text-on-surface-variant uppercase mb-1">Applications Processed</h3>
            <p className="font-display-hero text-secondary">1,248</p>
            <p className="text-xs font-medium text-on-surface-variant">Last 30 days</p>
         </div>
         <div className="bg-surface-container-lowest border border-surface-container-highest p-space-lg rounded-2xl shadow-sm">
            <h3 className="font-label-lg text-on-surface-variant uppercase mb-1">Disparate Impact Ratio</h3>
            <p className="font-display-hero text-green-600">0.92</p>
            <p className="text-xs font-medium text-on-surface-variant">Protected class parity achieved</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xl">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-highest p-space-md shadow-sm">
              <h4 className="font-label-lg mb-space-sm text-center">🐝 Global SHAP Feature Importance</h4>
              <img src="/plots/shap_summary.png" alt="SHAP Summary" className="w-full rounded-lg" />
          </div>
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-highest p-space-md shadow-sm">
              <h4 className="font-label-lg mb-space-sm text-center">🎯 Confusion Matrix & ROC (Validation Set)</h4>
              <img src="/plots/evaluation_metrics.png" alt="Confusion Matrix and ROC" className="w-full rounded-lg" />
          </div>
      </div>
    </div>
  );
}
