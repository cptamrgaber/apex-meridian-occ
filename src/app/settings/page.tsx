"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function Settings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    autoRefresh: true,
    refreshInterval: 30,
    theme: "dark",
    language: "en",
    timezone: "Africa/Cairo",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleSave = () => {
    localStorage.setItem("settings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Configure your OCC preferences and system settings</p>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* General Settings */}
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-6">General Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Auto Refresh</div>
                  <div className="text-sm text-slate-400">Automatically refresh data</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoRefresh}
                    onChange={(e) => setSettings({ ...settings, autoRefresh: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Refresh Interval (seconds)</label>
                <select
                  value={settings.refreshInterval}
                  onChange={(e) => setSettings({ ...settings, refreshInterval: parseInt(e.target.value) })}
                  className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-sky-500"
                  disabled={!settings.autoRefresh}
                >
                  <option value={10}>10 seconds</option>
                  <option value={15}>15 seconds</option>
                  <option value={30}>30 seconds</option>
                  <option value={60}>1 minute</option>
                  <option value={300}>5 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-sky-500"
                >
                  <option value="en">English</option>
                  <option value="ar">العربية (Arabic)</option>
                  <option value="fr">Français (French)</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-sky-500"
                >
                  <option value="Africa/Cairo">Cairo (GMT+2)</option>
                  <option value="Europe/London">London (GMT+0)</option>
                  <option value="Europe/Paris">Paris (GMT+1)</option>
                  <option value="America/New_York">New York (GMT-5)</option>
                  <option value="Asia/Dubai">Dubai (GMT+4)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-6">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Push Notifications</div>
                  <div className="text-sm text-slate-400">Receive real-time alerts</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Email Alerts</div>
                  <div className="text-sm text-slate-400">Receive critical alerts via email</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailAlerts}
                    onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-6">System Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Version</span>
                <span className="text-white font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Build</span>
                <span className="text-white font-medium">2025.10.30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Environment</span>
                <span className="text-white font-medium">Production</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Database</span>
                <span className="text-green-400 font-medium">● Connected</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

