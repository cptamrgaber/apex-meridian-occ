'use client';

import { useEffect, useState } from 'react';
import { Radio } from 'lucide-react';

export default function ADSBStatus() {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/adsb/live-flights');
        const data = await response.json();
        
        if (data.success) {
          setStatus('connected');
          setLastUpdate(new Date());
        } else {
          setStatus('disconnected');
        }
      } catch (error) {
        setStatus('disconnected');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-500';
      case 'disconnected':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'ADS-B Live';
      case 'disconnected':
        return 'ADS-B Offline';
      default:
        return 'Checking...';
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <Radio className={`w-4 h-4 ${getStatusColor()}`} />
      <span className={getStatusColor()}>{getStatusText()}</span>
      {lastUpdate && status === 'connected' && (
        <span className="text-gray-500 text-xs">
          Updated {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}

