import { getSettings } from '@/utils/storage';

const KEEP_ALIVE_ALARM = 'eclass-keep-alive';
const KEEP_ALIVE_INTERVAL_MINUTES = 10;
const PORTFOLIO_URL = 'https://eclass.uniwa.gr/main/portfolio.php';
const LOGIN_POST_URL = 'https://eclass.uniwa.gr/?login_page=1';

let loginInFlight: Promise<boolean> | null = null;

async function performSilentLogin(): Promise<boolean> {
  const { autoLogin, username, password } = await getSettings();
  if (!autoLogin || !username || !password) return false;

  try {
    const check = await fetch(PORTFOLIO_URL, {
      credentials: 'include',
      redirect: 'follow',
    });
    if (check.url.includes('/main/portfolio.php')) {
      return true;
    }

    const body = new URLSearchParams({
      uname: username,
      pass: password,
      submit: 'Είσοδος',
    });

    const loginRes = await fetch(LOGIN_POST_URL, {
      method: 'POST',
      credentials: 'include',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    return loginRes.url.includes('/main/portfolio.php');
  } catch {
    return false;
  }
}

function ensureLoggedIn(): Promise<boolean> {
  if (!loginInFlight) {
    loginInFlight = performSilentLogin().finally(() => {
      loginInFlight = null;
    });
  }
  return loginInFlight;
}

async function syncKeepAliveAlarm() {
  const { keepAlive } = await getSettings();
  if (keepAlive) {
    const existing = await browser.alarms.get(KEEP_ALIVE_ALARM);
    if (!existing) {
      browser.alarms.create(KEEP_ALIVE_ALARM, {
        periodInMinutes: KEEP_ALIVE_INTERVAL_MINUTES,
      });
    }
  } else {
    await browser.alarms.clear(KEEP_ALIVE_ALARM);
  }
}

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    void syncKeepAliveAlarm();
    void ensureLoggedIn();
  });

  browser.runtime.onStartup.addListener(() => {
    void syncKeepAliveAlarm();
    void ensureLoggedIn();
  });

  browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.eclass_settings) {
      void syncKeepAliveAlarm();
      void ensureLoggedIn();
    }
  });

  browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === KEEP_ALIVE_ALARM) {
      void ensureLoggedIn();
    }
  });

  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === 'ENSURE_LOGGED_IN') {
      void ensureLoggedIn().then((ok) => sendResponse({ ok }));
      return true;
    }
    if (message?.type === 'OPEN_VIEWER' && typeof message.url === 'string') {
      const params = new URLSearchParams({
        url: message.url,
        name: typeof message.name === 'string' ? message.name : 'Document',
        ext: typeof message.ext === 'string' ? message.ext : '',
      });
      const viewerUrl = `${browser.runtime.getURL('/viewer.html' as never)}?${params.toString()}`;
      void browser.tabs.create({ url: viewerUrl });
      sendResponse({ ok: true });
      return false;
    }
  });

  void syncKeepAliveAlarm();
  void ensureLoggedIn();
});
