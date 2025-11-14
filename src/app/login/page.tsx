"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication check
    const validCredentials = [
      { username: "admin", password: "admin123", role: "admin" },
      { username: "chief.yasser", password: "yasser123", role: "chief_pilot", aircraft: "A320" },
      { username: "chief.mersal", password: "mersal123", role: "chief_pilot", aircraft: "A330" },
      { username: "chief.sherif", password: "sherif123", role: "chief_pilot", aircraft: "B737" },
      { username: "chief.khaled", password: "khaled123", role: "chief_pilot", aircraft: "B787" },
      { username: "chief.tarek", password: "tarek123", role: "chief_pilot", aircraft: "B777" },
      { username: "chief.elyan", password: "elyan123", role: "chief_pilot", aircraft: "A350" },
      { username: "pilot.ibrahim", password: "ibrahim123", role: "pilot" },
      { username: "dispatcher", password: "dispatch123", role: "dispatcher" },
    ];

    const user = validCredentials.find(
      (cred) => cred.username === username && cred.password === password
    );

    if (user) {
      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      
      // Redirect based on role
      if (user.role === "chief_pilot") {
        router.push("/chief-pilot");
      } else {
        router.push("/dashboard");
      }
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      {/* Logo in top-left corner */}
      <div className="absolute top-4 left-4">
        <img
          src="/images/apex-meridian-logo.png"
          alt="Apex-Meridian"
          className="h-4 w-auto max-w-[100px] opacity-90"
        />
      </div>

      {/* Centered login container */}
      <div className="w-full max-w-md">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Operations Control Center
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300">
            EgyptAir Operations Management
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="clean-input"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="clean-input"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="premium-button premium-button-primary w-full py-3 text-base font-semibold"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Demo credentials toggle */}
        <div className="text-center mb-4">
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {showCredentials ? "Hide" : "View"} Demo Credentials
          </button>
        </div>

        {/* Credentials list */}
        {showCredentials && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Demo Accounts
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Admin:</span>
                <span className="text-gray-600 font-mono text-xs">admin / admin123</span>
              </div>
              
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-4 mb-2">
                Chief Pilots
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">A320:</span>
                <span className="text-gray-600 font-mono text-xs">chief.yasser / yasser123</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">A330:</span>
                <span className="text-gray-600 font-mono text-xs">chief.mersal / mersal123</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">B737:</span>
                <span className="text-gray-600 font-mono text-xs">chief.sherif / sherif123</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">B787:</span>
                <span className="text-gray-600 font-mono text-xs">chief.khaled / khaled123</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">B777:</span>
                <span className="text-gray-600 font-mono text-xs">chief.tarek / tarek123</span>            
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">A350:</span>
                <span className="text-gray-600 font-mono text-xs">chief.elyan / elyan123</span>
              </div>
              
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-4 mb-2">
                Operations
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Pilot:</span>
                <span className="text-gray-600 font-mono text-xs">pilot.ibrahim / ibrahim123</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Dispatcher:</span>
                <span className="text-gray-600 font-mono text-xs">dispatcher / dispatch123</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          © 2025 Apex-Meridian LLC
        </div>
      </div>
    </div>
  );
}

