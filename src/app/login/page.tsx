'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, Lock, User, AlertCircle } from 'lucide-react';

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'System Administrator',
  },
  {
    id: 2,
    username: 'chief.hassan',
    password: 'hassan123',
    role: 'chief_pilot',
    name: 'Capt. Ahmed Hassan',
    aircraft_type: 'A320',
    chief_pilot_id: 1,
  },
  {
    id: 3,
    username: 'chief.mohamed',
    password: 'mohamed123',
    role: 'chief_pilot',
    name: 'Capt. Mohamed Ali',
    aircraft_type: 'A330',
    chief_pilot_id: 2,
  },
  {
    id: 4,
    username: 'chief.omar',
    password: 'omar123',
    role: 'chief_pilot',
    name: 'Capt. Omar Khalil',
    aircraft_type: 'B737',
    chief_pilot_id: 3,
  },
  {
    id: 5,
    username: 'chief.khaled',
    password: 'khaled123',
    role: 'chief_pilot',
    name: 'Capt. Khaled Mansour',
    aircraft_type: 'B787',
    chief_pilot_id: 4,
  },
  {
    id: 6,
    username: 'chief.tarek',
    password: 'tarek123',
    role: 'chief_pilot',
    name: 'Capt. Tarek Fouad',
    aircraft_type: 'B777',
    chief_pilot_id: 5,
  },
  {
    id: 7,
    username: 'chief.waleed',
    password: 'waleed123',
    role: 'chief_pilot',
    name: 'Capt. Waleed Samir',
    aircraft_type: 'A350',
    chief_pilot_id: 6,
  },
  {
    id: 8,
    username: 'pilot.ibrahim',
    password: 'ibrahim123',
    role: 'pilot',
    name: 'Capt. Youssef Ibrahim',
  },
  {
    id: 9,
    username: 'dispatcher',
    password: 'dispatch123',
    role: 'dispatcher',
    name: 'Flight Dispatcher',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user
    const user = MOCK_USERS.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      setError('Invalid username or password');
      setLoading(false);
      return;
    }

    // Store user data in localStorage (in production, use secure tokens)
    localStorage.setItem('token', 'mock-jwt-token');
    localStorage.setItem('user', JSON.stringify(user));

    // Redirect based on role
    if (user.role === 'chief_pilot') {
      router.push('/chief-pilot');
    } else if (user.role === 'admin') {
      router.push('/dashboard');
    } else if (user.role === 'pilot') {
      router.push('/roster'); // Pilot view of their own roster
    } else if (user.role === 'dispatcher') {
      router.push('/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Apex Meridian® OCC
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Operations Control Center
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Sign In
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">Demo Credentials:</p>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span className="font-medium">Admin:</span>
                <span className="font-mono">admin / admin123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Chief Pilot (A320):</span>
                <span className="font-mono">chief.hassan / hassan123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Chief Pilot (A330):</span>
                <span className="font-mono">chief.mohamed / mohamed123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Chief Pilot (B737):</span>
                <span className="font-mono">chief.omar / omar123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Chief Pilot (B787):</span>
                <span className="font-mono">chief.khaled / khaled123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Chief Pilot (B777):</span>
                <span className="font-mono">chief.tarek / tarek123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Chief Pilot (A350):</span>
                <span className="font-mono">chief.waleed / waleed123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Pilot:</span>
                <span className="font-mono">pilot.ibrahim / ibrahim123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Dispatcher:</span>
                <span className="font-mono">dispatcher / dispatch123</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          © 2025 Apex-Meridian LLC. All rights reserved.
        </p>
      </div>
    </div>
  );
}

