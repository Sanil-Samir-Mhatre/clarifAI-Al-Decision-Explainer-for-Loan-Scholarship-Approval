'use client';
import React, { useState } from 'react';
import StreamlitMetrics from '@/components/StreamlitMetrics';

export default function AdminApplicationsPage() {
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [evalResult, setEvalResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queue, setQueue] = useState<any[]>([]);

  React.useEffect(() => {
    // Load queue from localStorage
    const savedQueue = JSON.parse(localStorage.getItem('clarifai_queue') || '[]');
    setQueue(savedQueue.filter((app: any) => app.result === 'Pending'));
  }, []);


  const handleReview = async (app: any) => {
    setSelectedApp(app);
    setEvalResult(null);
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application: app.payload })
      });
      const data = await res.json();
      setEvalResult(data);
    } catch (err) {
      console.error(err);
      alert('Error fetching evaluation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecision = (decision: string) => {
    if (!selectedApp) return;
    const fullQueue = JSON.parse(localStorage.getItem('clarifai_queue') || '[]');
    const updatedQueue = fullQueue.map((app: any) => 
      app.id === selectedApp.id ? { ...app, result: decision } : app
    );
    localStorage.setItem('clarifai_queue', JSON.stringify(updatedQueue));
    setQueue(updatedQueue.filter((app: any) => app.result === 'Pending'));
    setSelectedApp(null);
  };

  return (
    <div className="max-w-max-content-width mx-auto px-container-padding-mobile md:px-container-padding-desktop py-space-xl animate-fade-in">
      <h1 className="font-display-hero-mobile md:font-display-hero text-on-surface mb-space-xs">Active Queue</h1>
      <p className="font-body-lg text-on-surface-variant mb-space-2xl">Applications pending human review and consensus.</p>

      {!selectedApp ? (
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface border-b border-surface-container-highest">
              <tr>
                <th className="py-space-md px-space-lg font-label-lg text-on-surface-variant">ID</th>
                <th className="py-space-md px-space-lg font-label-lg text-on-surface-variant">Applicant</th>
                <th className="py-space-md px-space-lg font-label-lg text-on-surface-variant">Date</th>
                <th className="py-space-md px-space-lg font-label-lg text-on-surface-variant">Consensus Score</th>
                <th className="py-space-md px-space-lg font-label-lg text-on-surface-variant">System Flag</th>
                <th className="py-space-md px-space-lg font-label-lg text-on-surface-variant text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest">
              {queue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-space-2xl text-center text-on-surface-variant">No pending applications in the queue.</td>
                </tr>
              ) : queue.map((app) => (
                <tr key={app.id} className="hover:bg-surface-variant/50 transition-colors">
                  <td className="py-space-md px-space-lg font-code-metric text-primary">{app.id}</td>
                  <td className="py-space-md px-space-lg font-body-md text-on-surface font-semibold">{app.applicant}</td>
                  <td className="py-space-md px-space-lg font-body-md text-on-surface">{app.date}</td>
                  <td className="py-space-md px-space-lg font-code-metric text-on-surface">{app.score}</td>
                  <td className="py-space-md px-space-lg">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      app.flag === 'Fairness Review' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.flag}
                    </span>
                  </td>
                  <td className="py-space-md px-space-lg text-right">
                    <button onClick={() => handleReview(app)} className="px-space-md py-space-xs bg-primary text-on-primary font-label-md rounded-lg shadow-sm hover:bg-primary-fixed-variant transition-colors">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col gap-space-xl">
          <div className="flex items-center justify-between bg-surface-container-low p-space-md rounded-xl border border-surface-container-highest">
            <div>
              <h2 className="font-headline-sm">Reviewing: {selectedApp.id} ({selectedApp.applicant})</h2>
              <p className="text-sm text-on-surface-variant">System Flag: {selectedApp.flag}</p>
            </div>
            <button onClick={() => setSelectedApp(null)} className="px-space-md py-space-xs border border-outline rounded-lg text-sm hover:bg-surface-variant transition-colors">
              Close & Return to Queue
            </button>
          </div>

          {isLoading ? (
            <div className="py-space-3xl text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading evaluation metrics from ClarifAI engine...</p>
            </div>
          ) : evalResult && (
            <>
              <StreamlitMetrics 
                result={evalResult} 
                applicantData={selectedApp.payload} 
                rawText={selectedApp.rawText || "[Mock Document Text: Information loaded from system queue]"} 
              />
              <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-surface-container-highest shadow-sm mt-space-md flex flex-col items-center gap-space-md">
                <h3 className="font-headline-sm">Human Governance Decision</h3>
                <p className="text-on-surface-variant text-sm">Please issue a final verdict for this application based on the evaluation provided.</p>
                <div className="flex gap-space-md mt-space-xs">
                  <button onClick={() => handleDecision('Approve')} className="px-space-xl py-space-sm bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                    Approve
                  </button>
                  <button onClick={() => handleDecision('Reject')} className="px-space-xl py-space-sm bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
