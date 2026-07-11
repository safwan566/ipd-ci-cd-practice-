'use client';

import React from 'react';

export default function DashboardPage() {

  
  return (
    <div className="p-8  " >
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Welcome</h2>
          <p className="text-gray-600">
            This is your dashboard homepage
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Quick Stats</h2>
          <div className="space-y-2">
            <p className="text-gray-600">Total Patients: <strong>150</strong></p>
            <p className="text-gray-600">Appointments Today: <strong>12</strong></p>
            <p className="text-gray-600">Pending Tasks: <strong>8</strong></p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
          <ul className="space-y-1 text-sm text-gray-600">
            <li> Lab results reviewed</li>
            <li> Patient check-in</li>
            <li> Medication prescribed</li>
            <li> Report generated</li>
          </ul>

        </div>
      </div>
    </div>
  );
}
