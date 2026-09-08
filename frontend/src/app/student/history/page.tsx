'use client';
import React, { useState, useEffect } from 'react';

export default function StudentHistoryPage() {
  const [historyData, setHistoryData] = useState<any[]>([]);

  useEffect(() => {
    // Load from localStorage queue
    const queue = JSON.parse(localStorage.getItem('clarifai_queue') || '[]');
    setHistoryData(queue);
  }, []);

  return (
    <div className="max-w-max-content-width mx-auto px-container-padding-mobile md:px-container-padding-desktop py-space-xl animate-fade-in">
      <h1 className="font-display-hero-mobile md:font-display-hero text-on-surface mb-space-xs">My Applications</h1>
      <p className="font-body-lg text-on-surface-variant mb-space-2xl">Status of your submitted applications.</p>

      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface border-b border-surface-container-highest">
            <tr>
              <th className="py-space-md px-space-lg font-label-lg text-on-surface-variant">Application ID</th>
              <th className="py-space-md px-space-lg font-label-lg text-on-surface-variant">Program</th>
              <th className="py-space-md px-space-lg font-label-lg text-on-surface-variant">Date Submitted</th>
              <th className="py-space-md px-space-lg font-label-lg text-on-surface-variant">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-highest">
            {historyData.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-space-2xl text-center text-on-surface-variant">You have not submitted any applications yet.</td>
              </tr>
            ) : historyData.map((app) => (
              <tr key={app.id} className="hover:bg-surface-variant/50 transition-colors">
                <td className="py-space-md px-space-lg font-code-metric text-primary">{app.id}</td>
                <td className="py-space-md px-space-lg font-body-md text-on-surface">ClarifAI Evaluation</td>
                <td className="py-space-md px-space-lg font-body-md text-on-surface">{app.date}</td>
                <td className="py-space-md px-space-lg">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    app.result === 'Approve' ? 'bg-green-100 text-green-800' : 
                    app.result === 'Reject' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {app.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
