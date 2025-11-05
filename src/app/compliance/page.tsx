/**
 * Compliance Monitor Dashboard
 * Real-time OM-A compliance monitoring with admin override capabilities
 */

'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Shield, CheckCircle, AlertTriangle, XCircle, Clock, User, FileText } from 'lucide-react';

interface ComplianceCheck {
  id: string;
  rule: string;
  context: any;
  compliant: boolean;
  reason: string;
  section: string;
  severity: 'info' | 'warning' | 'error';
  recommendation: string;
  timestamp: Date;
  overridden: boolean;
  overrideReason?: string;
  overrideBy?: string;
}

export default function CompliancePage() {
  const [checks, setChecks] = useState<ComplianceCheck[]>([]);
  const [filter, setFilter] = useState<'all' | 'compliant' | 'non-compliant' | 'overridden'>('all');
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login';
  };

  useEffect(() => {
    // Load compliance checks
    loadComplianceChecks();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadComplianceChecks, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadComplianceChecks = async () => {
    setLoading(true);
    try {
      // Simulate loading compliance checks
      // In production, this would fetch from an API
      const mockChecks: ComplianceCheck[] = [
        {
          id: '1',
          rule: 'Maximum duty time for single pilot operation',
          context: { dutyTime: 9, flightTime: 8, sectors: 4 },
          compliant: true,
          reason: 'Duty time of 9 hours is within the 13-hour limit specified in OM-A Section 7.2.1',
          section: '7.2.1',
          severity: 'info',
          recommendation: '',
          timestamp: new Date(Date.now() - 300000),
          overridden: false
        },
        {
          id: '2',
          rule: 'Minimum rest period between duty periods',
          context: { restPeriod: 10, previousDuty: 11 },
          compliant: false,
          reason: 'Rest period of 10 hours is less than the required 12 hours after an 11-hour duty period (OM-A Section 7.3.2)',
          section: '7.3.2',
          severity: 'error',
          recommendation: 'Extend rest period to 12 hours or reassign crew member',
          timestamp: new Date(Date.now() - 600000),
          overridden: false
        },
        {
          id: '3',
          rule: 'Fuel reserve requirements for international flights',
          context: { destination: 'LHR', alternate: 'LGW', reserve: 45 },
          compliant: true,
          reason: 'Fuel reserve of 45 minutes meets the minimum 30-minute requirement for international flights (OM-A Section 4.5.1)',
          section: '4.5.1',
          severity: 'info',
          recommendation: '',
          timestamp: new Date(Date.now() - 900000),
          overridden: false
        },
        {
          id: '4',
          rule: 'Weather minimums for takeoff',
          context: { visibility: 400, rvr: 550, ceiling: 200 },
          compliant: false,
          reason: 'RVR of 550m is below the minimum 600m required for takeoff (OM-A Section 8.2.3)',
          section: '8.2.3',
          severity: 'warning',
          recommendation: 'Wait for weather improvement or obtain special authorization',
          timestamp: new Date(Date.now() - 1200000),
          overridden: true,
          overrideReason: 'Captain authorization - RVR improving trend observed',
          overrideBy: 'CAPT. AHMED HASSAN'
        }
      ];
      
      setChecks(mockChecks);
    } catch (error) {
      console.error('Error loading compliance checks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChecks = checks.filter(check => {
    if (filter === 'all') return true;
    if (filter === 'compliant') return check.compliant && !check.overridden;
    if (filter === 'non-compliant') return !check.compliant && !check.overridden;
    if (filter === 'overridden') return check.overridden;
    return true;
  });

  const stats = {
    total: checks.length,
    compliant: checks.filter(c => c.compliant && !c.overridden).length,
    nonCompliant: checks.filter(c => !c.compliant && !c.overridden).length,
    overridden: checks.filter(c => c.overridden).length
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Shield className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar onLogout={handleLogout} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Compliance Monitor</h1>
                <p className="text-slate-400">Real-time OM-A regulation compliance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Total Checks</span>
                <Shield className="w-5 h-5 text-slate-400" />
              </div>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </div>

            <div className="bg-slate-900 rounded-lg p-4 border border-green-900/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Compliant</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-green-400">{stats.compliant}</div>
            </div>

            <div className="bg-slate-900 rounded-lg p-4 border border-red-900/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Non-Compliant</span>
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-red-400">{stats.nonCompliant}</div>
            </div>

            <div className="bg-slate-900 rounded-lg p-4 border border-yellow-900/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Overridden</span>
                <User className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-400">{stats.overridden}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('compliant')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'compliant'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Compliant ({stats.compliant})
            </button>
            <button
              onClick={() => setFilter('non-compliant')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'non-compliant'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Non-Compliant ({stats.nonCompliant})
            </button>
            <button
              onClick={() => setFilter('overridden')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'overridden'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Overridden ({stats.overridden})
            </button>
          </div>

          {/* Compliance Checks List */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-slate-400">Loading compliance checks...</div>
            ) : filteredChecks.length === 0 ? (
              <div className="text-center py-12 text-slate-400">No compliance checks found</div>
            ) : (
              filteredChecks.map(check => (
                <div
                  key={check.id}
                  className={`bg-slate-900 rounded-lg p-4 border ${
                    check.overridden
                      ? 'border-yellow-900/30'
                      : check.compliant
                      ? 'border-green-900/30'
                      : 'border-red-900/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getSeverityIcon(check.severity)}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-white font-semibold">{check.rule}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono text-blue-400">§{check.section}</span>
                            <span className="text-xs text-slate-500">•</span>
                            <span className="text-xs text-slate-400">
                              {new Date(check.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
                        {check.overridden && (
                          <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded">
                            OVERRIDDEN
                          </span>
                        )}
                      </div>

                      <p className="text-slate-300 text-sm mb-2">{check.reason}</p>

                      {check.recommendation && (
                        <div className="bg-slate-800 rounded p-2 mb-2">
                          <p className="text-xs text-slate-400">
                            <strong>Recommendation:</strong> {check.recommendation}
                          </p>
                        </div>
                      )}

                      {check.overridden && check.overrideReason && (
                        <div className="bg-yellow-500/10 rounded p-2 border border-yellow-900/30">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs font-semibold text-yellow-400">Admin Override</span>
                          </div>
                          <p className="text-xs text-slate-300 mb-1">{check.overrideReason}</p>
                          <p className="text-xs text-slate-500">By: {check.overrideBy}</p>
                        </div>
                      )}

                      <details className="mt-2">
                        <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400">
                          View context
                        </summary>
                        <pre className="mt-2 text-xs bg-slate-800 rounded p-2 overflow-x-auto">
                          {JSON.stringify(check.context, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

