import type { ThemeMode } from '@/utils/storage';

interface DocItem {
  name: string;
  isDir: boolean;
  openUrl: string;
  downloadUrl: string;
  size: string;
  date: string;
  officeExt: 'docx' | 'pptx' | 'xlsx' | null;
}

function detectOfficeExt(name: string, openUrl: string, fileCell: HTMLElement): 'docx' | 'pptx' | 'xlsx' | null {
  const combined = `${name} ${openUrl}`.toLowerCase();
  if (/\.docx(\b|[?#])/.test(combined)) return 'docx';
  if (/\.pptx(\b|[?#])/.test(combined)) return 'pptx';
  if (/\.xlsx(\b|[?#])/.test(combined)) return 'xlsx';
  const iconEl = fileCell.querySelector('.file-icon');
  const iconText = `${iconEl?.getAttribute('aria-label') || ''} ${iconEl?.innerHTML || ''}`.toLowerCase();
  if (iconText.includes('docx')) return 'docx';
  if (iconText.includes('pptx')) return 'pptx';
  if (iconText.includes('xlsx')) return 'xlsx';
  return null;
}

interface ParsedDocs {
  items: DocItem[];
  zipUrl: string | null;
}

const MODAL_STYLE_ID = 'uniwa-notes-modal-style';
const MODAL_ROOT_ID = 'uniwa-notes-modal-root';

function ensureModalStyles() {
  if (document.getElementById(MODAL_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = MODAL_STYLE_ID;
  style.textContent = `
    #${MODAL_ROOT_ID} {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.58);
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      line-height: 1.4;
    }
    #${MODAL_ROOT_ID}[data-theme='dark'] {
      --m-bg: #121212;
      --m-primary: #e0e0e0;
      --m-primary-fg: #121212;
      --m-secondary: #b0b0b0;
      --m-muted: #888888;
      --m-border: #444444;
      --m-hover: #1e1e1e;
    }
    #${MODAL_ROOT_ID}[data-theme='light'] {
      --m-bg: #fafafa;
      --m-primary: #1f1f1f;
      --m-primary-fg: #fafafa;
      --m-secondary: #525252;
      --m-muted: #737373;
      --m-border: #d4d4d4;
      --m-hover: #f0f0f0;
    }
    .uniwa-modal-card {
      width: min(640px, 92vw);
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      background: var(--m-bg);
      color: var(--m-primary);
      border: 1px solid var(--m-border);
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
    }
    .uniwa-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 16px;
      border-bottom: 1px solid var(--m-border);
    }
    .uniwa-modal-title-wrap {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .uniwa-modal-title {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: var(--m-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .uniwa-modal-sub {
      font-size: 11px;
      color: var(--m-muted);
    }
    .uniwa-modal-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }
    .uniwa-mbtn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      border-radius: 6px;
      border: 1px solid var(--m-border);
      background: transparent;
      color: var(--m-secondary);
      font: inherit;
      font-size: 12px;
      font-weight: 500;
      text-decoration: none !important;
      cursor: pointer;
    }
    .uniwa-mbtn:hover {
      color: var(--m-primary);
      border-color: var(--m-primary);
    }
    .uniwa-mbtn-primary {
      background: var(--m-primary);
      color: var(--m-primary-fg) !important;
      border-color: var(--m-primary);
    }
    .uniwa-mbtn-primary:hover {
      opacity: 0.88;
      color: var(--m-primary-fg) !important;
    }
    .uniwa-modal-nav {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-bottom: 1px solid var(--m-border);
      font-size: 12px;
      color: var(--m-muted);
    }
    .uniwa-modal-body {
      overflow-y: auto;
      padding: 6px 0;
      flex: 1;
      scrollbar-width: thin;
      scrollbar-color: var(--m-border) transparent;
    }
    .uniwa-modal-body::-webkit-scrollbar {
      width: 6px;
    }
    .uniwa-modal-body::-webkit-scrollbar-track {
      background: transparent;
    }
    .uniwa-modal-body::-webkit-scrollbar-thumb {
      background: var(--m-border);
      border-radius: 999px;
    }
    .uniwa-modal-body::-webkit-scrollbar-thumb:hover {
      background: var(--m-muted);
    }
    .uniwa-doc-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 9px 16px;
      border-bottom: 1px solid var(--m-border);
    }
    .uniwa-doc-row:last-child {
      border-bottom: none;
    }
    .uniwa-doc-row:hover {
      background: var(--m-hover);
    }
    .uniwa-doc-main {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
    }
    .uniwa-doc-icon {
      flex-shrink: 0;
      color: var(--m-muted);
      font-size: 12px;
      width: 18px;
      text-align: center;
      transition: transform 0.15s ease;
    }
    .uniwa-doc-icon.expanded {
      transform: rotate(90deg);
      color: var(--m-primary);
    }
    .uniwa-folder-children {
      padding-left: 20px;
      border-left: 1px solid var(--m-border);
      margin-left: 24px;
    }
    .uniwa-folder-state {
      padding: 8px 14px;
      font-size: 12px;
      color: var(--m-muted);
    }
    .uniwa-doc-info {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .uniwa-doc-name {
      color: var(--m-primary);
      font-weight: 500;
      text-decoration: none !important;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    .uniwa-doc-name:hover {
      text-decoration: underline !important;
    }
    .uniwa-doc-meta {
      font-size: 11px;
      color: var(--m-muted);
    }
    .uniwa-modal-state {
      padding: 32px 16px;
      text-align: center;
      color: var(--m-muted);
    }
  `;
  document.head.appendChild(style);
}

function toAbsoluteUrl(href: string, baseUrl: string): string {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return href;
  }
}

function parseDocumentsHtml(html: string, pageUrl: string): ParsedDocs {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const items: DocItem[] = [];

  const zipAnchor = doc.querySelector<HTMLAnchorElement>('a[href*="download="] .fa-download')?.closest('a');
  const zipUrl = zipAnchor?.getAttribute('href')
    ? toAbsoluteUrl(zipAnchor.getAttribute('href')!, pageUrl)
    : null;

  const rows = doc.querySelectorAll<HTMLTableRowElement>('#document_table tbody tr, table.table-default tbody tr');
  for (const row of rows) {
    const fileCell = row.querySelector<HTMLTableCellElement>('td.fileURL-th');
    if (!fileCell) continue;

    const hiddenDownload = fileCell.querySelector<HTMLInputElement>('input[type="hidden"]')?.value ?? '';
    const link = fileCell.querySelector<HTMLAnchorElement>('a.fileURL-link, div a[href]');
    if (!link) continue;

    const rawHref = link.getAttribute('href') || '';
    const isDir =
      Boolean(fileCell.querySelector('.fa-folder-open, .fa-folder')) || rawHref.includes('openDir=');

    const cells = Array.from(row.querySelectorAll('td')).filter((td) => !td.classList.contains('checkbox_td'));
    const size = cells[1]?.textContent?.trim() || '';
    const date = cells[2]?.textContent?.trim() || '';

    const name = link.textContent?.trim() || 'Untitled';
    const openUrl = toAbsoluteUrl(rawHref, pageUrl);

    items.push({
      name,
      isDir,
      openUrl,
      downloadUrl: hiddenDownload ? toAbsoluteUrl(hiddenDownload, pageUrl) : openUrl,
      size,
      date,
      officeExt: isDir ? null : detectOfficeExt(name, openUrl, fileCell),
    });
  }

  return { items, zipUrl };
}

export function openNotesModal(courseCode: string, courseTitle: string, theme: ThemeMode) {
  ensureModalStyles();
  document.getElementById(MODAL_ROOT_ID)?.remove();

  const root = document.createElement('div');
  root.id = MODAL_ROOT_ID;
  root.dataset.theme = theme;

  const baseUrl = `https://eclass.uniwa.gr/modules/document/index.php?course=${encodeURIComponent(courseCode)}`;
  const historyStack: { label: string; url: string }[] = [{ label: 'Root', url: baseUrl }];

  const close = () => {
    document.removeEventListener('keydown', onKeyDown);
    root.remove();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };
  document.addEventListener('keydown', onKeyDown);

  root.addEventListener('click', (e) => {
    if (e.target === root) close();
  });

  root.innerHTML = `
    <div class="uniwa-modal-card" role="dialog" aria-modal="true">
      <div class="uniwa-modal-header">
        <div class="uniwa-modal-title-wrap">
          <h2 class="uniwa-modal-title"></h2>
          <span class="uniwa-modal-sub"></span>
        </div>
        <div class="uniwa-modal-actions">
          <a class="uniwa-mbtn uniwa-mbtn-primary" id="uniwa-zip-all" style="display:none;">ZIP All</a>
          <a class="uniwa-mbtn" id="uniwa-open-full" target="_blank" rel="noopener">Open Page</a>
          <button type="button" class="uniwa-mbtn" id="uniwa-close-modal">Close</button>
        </div>
      </div>
      <div class="uniwa-modal-nav" id="uniwa-modal-nav" style="display:none;"></div>
      <div class="uniwa-modal-body" id="uniwa-modal-body">
        <div class="uniwa-modal-state">Loading documents…</div>
      </div>
    </div>
  `;

  root.querySelector<HTMLHeadingElement>('.uniwa-modal-title')!.textContent = courseTitle;
  root.querySelector<HTMLSpanElement>('.uniwa-modal-sub')!.textContent = courseCode;
  root.querySelector<HTMLButtonElement>('#uniwa-close-modal')!.addEventListener('click', close);

  const zipBtn = root.querySelector<HTMLAnchorElement>('#uniwa-zip-all')!;
  const openFullBtn = root.querySelector<HTMLAnchorElement>('#uniwa-open-full')!;
  const bodyEl = root.querySelector<HTMLDivElement>('#uniwa-modal-body')!;

  const folderCache = new Map<string, DocItem[]>();

  async function fetchFolderItems(url: string): Promise<ParsedDocs> {
    const res = await fetch(url, { credentials: 'include' });
    const html = await res.text();
    return parseDocumentsHtml(html, res.url || url);
  }

  function renderItems(items: DocItem[], container: HTMLElement) {
    container.innerHTML = '';
    if (items.length === 0) {
      const empty = document.createElement('div');
      empty.className = container === bodyEl ? 'uniwa-modal-state' : 'uniwa-folder-state';
      empty.textContent = 'No documents found in this folder.';
      container.appendChild(empty);
      return;
    }

    for (const item of items) {
      const wrapper = document.createElement('div');

      const row = document.createElement('div');
      row.className = 'uniwa-doc-row';

      const main = document.createElement('div');
      main.className = 'uniwa-doc-main';

      const icon = document.createElement('span');
      icon.className = 'uniwa-doc-icon';
      icon.textContent = item.isDir ? '▸' : '•';

      const info = document.createElement('div');
      info.className = 'uniwa-doc-info';

      const nameEl = document.createElement('a');
      nameEl.className = 'uniwa-doc-name';
      nameEl.textContent = item.name;
      nameEl.href = item.openUrl;

      const meta = document.createElement('span');
      meta.className = 'uniwa-doc-meta';
      meta.textContent = [item.size, item.date].filter(Boolean).join(' · ');

      info.append(nameEl);
      if (meta.textContent) info.append(meta);
      main.append(icon, info);

      const actionsWrap = document.createElement('div');
      actionsWrap.className = 'uniwa-modal-actions';

      if (item.officeExt) {
        const openViewer = (e: MouseEvent) => {
          e.preventDefault();
          void browser.runtime.sendMessage({
            type: 'OPEN_VIEWER',
            url: item.downloadUrl,
            name: item.name,
            ext: item.officeExt,
          });
        };

        const previewBtn = document.createElement('button');
        previewBtn.type = 'button';
        previewBtn.className = 'uniwa-mbtn uniwa-mbtn-primary';
        previewBtn.textContent = 'Preview';
        previewBtn.addEventListener('click', openViewer);
        actionsWrap.appendChild(previewBtn);

        nameEl.addEventListener('click', openViewer);
      }

      const dlBtn = document.createElement('a');
      dlBtn.className = 'uniwa-mbtn';
      dlBtn.href = item.downloadUrl;
      dlBtn.textContent = item.isDir ? 'ZIP' : 'Download';
      actionsWrap.appendChild(dlBtn);

      row.append(main, actionsWrap);
      wrapper.appendChild(row);

      if (item.isDir) {
        const childrenEl = document.createElement('div');
        childrenEl.className = 'uniwa-folder-children';
        childrenEl.style.display = 'none';
        wrapper.appendChild(childrenEl);

        let expanded = false;
        const toggleFolder = async (e: MouseEvent) => {
          e.preventDefault();
          expanded = !expanded;
          icon.classList.toggle('expanded', expanded);
          childrenEl.style.display = expanded ? 'block' : 'none';
          if (!expanded) return;

          const cached = folderCache.get(item.openUrl);
          if (cached) {
            if (!childrenEl.hasChildNodes()) {
              renderItems(cached, childrenEl);
            }
            return;
          }

          childrenEl.innerHTML = `<div class="uniwa-folder-state">Loading…</div>`;
          try {
            const parsed = await fetchFolderItems(item.openUrl);
            folderCache.set(item.openUrl, parsed.items);
            renderItems(parsed.items, childrenEl);
          } catch {
            childrenEl.innerHTML = `<div class="uniwa-folder-state">Failed to load folder.</div>`;
          }
        };

        main.style.cursor = 'pointer';
        main.addEventListener('click', (e) => void toggleFolder(e));
      } else {
        nameEl.target = '_blank';
        nameEl.rel = 'noopener';
      }

      container.appendChild(wrapper);
    }
  }

  async function loadRoot() {
    openFullBtn.href = baseUrl;
    zipBtn.style.display = 'none';
    bodyEl.innerHTML = `<div class="uniwa-modal-state">Loading documents…</div>`;

    try {
      const { items, zipUrl } = await fetchFolderItems(baseUrl);
      if (zipUrl) {
        zipBtn.href = zipUrl;
        zipBtn.style.display = 'inline-flex';
      }
      renderItems(items, bodyEl);
    } catch {
      bodyEl.innerHTML = `<div class="uniwa-modal-state">Failed to load documents. Try opening the full page.</div>`;
    }
  }

  document.body.appendChild(root);
  void loadRoot();
}
