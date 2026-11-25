import { setPageDarkMode } from '@/utils/darkMode';
import { openNotesModal } from '@/utils/notesModal';
import { getSettings, type ThemeMode } from '@/utils/storage';

const RETRY_GUARD_KEY = 'eclass_auto_login_at';
const RETRY_COOLDOWN_MS = 15_000;
const PORTFOLIO_URL = 'https://eclass.uniwa.gr/main/portfolio.php';
const QUICK_LINKS_ATTR = 'data-uniwa-quick-links';
const QUICK_LINKS_STYLE_ID = 'uniwa-quick-links-style';

let currentTheme: ThemeMode = 'dark';

function applyContentTheme(theme: ThemeMode) {
  currentTheme = theme;
  document.documentElement.dataset.uniwaTheme = theme;
  const openModal = document.getElementById('uniwa-notes-modal-root');
  if (openModal) {
    openModal.dataset.theme = theme;
  }
}

function isOnCooldown(): boolean {
  const lastAttempt = Number(sessionStorage.getItem(RETRY_GUARD_KEY) || '0');
  return Date.now() - lastAttempt < RETRY_COOLDOWN_MS;
}

function markAttempt() {
  sessionStorage.setItem(RETRY_GUARD_KEY, String(Date.now()));
}

function clearAttempt() {
  sessionStorage.removeItem(RETRY_GUARD_KEY);
}

function extractCourseCode(href: string): string | null {
  const pathMatch = href.match(/\/courses\/([^/?#]+)/i);
  if (pathMatch?.[1]) return pathMatch[1];
  const queryMatch = href.match(/[?&]course=([^&#]+)/i);
  if (queryMatch?.[1]) return queryMatch[1];
  return null;
}

function ensureQuickLinksStyle() {
  if (document.getElementById(QUICK_LINKS_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = QUICK_LINKS_STYLE_ID;
  style.textContent = `
    :root[data-uniwa-theme='dark'] {
      --uniwa-pill-bg: #121212;
      --uniwa-pill-fg: #e0e0e0;
      --uniwa-pill-border: #444444;
      --uniwa-pill-hover-bg: #e0e0e0;
      --uniwa-pill-hover-fg: #121212;
    }
    :root[data-uniwa-theme='light'] {
      --uniwa-pill-bg: #fafafa;
      --uniwa-pill-fg: #1f1f1f;
      --uniwa-pill-border: #d4d4d4;
      --uniwa-pill-hover-bg: #1f1f1f;
      --uniwa-pill-hover-fg: #fafafa;
    }
    .uniwa-quick-links {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-left: 6px;
      flex-wrap: wrap;
    }
    .uniwa-quick-pill {
      display: inline-flex;
      align-items: center;
      padding: 1px 7px;
      border-radius: 4px;
      border: 1px solid var(--uniwa-pill-border, #d4d4d4);
      background: var(--uniwa-pill-bg, #fafafa);
      color: var(--uniwa-pill-fg, #1f1f1f) !important;
      font-size: 11px;
      font-weight: 500;
      line-height: 1.5;
      text-decoration: none !important;
      transition: background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease;
    }
    .uniwa-quick-pill:hover {
      background: var(--uniwa-pill-hover-bg, #1f1f1f);
      border-color: var(--uniwa-pill-hover-bg, #1f1f1f);
      color: var(--uniwa-pill-hover-fg, #fafafa) !important;
    }
  `;
  document.head.appendChild(style);
}

function injectQuickLinks() {
  const table = document.querySelector<HTMLTableElement>('#portfolio_lessons');
  if (!table) return;

  ensureQuickLinksStyle();

  const rows = table.querySelectorAll<HTMLTableRowElement>('tbody > tr');
  for (const row of rows) {
    const firstCell = row.querySelector<HTMLTableCellElement>('td:first-child');
    if (!firstCell) continue;

    const courseLink = firstCell.querySelector<HTMLAnchorElement>('a.TextBold');
    if (!courseLink) continue;

    const container = courseLink.parentElement;
    if (!container || container.querySelector(`[${QUICK_LINKS_ATTR}]`)) continue;

    const code = extractCourseCode(courseLink.getAttribute('href') || '');
    if (!code) continue;

    const courseTitle = courseLink.textContent?.trim() || code;

    const bar = document.createElement('span');
    bar.className = 'uniwa-quick-links';
    bar.setAttribute(QUICK_LINKS_ATTR, code);

    const notesBtn = document.createElement('a');
    notesBtn.className = 'uniwa-quick-pill';
    notesBtn.href = `/modules/document/index.php?course=${encodeURIComponent(code)}`;
    notesBtn.textContent = 'Notes';
    notesBtn.title = `Browse & download documents for ${code}`;
    notesBtn.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      openNotesModal(code, courseTitle, currentTheme);
    });
    bar.appendChild(notesBtn);

    const newsBtn = document.createElement('a');
    newsBtn.className = 'uniwa-quick-pill';
    newsBtn.href = `/modules/announcements/index.php?course=${encodeURIComponent(code)}`;
    newsBtn.textContent = 'News';
    newsBtn.title = `Open announcements for ${code}`;
    bar.appendChild(newsBtn);

    container.appendChild(bar);
  }
}

function setupPortfolioQuickLinks() {
  const init = () => {
    injectQuickLinks();
    const table = document.querySelector('#portfolio_lessons');
    if (!table) return;
    const observer = new MutationObserver(() => injectQuickLinks());
    observer.observe(table, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}

export default defineContentScript({
  matches: ['https://eclass.uniwa.gr/*'],
  runAt: 'document_start',
  async main() {
    const path = window.location.pathname;
    const settings = await getSettings();
    applyContentTheme(settings.theme);
    setPageDarkMode(settings.darkMode);

    browser.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local' || !changes.eclass_settings?.newValue) return;
      const next = changes.eclass_settings.newValue as {
        theme?: ThemeMode;
        darkMode?: boolean;
      };
      if (next.theme) {
        applyContentTheme(next.theme);
      }
      if (typeof next.darkMode === 'boolean') {
        setPageDarkMode(next.darkMode);
      }
    });

    if (path.startsWith('/main/portfolio.php')) {
      clearAttempt();
      if (settings.quickLinks) {
        setupPortfolioQuickLinks();
      }
      return;
    }

    if (path.startsWith('/courses/')) {
      clearAttempt();
      return;
    }

    const isLoginOrLanding =
      path === '/' || path === '/index.php' || path === '/main/login_form.php';
    if (!isLoginOrLanding || isOnCooldown()) return;

    if (!settings.autoLogin || !settings.username || !settings.password) return;

    markAttempt();

    try {
      const response = (await browser.runtime.sendMessage({
        type: 'ENSURE_LOGGED_IN',
      })) as { ok?: boolean } | undefined;

      if (response?.ok) {
        window.location.replace(PORTFOLIO_URL);
      }
    } catch {
      // Ignore if background worker is unavailable
    }
  },
});
