"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Bell, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  flight_number?: string;
  priority: "low" | "medium" | "high" | "critical";
}

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, [router]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Use mock data on error
      setNotifications(getMockNotifications());
    } finally {
      setLoading(false);
    }
  };

  const getMockNotifications = (): Notification[] => {
    return [
      {
        id: "1",
        type: "warning",
        title: "Flight Delay",
        message: "MS777 (CAI-LHR) delayed by 45 minutes due to weather conditions at destination",
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        read: false,
        flight_number: "MS777",
        priority: "high",
      },
      {
        id: "2",
        type: "info",
        title: "Crew Assignment",
        message: "Crew roster for tomorrow has been published. 12 crew members assigned to 8 flights",
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        read: false,
        priority: "medium",
      },
      {
        id: "3",
        type: "success",
        title: "Flight Departed",
        message: "MS985 (CAI-DXB) departed on time with 156 passengers",
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        read: true,
        flight_number: "MS985",
        priority: "low",
      },
      {
        id: "4",
        type: "error",
        title: "Maintenance Required",
        message: "Aircraft SU-GFJ requires immediate inspection. Flight MS123 reassigned to SU-GFK",
        timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
        read: false,
        priority: "critical",
      },
      {
        id: "5",
        type: "warning",
        title: "Weather Alert",
        message: "Severe turbulence expected on CAI-JFK route between 14:00-18:00 UTC",
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
        read: false,
        priority: "high",
      },
      {
        id: "6",
        type: "info",
        title: "Gate Change",
        message: "MS60 (CAI-LXR) gate changed from A12 to A15",
        timestamp: new Date(Date.now() - 150 * 60000).toISOString(),
        read: true,
        flight_number: "MS60",
        priority: "medium",
      },
    ];
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="w-5 h-5 text-blue-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-500/20 border-blue-500/30";
      case "warning":
        return "bg-yellow-500/20 border-yellow-500/30";
      case "error":
        return "bg-red-500/20 border-red-500/30";
      case "success":
        return "bg-green-500/20 border-green-500/30";
      default:
        return "bg-slate-800 border-slate-700";
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: "bg-slate-500/20 text-slate-400",
      medium: "bg-blue-500/20 text-blue-400",
      high: "bg-yellow-500/20 text-yellow-400",
      critical: "bg-red-500/20 text-red-400",
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    critical: notifications.filter(n => n.priority === "critical").length,
    high: notifications.filter(n => n.priority === "high").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Header onLogout={handleLogout} />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
              <p className="text-slate-400">Real-time alerts and system notifications</p>
            </div>
            {stats.unread > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
              >
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-1">Total</div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-1">Unread</div>
            <div className="text-2xl font-bold text-blue-400">{stats.unread}</div>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-1">Critical</div>
            <div className="text-2xl font-bold text-red-400">{stats.critical}</div>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-1">High Priority</div>
            <div className="text-2xl font-bold text-yellow-400">{stats.high}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "unread"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Unread ({stats.unread})
            </button>
            <button
              onClick={() => setFilter("error")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "error"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Errors
            </button>
            <button
              onClick={() => setFilter("warning")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "warning"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Warnings
            </button>
            <button
              onClick={() => setFilter("info")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "info"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Info
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 rounded-lg border ${getTypeColor(notification.type)} ${
                !notification.read ? "bg-opacity-100" : "bg-opacity-50 opacity-75"
              } transition-all`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{notification.title}</h3>
                      {notification.flight_number && (
                        <span className="text-xs text-sky-400 font-medium">
                          {notification.flight_number}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityBadge(notification.priority)}`}>
                        {notification.priority.toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-sm">{formatTime(notification.timestamp)}</span>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-4">{notification.message}</p>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-sm hover:bg-slate-700 transition-colors"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-sm hover:bg-red-900/50 hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
}

