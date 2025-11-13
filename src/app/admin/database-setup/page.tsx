'use client';

import { useState } from 'react';

export default function DatabaseSetupPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [setupResult, setSetupResult] = useState<any>(null);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/setup-database');
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      setStatus({ error: 'Failed to connect to database' });
    }
    setLoading(false);
  };

  const runSetup = async (action: string) => {
    if (!confirm(`Are you sure you want to ${action}? This will modify the database!`)) {
      return;
    }

    setLoading(true);
    setSetupResult(null);

    try {
      const res = await fetch('/api/setup-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          confirmToken: 'INITIALIZE_DATABASE_2025'
        })
      });

      const data = await res.json();
      setSetupResult(data);
      
      // Refresh status after setup
      await checkStatus();
    } catch (error: any) {
      setSetupResult({ error: error.message });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Database Setup & Administration
          </h1>
          <p className="text-gray-600 mb-8">
            Initialize and manage the EgyptAir Crew Rostering System database
          </p>

          {/* Status Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Database Status</h2>
              <button
                onClick={checkStatus}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Check Status'}
              </button>
            </div>

            {status && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {status.status === 'ok' ? '✅ Connected' : '❌ Not Initialized'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Database</p>
                    <p className="text-lg font-semibold text-gray-900">{status.database}</p>
                  </div>
                </div>

                {status.counts && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Record Counts:</p>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-white p-3 rounded border">
                        <p className="text-xs text-gray-600">Aircraft</p>
                        <p className="text-2xl font-bold text-blue-600">{status.counts.aircraft}</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-xs text-gray-600">Airports</p>
                        <p className="text-2xl font-bold text-green-600">{status.counts.airports}</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-xs text-gray-600">Flights</p>
                        <p className="text-2xl font-bold text-purple-600">{status.counts.flights}</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-xs text-gray-600">Crew</p>
                        <p className="text-2xl font-bold text-orange-600">{status.counts.crew}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Setup Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Setup Actions</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Full Database Setup</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Creates all tables and imports initial data (aircraft, airports, flights, crew)
                </p>
                <button
                  onClick={() => runSetup('full_setup')}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Running...' : 'Run Full Setup'}
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-2">Create Schema Only</h3>
                <p className="text-sm text-green-700 mb-4">
                  Creates all database tables without importing data
                </p>
                <button
                  onClick={() => runSetup('create_schema')}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Running...' : 'Create Schema'}
                </button>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-semibold text-purple-900 mb-2">Import Data Only</h3>
                <p className="text-sm text-purple-700 mb-4">
                  Imports data into existing tables (requires schema to exist)
                </p>
                <button
                  onClick={() => runSetup('import_data')}
                  disabled={loading}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Running...' : 'Import Data'}
                </button>
              </div>
            </div>
          </div>

          {/* Setup Result */}
          {setupResult && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Setup Result</h2>
              <div className={`rounded-lg p-6 border ${
                setupResult.status === 'success' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <pre className="text-sm overflow-auto max-h-96">
                  {JSON.stringify(setupResult, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Documentation */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Important Notes</h3>
            <ul className="text-sm text-yellow-800 space-y-2">
              <li>• Full setup will DROP and RECREATE all tables</li>
              <li>• Initial import includes first 50 captains (use full import script for all 541)</li>
              <li>• Make sure database credentials are configured in Vercel environment variables</li>
              <li>• For production, run this only once during initial deployment</li>
              <li>• Use the standalone import script for complete data: <code className="bg-yellow-100 px-1">node scripts/import-data.mjs</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

