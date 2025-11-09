'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Plane, Users, Calendar, FileText, Plus, Download, Check, Clock, AlertCircle } from 'lucide-react';
import type { ChiefPilot, CrewAssignment, MonthlyRoster } from '@/types/fleet-management';
import {
  mockChiefPilots,
  getCrewForChiefPilot,
  getRostersForChiefPilot,
} from '@/data/fleet-management-mock';

export default function ChiefPilotDashboard() {
  const router = useRouter();
  const [chiefPilot, setChiefPilot] = useState<ChiefPilot | null>(null);
  const [crew, setCrew] = useState<CrewAssignment[]>([]);
  const [rosters, setRosters] = useState<MonthlyRoster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate authentication check
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // For demo, use first chief pilot (Capt. Ahmed Hassan - A320)
    const cp = mockChiefPilots[0];
    setChiefPilot(cp);
    setCrew(getCrewForChiefPilot(cp.id));
    setRosters(getRostersForChiefPilot(cp.id));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleCreateRoster = () => {
    router.push('/chief-pilot/roster/create');
  };

  const handleViewRoster = (rosterId: number) => {
    router.push(`/chief-pilot/roster/${rosterId}`);
  };

  if (loading || !chiefPilot) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const activeCrew = crew.filter(c => c.status === 'active');
  const currentRoster = rosters.find(r => r.month === 11 && r.year === 2025);
  const draftRoster = rosters.find(r => r.status === 'draft');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={handleLogout} />
      
      <main className="flex-1 overflow-auto mobile-page-content">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Chief Pilot Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                {chiefPilot.name} • {chiefPilot.aircraft_type?.name} Fleet Manager
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <Plane className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                {chiefPilot.aircraft_type?.code}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{activeCrew.length}</div>
              </div>
              <div className="text-sm font-medium text-gray-600">Active Crew</div>
              <div className="text-xs text-gray-500 mt-1">Assigned pilots</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{rosters.length}</div>
              </div>
              <div className="text-sm font-medium text-gray-600">Rosters</div>
              <div className="text-xs text-gray-500 mt-1">Total created</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {currentRoster?.total_duty_hours.toFixed(0) || 0}
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600">Duty Hours</div>
              <div className="text-xs text-gray-500 mt-1">This month</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {currentRoster?.total_flights || 0}
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600">Flights</div>
              <div className="text-xs text-gray-500 mt-1">This month</div>
            </div>
          </div>

          {/* My Crew Section */}
          <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-900">My Crew</h2>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <Plus className="w-4 h-4" />
                <span className="hidden md:inline">Assign Pilot</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-gray-700">Pilot Name</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-gray-700">Aircraft Type</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-gray-700">Assigned Date</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCrew.map((member) => (
                    <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{member.pilot_name}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{member.aircraft_type?.code}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {new Date(member.assignment_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Rosters Section */}
          <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-900">Monthly Rosters</h2>
              </div>
              <button
                onClick={handleCreateRoster}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden md:inline">Create Roster</span>
              </button>
            </div>

            <div className="space-y-3">
              {rosters.map((roster) => (
                <div
                  key={roster.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleViewRoster(roster.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {new Date(roster.year, roster.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {roster.total_flights} flights • {roster.total_duty_hours.toFixed(1)} duty hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      roster.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : roster.status === 'submitted'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {roster.status}
                    </span>
                    {roster.status === 'approved' && (
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          {draftRoster && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 mb-1">Draft Roster Pending</h3>
                  <p className="text-sm text-amber-800 mb-3">
                    You have a draft roster for {new Date(draftRoster.year, draftRoster.month - 1).toLocaleDateString('en-US', { month: 'long' })}. 
                    Complete and submit it for approval.
                  </p>
                  <button
                    onClick={() => handleViewRoster(draftRoster.id)}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                  >
                    Continue Editing
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <MobileBottomNav />
    </div>
  );
}

