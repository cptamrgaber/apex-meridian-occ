'use client';

import { useState, useEffect } from 'react';

export default function CrewDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  
  // Mock crew ID - in production this would come from authentication
  const crewId = 1;
  const crewName = "Captain Ahmed Hassan";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    
    // In production, this would fetch real data from APIs
    // For now, using mock data to demonstrate the interface
    
    const mockData = {
      crew_info: {
        id: crewId,
        name: crewName,
        rank: "Captain",
        base: "CAI",
        aircraft_types: ["B777-300ER", "A330-300"]
      },
      fatigue_status: {
        current_score: 35,
        alertness_level: "high",
        risk_level: "low",
        last_rest_hours: 12,
        next_duty_in_hours: 18
      },
      upcoming_training: [
        {
          training_type: "Recurrent Training",
          aircraft_type: "B777-300ER",
          due_date: "2025-12-15",
          days_until_due: 45,
          priority: "medium"
        },
        {
          training_type: "Emergency Procedures",
          aircraft_type: "A330-300",
          due_date: "2026-01-20",
          days_until_due: 80,
          priority: "low"
        }
      ],
      expiry_alerts: [
        {
          item_type: "medical",
          description: "Class 1 Medical Certificate",
          expiry_date: "2025-11-30",
          days_until_expiry: 17,
          severity: "warning",
          action_required: "Schedule medical examination"
        },
        {
          item_type: "license",
          description: "ATPL License",
          expiry_date: "2026-06-15",
          days_until_expiry: 214,
          severity: "info",
          action_required: "Renew license with ECAA"
        }
      ],
      notifications: [
        {
          id: 1,
          title: "Roster Published",
          message: "Your roster for December 2025 has been published",
          priority: "high",
          created_at: "2025-11-10T10:00:00Z",
          status: "sent"
        },
        {
          id: 2,
          title: "Bidding Now Open",
          message: "Bidding is now open for January 2026. Submit your bids before Nov 20.",
          priority: "high",
          created_at: "2025-11-09T08:00:00Z",
          status: "read"
        }
      ],
      current_roster: {
        month: "December",
        year: 2025,
        total_flights: 12,
        total_flight_hours: 85,
        days_off: 8,
        status: "published"
      }
    };
    
    setDashboardData(mockData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getFatigueColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 50) return 'text-yellow-600';
    if (score < 70) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Crew Dashboard
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                {dashboardData.crew_info.name} • {dashboardData.crew_info.rank} • Base: {dashboardData.crew_info.base}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Qualified Aircraft</p>
              <p className="text-sm font-semibold">{dashboardData.crew_info.aircraft_types.join(', ')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Fatigue Status */}
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                Fatigue Risk Management
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Fatigue Score</p>
                  <p className={`text-3xl font-bold ${getFatigueColor(dashboardData.fatigue_status.current_score)}`}>
                    {dashboardData.fatigue_status.current_score}
                  </p>
                  <p className="text-xs text-gray-600">out of 100</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Alertness</p>
                  <p className="text-lg font-semibold text-green-600 capitalize">
                    {dashboardData.fatigue_status.alertness_level}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Risk Level</p>
                  <p className="text-lg font-semibold text-green-600 capitalize">
                    {dashboardData.fatigue_status.risk_level}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Last Rest</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {dashboardData.fatigue_status.last_rest_hours}h
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-green-50 border border-green-200 rounded p-3">
                <p className="text-sm text-green-800">
                  ✅ You are fit for duty. Next duty in {dashboardData.fatigue_status.next_duty_in_hours} hours.
                </p>
              </div>
            </div>

            {/* Current Roster */}
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                Current Roster
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Period</p>
                  <p className="text-lg font-semibold">
                    {dashboardData.current_roster.month} {dashboardData.current_roster.year}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Flights</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {dashboardData.current_roster.total_flights}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Flight Hours</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {dashboardData.current_roster.total_flight_hours}h
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Days Off</p>
                  <p className="text-lg font-semibold text-green-600">
                    {dashboardData.current_roster.days_off}
                  </p>
                </div>
              </div>

              <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                View Full Roster
              </button>
            </div>

            {/* Upcoming Training */}
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                Upcoming Training
              </h2>
              
              <div className="space-y-3">
                {dashboardData.upcoming_training.map((training: any, index: number) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-sm md:text-base">{training.training_type}</p>
                        <p className="text-xs text-gray-600">{training.aircraft_type}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        training.priority === 'high' ? 'bg-red-100 text-red-800' :
                        training.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {training.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>Due: {new Date(training.due_date).toLocaleDateString()}</p>
                      <p>{training.days_until_due} days remaining</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Expiry Alerts */}
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                Expiry Alerts
              </h2>
              
              <div className="space-y-3">
                {dashboardData.expiry_alerts.map((alert: any, index: number) => (
                  <div key={index} className={`border rounded-lg p-3 ${getSeverityColor(alert.severity)}`}>
                    <p className="font-semibold text-sm mb-1">{alert.description}</p>
                    <p className="text-xs mb-2">
                      Expires: {new Date(alert.expiry_date).toLocaleDateString()}
                    </p>
                    <p className="text-xs font-semibold">
                      {alert.days_until_expiry} days remaining
                    </p>
                    <p className="text-xs mt-2 opacity-90">
                      {alert.action_required}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                Recent Notifications
              </h2>
              
              <div className="space-y-3">
                {dashboardData.notifications.map((notif: any) => (
                  <div key={notif.id} className={`border rounded-lg p-3 ${
                    notif.status === 'read' ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-sm">{notif.title}</p>
                      {notif.status !== 'read' && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{notif.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <button className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm">
                View All Notifications
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                  Submit Bids
                </button>
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                  Request Leave
                </button>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm">
                  Trade Flights
                </button>
                <button className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm">
                  Schedule Training
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

