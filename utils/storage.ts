export type ThemeMode = 'dark' | 'light';

export interface Settings {
  autoLogin: boolean;
  keepAlive: boolean;
  quickLinks: boolean;
  darkMode: boolean;
  username: string;
  password: string;
  theme: ThemeMode;
}

export const DEFAULT_SETTINGS: Settings = {
  autoLogin: true,
  keepAlive: true,
  quickLinks: true,
  darkMode: true,
  username: '',
  password: '',
  theme: 'dark',
};

const STORAGE_KEY = 'eclass_settings';

export async function getSettings(): Promise<Settings> {
  const result = await browser.storage.local.get(STORAGE_KEY);
  return { ...DEFAULT_SETTINGS, ...(result[STORAGE_KEY] as Partial<Settings> | undefined) };
}

export async function saveSettings(partial: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const next = { ...current, ...partial };
  await browser.storage.local.set({ [STORAGE_KEY]: next });
  return next;
}

export async function clearCredentials(): Promise<Settings> {
  return saveSettings({ username: '', password: '' });
}
