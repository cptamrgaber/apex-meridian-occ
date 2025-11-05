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
    <div className="min-h-screen flex items-center justify-center grid-pattern relative overflow-hidden">
      {/* Scan line effect */}
      <div className="scan-line absolute inset-0 pointer-events-none"></div>
      
      {/* Main login container */}
      <div className="w-full max-w-md px-4 relative z-10">
        {/* Top logo section */}
        <div className="text-center mb-8">
          {/* Apex-Meridian Logo */}
          <div className="mb-6">
            <img
              src="/images/apex-meridian-logo.png"
              alt="Apex-Meridian"
              className="h-16 mx-auto neon-box-glow"
            />
          </div>
          
          {/* Title with neon effect */}
          <h1 className="text-page-title neon-glow mb-2">
            OPERATIONS CONTROL CENTER
          </h1>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-cyan-500"></div>
            <div className="status-indicator"></div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-cyan-500"></div>
          </div>
          
          <p className="text-sm text-cyan-400 uppercase tracking-widest">
            Premium Airline Operations
          </p>
          
          {/* EgyptAir Logo */}
          <div className="mt-6">
            <img
              src="/images/egyptair-logo.png"
              alt="EgyptAir"
              className="h-12 mx-auto opacity-80"
            />
          </div>
        </div>

        {/* Login form card */}
        <div className="command-card neon-border p-8 mb-6">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username field */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-cyan-400 mb-2 uppercase tracking-wider">
                &gt; USERNAME
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="command-input w-full text-lg"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-cyan-400 mb-2 uppercase tracking-wider">
                &gt; PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="command-input w-full text-lg"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="command-button w-full py-3 text-lg"
            >
              ACCESS SYSTEM &gt;
            </button>
          </form>
        </div>

        {/* System status indicator */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-cyan-500/30 rounded">
            <div className="status-indicator"></div>
            <span className="text-sm text-cyan-400 uppercase tracking-wider">
              SYSTEM STATUS: ONLINE
            </span>
          </div>
        </div>

        {/* Demo credentials toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            className="text-sm text-cyan-500 hover:text-cyan-300 uppercase tracking-wider transition-colors"
          >
            {showCredentials ? "▼ HIDE" : "▶"} DEMO CREDENTIALS
          </button>
        </div>

        {/* Credentials list */}
        {showCredentials && (
          <div className="mt-4 command-card neon-border p-6">
            <h3 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-wider">
              AUTHORIZED PERSONNEL:
            </h3>
            <div className="space-y-3 text-sm font-mono">
              <div className="flex justify-between items-center border-b border-cyan-900 pb-2">
                <span className="text-cyan-300">Admin:</span>
                <span className="text-cyan-500">admin / admin123</span>
              </div>
              
              <div className="text-cyan-400 text-xs uppercase tracking-wider mt-4 mb-2">
                Chief Pilots:
              </div>
              
              <div className="flex justify-between items-center border-b border-cyan-900 pb-2">
                <span className="text-cyan-300">A320:</span>
                <span className="text-cyan-500">chief.yasser / yasser123</span>
              </div>
              <div className="flex justify-between items-center border-b border-cyan-900 pb-2">
                <span className="text-cyan-300">A330:</span>
                <span className="text-cyan-500">chief.mersal / mersal123</span>
              </div>
              <div className="flex justify-between items-center border-b border-cyan-900 pb-2">
                <span className="text-cyan-300">B737:</span>
                <span className="text-cyan-500">chief.sherif / sherif123</span>
              </div>
              <div className="flex justify-between items-center border-b border-cyan-900 pb-2">
                <span className="text-cyan-300">B787:</span>
                <span className="text-cyan-500">chief.khaled / khaled123</span>
              </div>
              <div className="flex justify-between items-center border-b border-cyan-900 pb-2">
                <span className="text-cyan-300">B777:</span>
                <span className="text-cyan-500">chief.tarek / tarek123</span>
              </div>
              <div className="flex justify-between items-center border-b border-cyan-900 pb-2">
                <span className="text-cyan-300">A350:</span>
                <span className="text-cyan-500">chief.elyan / elyan123</span>
              </div>
              
              <div className="text-cyan-400 text-xs uppercase tracking-wider mt-4 mb-2">
                Operations:
              </div>
              
              <div className="flex justify-between items-center border-b border-cyan-900 pb-2">
                <span className="text-cyan-300">Pilot:</span>
                <span className="text-cyan-500">pilot.ibrahim / ibrahim123</span>
              </div>
              <div className="flex justify-between items-center border-b border-cyan-900 pb-2">
                <span className="text-cyan-300">Dispatcher:</span>
                <span className="text-cyan-500">dispatcher / dispatch123</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-cyan-700 uppercase tracking-wider">
          © 2025 Apex-Meridian LLC. All rights reserved.
        </div>
      </div>
    </div>
  );
}

