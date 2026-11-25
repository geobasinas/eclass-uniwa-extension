import '@betteroffice/docx-react/styles.css';
import './style.css';

import { DocxEditor } from '@betteroffice/docx-react';
import { PptxEditor } from '@betteroffice/pptx-react';
import { XlsxEditor } from '@betteroffice/xlsx-react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { getSettings } from '@/utils/storage';

window.addEventListener('error', (event) => {
  if (event.message?.includes('ResizeObserver loop')) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
});

type OfficeExt = 'docx' | 'pptx' | 'xlsx';

function detectExt(name: string, extParam: string | null): OfficeExt | null {
  const candidate = (extParam || name.split('.').pop() || '').toLowerCase();
  if (candidate === 'docx' || candidate === 'pptx' || candidate === 'xlsx') {
    return candidate;
  }
  return null;
}

function ViewerApp() {
  const params = new URLSearchParams(window.location.search);
  const fileUrl = params.get('url') || '';
  const fileName = params.get('name') || 'Document';
  const ext = detectExt(fileName, params.get('ext'));

  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = `${fileName} — UNIWA eClass Viewer`;
    void getSettings().then((s) => {
      document.documentElement.dataset.theme = s.theme;
    });
  }, [fileName]);

  useEffect(() => {
    if (!fileUrl || !ext) {
      setError('Unsupported or missing document URL.');
      return;
    }

    let cancelled = false;
    fetch(fileUrl, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();
        if (!cancelled) setBytes(new Uint8Array(buf));
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(`Failed to load document (${err instanceof Error ? err.message : 'network error'}).`);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fileUrl, ext]);

  return (
    <div className="viewer-shell">
      <header className="viewer-bar">
        <div className="viewer-title-wrap">
          {ext && <span className="viewer-badge">{ext}</span>}
          <h1 className="viewer-title" title={fileName}>
            {fileName}
          </h1>
        </div>
        {fileUrl && (
          <a className="viewer-btn" href={fileUrl}>
            Download
          </a>
        )}
      </header>

      <main className="viewer-stage">
        {error && <div className="viewer-state">{error}</div>}
        {!error && !bytes && <div className="viewer-state">Loading {fileName}…</div>}
        {!error && bytes && ext === 'docx' && (
          <DocxEditor documentBuffer={bytes} documentName={fileName} readOnly showToolbar={false} />
        )}
        {!error && bytes && ext === 'pptx' && (
          <PptxEditor file={bytes} fonts={[]} readOnly showToolbar={false} />
        )}
        {!error && bytes && ext === 'xlsx' && (
          <XlsxEditor file={bytes} fileName={fileName} readOnly showToolbar={false} />
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<ViewerApp />);
