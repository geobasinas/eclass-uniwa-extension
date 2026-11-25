import './style.css';
import { clearCredentials, getSettings, saveSettings, type ThemeMode } from '@/utils/storage';

const root = document.documentElement;
const themeToggle = document.querySelector<HTMLButtonElement>('#theme-toggle')!;
const themeIcon = document.querySelector<HTMLSpanElement>('#theme-icon')!;
const autoLoginInput = document.querySelector<HTMLInputElement>('#auto-login')!;
const keepAliveInput = document.querySelector<HTMLInputElement>('#keep-alive')!;
const quickLinksInput = document.querySelector<HTMLInputElement>('#quick-links')!;
const darkModeInput = document.querySelector<HTMLInputElement>('#dark-mode')!;
const usernameInput = document.querySelector<HTMLInputElement>('#username')!;
const passwordInput = document.querySelector<HTMLInputElement>('#password')!;
const form = document.querySelector<HTMLFormElement>('#creds-form')!;
const clearBtn = document.querySelector<HTMLButtonElement>('#clear-btn')!;
const statusEl = document.querySelector<HTMLParagraphElement>('#status')!;

const SUN_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
const MOON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;

let currentTheme: ThemeMode = 'dark';
let statusTimer: number | undefined;

function applyTheme(theme: ThemeMode) {
  currentTheme = theme;
  root.dataset.theme = theme;
  themeIcon.innerHTML = theme === 'dark' ? SUN_SVG : MOON_SVG;
  themeToggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
}

function showStatus(message: string) {
  statusEl.textContent = message;
  window.clearTimeout(statusTimer);
  statusTimer = window.setTimeout(() => {
    statusEl.textContent = '';
  }, 2500);
}

async function init() {
  const settings = await getSettings();
  applyTheme(settings.theme);
  autoLoginInput.checked = settings.autoLogin;
  keepAliveInput.checked = settings.keepAlive;
  quickLinksInput.checked = settings.quickLinks;
  darkModeInput.checked = settings.darkMode;
  usernameInput.value = settings.username;
  passwordInput.value = settings.password;
}

themeToggle.addEventListener('click', async () => {
  const next: ThemeMode = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  await saveSettings({ theme: next });
});

autoLoginInput.addEventListener('change', async () => {
  await saveSettings({ autoLogin: autoLoginInput.checked });
  showStatus('Settings saved');
});

keepAliveInput.addEventListener('change', async () => {
  await saveSettings({ keepAlive: keepAliveInput.checked });
  showStatus('Settings saved');
});

quickLinksInput.addEventListener('change', async () => {
  await saveSettings({ quickLinks: quickLinksInput.checked });
  showStatus('Settings saved');
});

darkModeInput.addEventListener('change', async () => {
  await saveSettings({ darkMode: darkModeInput.checked });
  showStatus('Settings saved');
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await saveSettings({
    username: usernameInput.value.trim(),
    password: passwordInput.value,
  });
  showStatus('Credentials saved locally');
});

clearBtn.addEventListener('click', async () => {
  await clearCredentials();
  usernameInput.value = '';
  passwordInput.value = '';
  showStatus('Credentials cleared');
});

void init();
