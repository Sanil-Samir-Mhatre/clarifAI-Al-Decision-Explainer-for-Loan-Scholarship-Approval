'use client';
import React from 'react';

export default function AdminHistoryPage() {
  const historyData = [
    { id: 'APP-2026-090', applicant: 'Raj Patel', date: '01-09-2026', score: '82.4%', result: 'Approved' },
    { id: 'APP-2026-091', applicant: 'Sara Chen', date: '05-09-2026', score: '45.1%', result: 'Rejected' },
    { id: 'APP-2026-092', applicant: 'Sanika Pillai', date: '08-09-2026', score: '59.2%', result: 'Pending' },
  ];

  return (
    <div className="max-w-max-content-width mx-auto px-container-padding-mobile md:px-container-padding-desktop py-space-xl animate-fade-in">
      <h1 className="font-display-hero-mobile md:font-display-hero text-on-surface mb-space-xs">Decision History</h1>
      <p className="font-body-lg text-on-surface-variant mb-space-2xl">Past application verdicts.</p>

      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface border-b border-surface-container-highest">
            <tr>
              <th className="py-space-md px-space-lg font-label-lg text-on-surface-variant">ID</th>
              <th className="py-space-md px-space-lg font-label-lg text-on-surface-variant">Applicant</th>
              <th className="py-space-md px-space-lg font-label-lg text-on-surface-variant">Date</th>
              <th className="py-space-md px-space-lg font-label-lg text-on-surface-variant">Score</th>
              <th className="py-space-md px-space-lg font-label-lg text-on-surface-variant">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-highest">
            {historyData.map((app) => (
              <tr key={app.id} className="hover:bg-surface-variant/50 transition-colors">
                <td className="py-space-md px-space-lg font-code-metric text-primary">{app.id}</td>
                <td className="py-space-md px-space-lg font-body-md text-on-surface">{app.applicant}</td>
                <td className="py-space-md px-space-lg font-body-md text-on-surface">{app.date}</td>
                <td className="py-space-md px-space-lg font-code-metric text-on-surface">{app.score}</td>
                <td className="py-space-md px-space-lg">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    app.result === 'Approved' ? 'bg-green-100 text-green-800' : 
                    app.result === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
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
