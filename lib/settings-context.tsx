'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import apiClient from './api-client';

const SettingsContext = createContext<any>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    apiClient.get('/settings')
      .then(res => setSettings(res.data?.data ?? res.data))
      .catch(console.error);
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}