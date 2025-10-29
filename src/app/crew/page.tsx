'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface CrewMember {
  id: string;
  name: string;
  role: string;
  license: string;
  base: string;
  status: string;
  totalHours: number;
  monthlyHours: number;
  qualifications: string[];
}

export default function CrewManagement() {
  const router = useRouter();
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchCrew();
  }, [router]);

  const fetchCrew = async () => {
    try {
      // Generate realistic crew data
      const roles = ['Captain', 'First Officer', 'Senior FA', 'Flight Attendant'];
      const bases = ['CAI', 'ALY', 'SSH'];
      const statuses = ['Active', 'On Leave', 'Training'];
      
      const egyptianNames = [
        'Ahmed Hassan', 'Mohamed Ali', 'Mahmoud Ibrahim', 'Khaled Samir',
        'Omar Youssef', 'Amr Mostafa', 'Hossam Fathy', 'Tamer Ashraf',
        'Karim Magdy', 'Yasser Abdel', 'Sherif Nabil', 'Walid Tarek',
        'Mona Khalil', 'Sara Ahmed', 'Heba Mohamed', 'Nour El-Din',
        'Fatma Hassan', 'Dina Samir', 'Aya Ibrahim', 'Mariam Ali'
      ];

      const crewData: CrewMember[] = egyptianNames.map((name, idx) => ({
        id: `CREW${(idx + 1).toString().padStart(4, '0')}`,
        name,
        role: roles[idx % roles.length],
        license: `EG${10000 + idx}`,
        base: bases[idx % bases.length],
        status: statuses[idx % statuses.length],
        totalHours: 2000 + Math.floor(Math.random() * 8000),
        monthlyHours: 60 + Math.floor(Math.random() * 40),
        qualifications: ['A320', 'A330', 'B737'].slice(0, 1 + Math.floor(Math.random() * 3))
      }));

      setCrew(crewData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crew:', error);
      setLoading(false);
    }
  };

  const filteredCrew = filter === 'all' 
    ? crew 
    : crew.filter(c => c.role.toLowerCase().includes(filter.toLowerCase()));

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-950">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-slate-400">Loading crew data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Crew Management</h1>
            <p className="text-slate-400">Manage crew members, qualifications, and assignments</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="text-slate-400 text-sm mb-2">Total Crew</div>
              <div className="text-3xl font-bold text-white">{crew.length}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="text-slate-400 text-sm mb-2">Captains</div>
              <div className="text-3xl font-bold text-blue-400">
                {crew.filter(c => c.role === 'Captain').length}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="text-slate-400 text-sm mb-2">First Officers</div>
              <div className="text-3xl font-bold text-green-400">
                {crew.filter(c => c.role === 'First Officer').length}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="text-slate-400 text-sm mb-2">Cabin Crew</div>
              <div className="text-3xl font-bold text-purple-400">
                {crew.filter(c => c.role.includes('FA')).length}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              All Crew
            </button>
            <button
              onClick={() => setFilter('captain')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'captain'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Captains
            </button>
            <button
              onClick={() => setFilter('first officer')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'first officer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              First Officers
            </button>
            <button
              onClick={() => setFilter('fa')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'fa'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Cabin Crew
            </button>
          </div>

          {/* Crew Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-800 border-b border-slate-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">License</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Base</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Total Hours</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Monthly Hours</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Qualifications</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCrew.map((member) => (
                    <tr key={member.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="px-6 py-4 text-sm text-slate-400">{member.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-white">{member.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{member.role}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{member.license}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{member.base}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          member.status === 'Active' 
                            ? 'bg-green-900/30 text-green-400'
                            : member.status === 'Training'
                            ? 'bg-blue-900/30 text-blue-400'
                            : 'bg-yellow-900/30 text-yellow-400'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{member.totalHours.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{member.monthlyHours}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {member.qualifications.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="mt-6 text-sm text-slate-400">
            Showing {filteredCrew.length} of {crew.length} crew members
          </div>
        </div>
      </div>
    </div>
  );
}

