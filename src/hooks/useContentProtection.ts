import { useEffect } from "react";

/**
 * Hook to prevent copying, printing, and unauthorized content extraction.
 * Apply to pages with sensitive/proprietary content.
 */
export function useContentProtection() {
  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();

    const handleKeydown = (e: KeyboardEvent) => {
      // Block Ctrl+C, Ctrl+X, Ctrl+A, Ctrl+S, Ctrl+U, Ctrl+P
      if (e.ctrlKey && ['c','x','a','s','u','p'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        return false;
      }
      // Block Ctrl+Shift+I/J/C (DevTools)
      if (e.ctrlKey && e.shiftKey && ['i','j','c'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        return false;
      }
      // Block F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    };

    const handleBeforePrint = () => {
      document.body.style.display = 'none';
    };
    const handleAfterPrint = () => {
      document.body.style.display = '';
    };

    // Add protection styles
    const style = document.createElement('style');
    style.id = 'content-protection-style';
    style.textContent = `
      .content-protected {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      .content-protected img {
        -webkit-user-drag: none;
        user-drag: none;
        pointer-events: none;
      }
      @media print {
        .content-protected { display: none !important; }
      }
    `;
    document.head.appendChild(style);

    // Add watermark
    const wm = document.createElement('div');
    wm.id = 'content-watermark';
    wm.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;overflow:hidden;opacity:0.03';
    const text = '© Naturheilpraxis Rauch · Augsburg';
    let html = '';
    for (let i = 0; i < 60; i++) {
      const top = (i * 120) % 2000 - 200;
      const left = ((i * 317) % 1800) - 200;
      html += `<div style="position:absolute;top:${top}px;left:${left}px;transform:rotate(-35deg);white-space:nowrap;font-size:14px;font-family:sans-serif;color:#1f2924;user-select:none">${text}</div>`;
    }
    wm.innerHTML = html;
    document.body.appendChild(wm);

    // Add class to body
    document.body.classList.add('content-protected');

    // Register listeners
    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('selectstart', preventDefault);
    document.addEventListener('dragstart', preventDefault);
    document.addEventListener('copy', preventDefault);
    document.addEventListener('cut', preventDefault);
    document.addEventListener('keydown', handleKeydown);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('selectstart', preventDefault);
      document.removeEventListener('dragstart', preventDefault);
      document.removeEventListener('copy', preventDefault);
      document.removeEventListener('cut', preventDefault);
      document.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
      document.body.classList.remove('content-protected');
      document.getElementById('content-protection-style')?.remove();
      document.getElementById('content-watermark')?.remove();
    };
  }, []);
}
