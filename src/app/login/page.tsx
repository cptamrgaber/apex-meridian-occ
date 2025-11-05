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
    <div className="min-h-screen grid-pattern relative overflow-hidden flex items-center justify-center">
      {/* Scan line effect */}
      <div className="scan-line absolute inset-0 pointer-events-none"></div>
      
      {/* Small logo in top-left corner */}
      <div className="absolute top-4 left-4 z-20">
        <img
          src="/images/apex-meridian-logo.png"
          alt="Apex-Meridian"
          className="h-8 opacity-80"
        />
      </div>

      {/* Compact centered login box */}
      <div className="w-full max-w-sm px-4 relative z-10">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold neon-glow mb-2 uppercase tracking-wider">
            Operations Control Center
          </h1>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500"></div>
            <div className="status-indicator"></div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-500"></div>
          </div>
          <p className="text-xs text-cyan-400 uppercase tracking-widest">
            EgyptAir Operations
          </p>
        </div>

        {/* Compact login form card */}
        <div className="command-card neon-border p-6 mb-4">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username field */}
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-cyan-400 mb-1.5 uppercase tracking-wider">
                &gt; Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="command-input w-full"
                placeholder="Enter username"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-cyan-400 mb-1.5 uppercase tracking-wider">
                &gt; Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="command-input w-full"
                placeholder="Enter password"
                required
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="command-button w-full py-2.5 text-sm"
            >
              ACCESS SYSTEM &gt;
            </button>
          </form>
        </div>

        {/* System status indicator */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-cyan-500/30 rounded text-xs">
            <div className="status-indicator"></div>
            <span className="text-cyan-400 uppercase tracking-wider">
              System Online
            </span>
          </div>
        </div>

        {/* Demo credentials toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            className="text-xs text-cyan-500 hover:text-cyan-300 uppercase tracking-wider transition-colors"
          >
            {showCredentials ? "▼ Hide" : "▶"} Demo Credentials
          </button>
        </div>

        {/* Credentials list */}
        {showCredentials && (
          <div className="mt-3 command-card neon-border p-4">
            <h3 className="text-xs font-bold text-cyan-400 mb-3 uppercase tracking-wider">
              Authorized Personnel:
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center border-b border-cyan-900 pb-1.5">
                <span className="text-cyan-300">Admin:</span>
                <span className="text-cyan-500">admin / admin123</span>
              </div>
              
              <div className="text-cyan-400 text-[10px] uppercase tracking-wider mt-3 mb-1.5">
                Chief Pilots:
              </div>
              
              <div className="flex justify-between items-center border-b border-cyan-900 pb-1.5">
                <span className="text-cyan-300">A320:</span>
                <span className="text-cyan-500">chief.yasser / yasser123</span>
              </div>
              <div className="flex justify-between items-center border-b border-cyan-900 pb-1.5">
                <span className="text-cyan-300">A330:</span>
                <span className="text-cyan-500">chief.mersal / mersal123</span>
              </div>
              <div className="flex justify-between items-center border-b border-cyan-900 pb-1.5">
                <span className="text-cyan-300">B737:</span>
                <span className="text-cyan-500">chief.sherif / sherif123</span>
              </div>
              <div className="flex justify-between items-center border-b border-cyan-900 pb-1.5">
                <span className="text-cyan-300">B787:</span>
                <span className="text-cyan-500">chief.khaled / khaled123</span>
              </div>
              <div className="flex justify-between items-center border-b border-cyan-900 pb-1.5">
                <span className="text-cyan-300">B777:</span>
                <span className="text-cyan-500">chief.tarek / tarek123</span>
              </div>
              <div className="flex justify-between items-center border-b border-cyan-900 pb-1.5">
                <span className="text-cyan-300">A350:</span>
                <span className="text-cyan-500">chief.elyan / elyan123</span>
              </div>
              
              <div className="text-cyan-400 text-[10px] uppercase tracking-wider mt-3 mb-1.5">
                Operations:
              </div>
              
              <div className="flex justify-between items-center border-b border-cyan-900 pb-1.5">
                <span className="text-cyan-300">Pilot:</span>
                <span className="text-cyan-500">pilot.ibrahim / ibrahim123</span>
              </div>
              <div className="flex justify-between items-center border-b border-cyan-900 pb-1.5">
                <span className="text-cyan-300">Dispatcher:</span>
                <span className="text-cyan-500">dispatcher / dispatch123</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-[10px] text-cyan-700 uppercase tracking-wider">
          © 2025 Apex-Meridian LLC
        </div>
      </div>
    </div>
  );
}

