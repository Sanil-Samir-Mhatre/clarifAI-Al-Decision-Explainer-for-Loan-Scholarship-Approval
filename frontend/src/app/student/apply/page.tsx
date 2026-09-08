'use client';

import React, { useState } from 'react';
// import StreamlitMetrics from '@/components/StreamlitMetrics'; // Removed: Students shouldn't see metrics

export default function ApplyPage() {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [testCases, setTestCases] = useState<string[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState('');

  // Fetch test cases on mount
  React.useEffect(() => {
    fetch('/api/test-cases')
      .then(res => res.json())
      .then(data => {
        if (data.files) {
          setTestCases(data.files);
        }
      })
      .catch(err => console.error('Failed to fetch test cases', err));
  }, []);

  // Very simple regex parser for the mocked test cases
  const parseDocument = (text: string) => {
    const extract = (label: string, isNumber = true) => {
      const regex = new RegExp(`${label}\\s*:\\s*(.+)`, 'i');
      const match = text.match(regex);
      if (!match) return isNumber ? 0 : '';
      let val = match[1].trim();
      if (isNumber) {
        val = val.replace(/Rs\.|,/g, '').split('/')[0].trim();
        return parseFloat(val);
      }
      return val;
    };

    return {
      academic_score: extract('Academic Score'),
      income_annual: extract('Annual Income'),
      employment_years: extract('Employment Years'),
      credit_score: extract('Credit Score'),
      credit_history_years: extract('Credit History \\(years\\)'),
      loan_amount_requested: extract('Amount Requested'),
      existing_debt_ratio: extract('Existing Debt Ratio'),
      prior_default_flag: extract('Prior Default', false) === 'Y' ? 1 : 0,
      eligibility_criteria_met: extract('Eligibility Criteria Met', false) === 'Y' ? 1 : 0,
      documents_missing_ct: (text.match(/\[ \]/g) || []).length, // count empty checkboxes
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      setFileContent(text);
      const data: any = parseDocument(text);
      
      // Calculate derived fields
      data.loan_percent_income = Number(data.loan_amount_requested) / Math.max(Number(data.income_annual), 1);
      
      setParsedData(data);
      
      // Send to backend (Simulating backend storing for admin)
      setIsEvaluating(true);
      try {
        const res = await fetch('http://localhost:5000/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ application: data })
        });
        const result = await res.json();
        
        // Store in localStorage queue for admin
        const queue = JSON.parse(localStorage.getItem('clarifai_queue') || '[]');
        const newApp = {
          id: `APP-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          applicant: data.applicant_name || 'Applicant',
          date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
          flag: result.verdict === 'Approve' ? 'Clear' : 'Needs Review',
          score: 'Pending Eval',
          result: 'Pending',
          payload: data,
          rawText: text
        };
        localStorage.setItem('clarifai_queue', JSON.stringify([newApp, ...queue]));
        
        setSubmitted(true);
      } catch (err) {
        console.error("Evaluation failed", err);
      } finally {
        setIsEvaluating(false);
      }
    };
    reader.readAsText(file);
  };

  const loadTestCase = async (filename: string) => {
    if (!filename) return;
    try {
      const res = await fetch(`/api/test-cases?file=${encodeURIComponent(filename)}`);
      const data = await res.json();
      if (data.content) {
        setFileContent(data.content);
        const parsed: any = parseDocument(data.content);
        parsed.loan_percent_income = Number(parsed.loan_amount_requested) / Math.max(Number(parsed.income_annual), 1);
        setParsedData(parsed);
        
        
        setIsEvaluating(true);
        const evalRes = await fetch('http://localhost:5000/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ application: parsed })
        });
        const result = await evalRes.json();
        
        // Store in localStorage queue for admin
        const queue = JSON.parse(localStorage.getItem('clarifai_queue') || '[]');
        const newApp = {
          id: `APP-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          applicant: filename.split('_')[0].replace('case', 'Test User '), // mock name
          date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
          flag: result.verdict === 'Approve' ? 'Clear' : 'Needs Review',
          score: 'Pending Eval',
          result: 'Pending',
          payload: parsed,
          rawText: data.content
        };
        localStorage.setItem('clarifai_queue', JSON.stringify([newApp, ...queue]));
        
        setSubmitted(true);
        setIsEvaluating(false);
      }
    } catch (err) {
      console.error('Failed to load test case', err);
      setIsEvaluating(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-max-content-width mx-auto px-container-padding-mobile md:px-container-padding-desktop py-space-3xl text-center">
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-space-3xl max-w-2xl mx-auto shadow-sm">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-space-lg">
            <span className="material-symbols-outlined text-[40px]">check_circle</span>
          </div>
          <h2 className="font-headline-lg text-on-surface mb-space-md">Application Submitted!</h2>
          <p className="font-body-lg text-on-surface-variant mb-space-xl">Your application has been successfully uploaded and is currently marked as <strong>Pending</strong>.</p>
          <div className="bg-surface-container p-space-md rounded-xl text-sm text-on-surface-variant mb-space-xl text-left">
            <strong>Note:</strong> You will not see your evaluation score here. The application is now in the administrative queue where human underwriters will review it along with system metrics.
          </div>
          <div className="flex gap-space-md justify-center">
             <button onClick={() => { setSubmitted(false); setFileContent(null); }} className="px-space-xl py-space-sm bg-surface text-on-surface border border-outline rounded-full font-label-lg hover:bg-surface-variant transition-colors">
               Submit Another
             </button>
             <a href="/student/history" className="px-space-xl py-space-sm bg-primary text-on-primary rounded-full font-label-lg hover:bg-primary-fixed-variant transition-colors">
               Check Status
             </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-max-content-width mx-auto px-container-padding-mobile md:px-container-padding-desktop py-space-xl">
      <h1 className="font-display-hero-mobile md:font-display-hero text-on-surface mb-space-xs">New Application</h1>
      <p className="font-body-lg text-on-surface-variant mb-space-2xl">Upload your application dossier for instant AI evaluation.</p>

      {/* Upload Zone */}
       <div className="w-full border-2 border-dashed border-outline-variant hover:border-primary transition-colors rounded-2xl p-space-3xl flex flex-col items-center justify-center bg-surface-container-lowest text-center">
         <span className="material-symbols-outlined text-[48px] text-primary mb-space-md">upload_file</span>
         <h3 className="font-headline-sm text-on-surface mb-space-xs">Upload Application (.txt)</h3>
         <p className="font-body-md text-on-surface-variant mb-space-lg">Drag and drop your text application file or click to browse.</p>
         
         <div className="flex flex-col md:flex-row gap-space-md items-center">
           <label className="bg-primary hover:bg-primary-fixed-variant text-on-primary font-label-lg px-space-lg py-space-sm rounded-full cursor-pointer transition-colors shadow-sm">
             Select File
             <input type="file" accept=".txt" className="hidden" onChange={handleFileUpload} />
           </label>
           
           <span className="text-on-surface-variant font-label-md">OR</span>
           
           <select 
             className="bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg px-space-lg py-space-sm rounded-full cursor-pointer transition-colors shadow-sm border border-outline focus:outline-none focus:ring-2 focus:ring-primary"
             value={selectedTestCase}
             onChange={(e) => {
               setSelectedTestCase(e.target.value);
               loadTestCase(e.target.value);
             }}
           >
             <option value="">Load a Test Case...</option>
             {testCases.map(tc => (
               <option key={tc} value={tc}>{tc.replace('.txt', '')}</option>
             ))}
           </select>
         </div>
      </div>

      {isEvaluating && (
        <div className="mt-space-2xl flex flex-col items-center justify-center gap-space-md animate-pulse">
           <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
           <p className="font-label-lg text-on-surface-variant">Running Dual-Scoring Fairness Engine...</p>
        </div>
      )}

      {/* Results Section Removed for Students */}
    </div>
  );
}
