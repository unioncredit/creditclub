import React, { createContext, useContext, useEffect, useState } from "react";
import { ISettingsContext } from "@/providers/types.ts";

export const SETTINGS = {
  HIDE_NOTIFICATION_BANNER: "hide-notification-banner",
};

const SETTINGS_STORAGE_KEY = "creditclub:settings";

const DEFAULT_SETTINGS = {
  showTestnets: false,
  ...JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) || "{}"),
};

const SettingsContext = createContext<ISettingsContext | null>(null);

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings() must be called within the SettingsProvider")
  }

  return ctx;
};

export const SettingsProvider = ({ children }: { children: React.ReactNode; }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const setSetting = (key: string, value: string) => {
    setSettings((x: any) => ({ ...x, [key]: value }));
  };

  const settingsString = JSON.stringify(settings);

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, settingsString);
  }, [settingsString]);

  return (
    <SettingsContext.Provider value={{ settings, setSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}
