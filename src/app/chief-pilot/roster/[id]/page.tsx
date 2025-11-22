'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import MobileBottomNav from '@/components/MobileBottomNav';
import {
  Calendar,
  Download,
  Send,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  Plane,
  User,
  ArrowLeft,
} from 'lucide-react';
import type { MonthlyRoster, RosterEntry, CrewAssignment } from '@/types/fleet-management';
import {
  getRostersForChiefPilot,
  getCrewForChiefPilot,
} from '@/lib/real-data-generators';

export default function RosterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rosterId = parseInt(params.id as string);

  const [roster, setRoster] = useState<MonthlyRoster | null>(null);
  const [entries, setEntries] = useState<RosterEntry[]>([]);
  const [crew, setCrew] = useState<CrewAssignment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load roster data from real captains database
    const rosters = getRostersForChiefPilot(1); // Get rosters for first chief pilot
    const foundRoster = rosters.find(r => r.id === rosterId);
    if (!foundRoster) {
      router.push('/chief-pilot');
      return;
    }

    setRoster(foundRoster);
    setEntries(foundRoster.entries || []); // Use entries from roster
    setCrew(getCrewForChiefPilot(foundRoster.chief_pilot_id));
    
    // Set selected date to first day of the month
    const firstDay = new Date(foundRoster.year, foundRoster.month - 1, 1);
    setSelectedDate(firstDay.toISOString().split('T')[0]);
    setLoading(false);
  }, [rosterId, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Roster saved successfully!');
  };

  const handleSubmit = async () => {
    if (!roster) return;
    
    const confirmed = confirm('Submit roster for approval? You won\'t be able to edit it after submission.');
    if (!confirmed) return;

    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Roster submitted for approval!');
    router.push('/chief-pilot');
  };

  const handleExport = () => {
    alert('Exporting roster to PDF...');
    // Implement PDF export
  };

  const handleAddEntry = () => {
    alert('Add new roster entry dialog');
    // Implement add entry modal
  };

  const handleDeleteEntry = (entryId: number) => {
    const confirmed = confirm('Delete this roster entry?');
    if (confirmed) {
      setEntries(entries.filter(e => e.id !== entryId));
    }
  };

  if (loading || !roster) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading roster...</p>
        </div>
      </div>
    );
  }

  const monthName = new Date(roster.year, roster.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(roster.year, roster.month, 0).getDate();
  const dates = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(roster.year, roster.month - 1, i + 1);
    return date.toISOString().split('T')[0];
  });

  const entriesForDate = entries.filter(e => e.date === selectedDate);
  const isDraft = roster.status === 'draft';

  return (
    <div className="flex h-screen bg-gray-50">
      <Header onLogout={handleLogout} />
      
      <main className="flex-1 overflow-auto mobile-page-content">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push('/chief-pilot')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {monthName} Roster
              </h1>
              <p className="text-sm text-gray-600">
                {roster.aircraft_type?.name} Fleet • {roster.total_flights} flights • {roster.total_duty_hours.toFixed(1)} duty hours
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                roster.status === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : roster.status === 'submitted'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {roster.status}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {isDraft && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
              >
                <Send className="w-4 h-4" />
                Submit for Approval
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Calendar View */}
          <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-900">Select Date</h2>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
              
              {/* Add empty cells for days before month starts */}
              {Array.from({ length: new Date(roster.year, roster.month - 1, 1).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}
              
              {/* Date cells */}
              {dates.map((date, index) => {
                const dayEntries = entries.filter(e => e.date === date);
                const isSelected = date === selectedDate;
                const hasEntries = dayEntries.length > 0;
                
                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`aspect-square rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : hasEntries
                        ? 'border-green-200 bg-green-50 hover:border-green-400'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                    {hasEntries && (
                      <div className="text-xs text-green-600">{dayEntries.length}</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Roster Entries for Selected Date */}
          <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-900">
                  Flights on {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </h2>
              </div>
              {isDraft && (
                <button
                  onClick={handleAddEntry}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden md:inline">Add Flight</span>
                </button>
              )}
            </div>

            {entriesForDate.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No flights scheduled for this date</p>
                {isDraft && (
                  <button
                    onClick={handleAddEntry}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Add First Flight
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {entriesForDate.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Flight</div>
                        <div className="font-semibold text-gray-900">{entry.flight_number}</div>
                        <div className="text-xs text-gray-600">{entry.aircraft_registration}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Route</div>
                        <div className="font-medium text-gray-900">
                          {entry.departure_airport} → {entry.arrival_airport}
                        </div>
                        <div className="text-xs text-gray-600">
                          {entry.scheduled_departure} - {entry.scheduled_arrival}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Pilot</div>
                        <div className="font-medium text-gray-900">{entry.pilot_name}</div>
                        <div className="text-xs text-gray-600 capitalize">{entry.position}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Duty</div>
                        <div className="font-medium text-gray-900">{entry.duty_hours}h</div>
                        <div className="text-xs text-gray-600">
                          {entry.duty_start} - {entry.duty_end}
                        </div>
                      </div>
                    </div>
                    {isDraft && (
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Crew Availability */}
          <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-base md:text-lg font-semibold text-gray-900">Available Crew</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {crew.filter(c => c.status === 'active').map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{member.pilot_name}</div>
                    <div className="text-xs text-gray-600">{member.aircraft_type?.code}</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <MobileBottomNav />
    </div>
  );
}

