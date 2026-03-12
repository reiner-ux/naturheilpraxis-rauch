/**
 * Content Protection Script – Naturheilpraxis Rauch
 * Prevents copying, printing, and unauthorized content extraction.
 */
(function() {
  'use strict';

  // 1. Block right-click context menu
  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });

  // 2. Block text selection via mouse
  document.addEventListener('selectstart', function(e) { e.preventDefault(); });

  // 3. Block drag
  document.addEventListener('dragstart', function(e) { e.preventDefault(); });

  // 4. Block copy/cut/paste
  document.addEventListener('copy', function(e) { e.preventDefault(); });
  document.addEventListener('cut', function(e) { e.preventDefault(); });

  // 5. Block keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Ctrl+C, Ctrl+X, Ctrl+A, Ctrl+S, Ctrl+U, Ctrl+P
    if (e.ctrlKey && ['c','x','a','s','u','p'].includes(e.key.toLowerCase())) {
      e.preventDefault(); return false;
    }
    // Ctrl+Shift+I (DevTools), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspector)
    if (e.ctrlKey && e.shiftKey && ['i','j','c'].includes(e.key.toLowerCase())) {
      e.preventDefault(); return false;
    }
    // F12 (DevTools)
    if (e.key === 'F12') { e.preventDefault(); return false; }
    // Ctrl+G, Ctrl+H (find/replace in some browsers)
    if (e.ctrlKey && ['g','h'].includes(e.key.toLowerCase())) {
      e.preventDefault(); return false;
    }
  });

  // 6. Block print (Ctrl+P and window.print)
  window.addEventListener('beforeprint', function(e) {
    document.body.style.display = 'none';
  });
  window.addEventListener('afterprint', function() {
    document.body.style.display = '';
  });

  // 7. Detect DevTools open (debugger-based)
  var devtoolsOpen = false;
  var threshold = 160;
  function detectDevTools() {
    var widthThreshold = window.outerWidth - window.innerWidth > threshold;
    var heightThreshold = window.outerHeight - window.innerHeight > threshold;
    if (widthThreshold || heightThreshold) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#1f2924;color:#f9f7f2;font-family:sans-serif;text-align:center;padding:2rem"><div><h1 style="font-size:1.5rem;margin-bottom:1rem">⚠️ Zugriff nicht gestattet</h1><p>Die Entwicklertools sind für diese Seite deaktiviert.</p><p style="margin-top:1rem;opacity:0.7">Bitte schließen Sie die Entwicklertools und laden Sie die Seite neu.</p></div></div>';
      }
    }
  }
  setInterval(detectDevTools, 1000);

  // 8. Add watermark overlay
  function createWatermark() {
    var wm = document.createElement('div');
    wm.id = 'content-watermark';
    wm.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;overflow:hidden;opacity:0.04';
    var text = '© Naturheilpraxis Rauch · Augsburg';
    var html = '';
    for (var i = 0; i < 80; i++) {
      var top = (i * 120) % 2000 - 200;
      var left = ((i * 317) % 1800) - 200;
      html += '<div style="position:absolute;top:' + top + 'px;left:' + left + 'px;transform:rotate(-35deg);white-space:nowrap;font-size:14px;font-family:sans-serif;color:#1f2924;user-select:none">' + text + '</div>';
    }
    wm.innerHTML = html;
    document.body.appendChild(wm);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWatermark);
  } else {
    createWatermark();
  }

  // 9. Override clipboard API
  if (navigator.clipboard) {
    Object.defineProperty(navigator, 'clipboard', {
      get: function() { return { writeText: function() { return Promise.reject(); }, write: function() { return Promise.reject(); } }; }
    });
  }

  // 10. Console warning
  console.log('%c⚠️ Inhalte urheberrechtlich geschützt – Kopieren nicht gestattet.', 'color:red;font-size:16px;font-weight:bold');
})();
