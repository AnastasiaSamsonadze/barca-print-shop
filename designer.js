/* ============================================================
   BARCAPRINTSHOP — DESIGN STUDIO
   designer.js
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────────── */
  let selectedEl   = null;   // currently selected .dr-text-el
  let floatBar     = null;   // floating mini-toolbar element
  let isDragging   = false;
  let dragOffX     = 0;
  let dragOffY     = 0;
  let textCounter  = 0;
  let currentColor = 'white';

  /* ─────────────────────────────────────────────────
     DOM REFS
  ───────────────────────────────────────────────── */
  const printZone       = document.getElementById('print-zone');
  const shirtImg        = document.getElementById('shirt-img');
  const viewFrontThumb  = document.getElementById('view-front-thumb');
  const panelProduct    = document.getElementById('panel-product');
  const panelText       = document.getElementById('panel-text');
  const activeColorName = document.getElementById('active-color-name');

  // Text panel controls
  const inputContent  = document.getElementById('text-content');
  const inputColor    = document.getElementById('text-color');
  const colorDot      = document.getElementById('text-color-dot');
  const fontSelect    = document.getElementById('font-select');
  const inputSize     = document.getElementById('text-size');
  const btnBold       = document.getElementById('btn-bold');
  const btnItalic     = document.getElementById('btn-italic');
  const btnSizeMinus  = document.getElementById('btn-size-minus');
  const btnSizePlus   = document.getElementById('btn-size-plus');
  const btnDelete     = document.getElementById('btn-delete');
  const btnDuplicate  = document.getElementById('btn-duplicate');
  const btnBringFront = document.getElementById('btn-bring-front');
  const btnSendBack   = document.getElementById('btn-send-back');
  const bendVal       = document.getElementById('bend-val');
  const bendSlider    = document.getElementById('bend-slider');

  /* ─────────────────────────────────────────────────
     SIDEBAR TABS
  ───────────────────────────────────────────────── */
  document.querySelectorAll('.dr-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.dr-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (tab.dataset.tab === 'text') {
        addText();
      }
    });
  });

  /* ─────────────────────────────────────────────────
     COLOUR SWATCHES
  ───────────────────────────────────────────────── */
  document.querySelectorAll('.dr-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.dr-swatch').forEach(s => s.classList.remove('selected'));
      swatch.classList.add('selected');
      currentColor = swatch.dataset.color;
      shirtImg.src = swatch.dataset.img;
      activeColorName.textContent = currentColor;
      if (viewFrontThumb) viewFrontThumb.src = swatch.dataset.img;
    });
  });

  /* ─────────────────────────────────────────────────
     VIEW BUTTONS (decorative — only Front is active)
  ───────────────────────────────────────────────── */
  document.querySelectorAll('.dr-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.dr-view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ─────────────────────────────────────────────────
     FULLSCREEN TOGGLE
  ───────────────────────────────────────────────── */
  document.getElementById('btn-fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  /* ─────────────────────────────────────────────────
     ADD TEXT ELEMENT
  ───────────────────────────────────────────────── */
  function addText(text) {
    textCounter++;
    const label = text || 'Your text here';

    const el = document.createElement('div');
    el.className   = 'dr-text-el';
    el.dataset.id  = textCounter;
    el.textContent = label;

    // Default styles
    el.style.cssText = [
      'left: 16px',
      'top: ' + (16 + (textCounter - 1) * 6) + 'px',
      'font-size: 48px',
      'font-weight: 700',
      'color: #000000',
      "font-family: 'GelatoSans', sans-serif",
      'font-style: normal',
      'text-align: left',
    ].join(';');

    printZone.appendChild(el);
    bindTextEl(el);
    selectElement(el);
  }

  /* ─────────────────────────────────────────────────
     BIND EVENTS TO A TEXT ELEMENT
  ───────────────────────────────────────────────── */
  function bindTextEl(el) {
    el.addEventListener('mousedown', e => {
      e.stopPropagation();
      selectElement(el);
      startDrag(e, el);
    });

    // Double-click → focus content input in panel
    el.addEventListener('dblclick', e => {
      e.stopPropagation();
      inputContent.focus();
      inputContent.select();
    });
  }

  /* ─────────────────────────────────────────────────
     SELECT / DESELECT
  ───────────────────────────────────────────────── */
  function selectElement(el) {
    if (selectedEl === el) return;
    if (selectedEl) _deselect();
    selectedEl = el;
    el.classList.add('selected');
    showTextPanel();
    populateTextPanel(el);
    showFloatBar(el);
  }

  function _deselect() {
    if (!selectedEl) return;
    selectedEl.classList.remove('selected');
    selectedEl = null;
    hideTextPanel();
    removeFloatBar();
  }

  // Click anywhere outside text element or float bar → deselect
  document.addEventListener('mousedown', e => {
    if (!selectedEl) return;
    if (selectedEl.contains(e.target)) return;
    if (floatBar && floatBar.contains(e.target)) return;
    _deselect();
  });

  /* ─────────────────────────────────────────────────
     DRAG
  ───────────────────────────────────────────────── */
  function startDrag(e, el) {
    if (e.button !== 0) return;
    isDragging = true;
    el.classList.add('is-dragging');

    const zoneRect = printZone.getBoundingClientRect();
    const elRect   = el.getBoundingClientRect();

    dragOffX = e.clientX - elRect.left;
    dragOffY = e.clientY - elRect.top;

    function onMove(e) {
      if (!isDragging) return;
      let x = e.clientX - zoneRect.left - dragOffX;
      let y = e.clientY - zoneRect.top  - dragOffY;
      el.style.left = x + 'px';
      el.style.top  = y + 'px';
      positionFloatBar(el);
    }

    function onUp() {
      isDragging = false;
      el.classList.remove('is-dragging');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  }

  /* ─────────────────────────────────────────────────
     FLOATING MINI-TOOLBAR (duplicate + delete)
  ───────────────────────────────────────────────── */
  function showFloatBar(el) {
    removeFloatBar();

    floatBar = document.createElement('div');
    floatBar.className = 'dr-float-bar';
    floatBar.innerHTML = `
      <button class="dr-float-btn" id="fb-dup" title="Duplicate">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="1"/>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
        </svg>
      </button>
      <button class="dr-float-btn dr-float-delete" id="fb-del" title="Delete">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
        </svg>
      </button>
    `;

    printZone.appendChild(floatBar);
    positionFloatBar(el);

    floatBar.querySelector('#fb-del').addEventListener('click', e => {
      e.stopPropagation();
      deleteSelected();
    });
    floatBar.querySelector('#fb-dup').addEventListener('click', e => {
      e.stopPropagation();
      duplicateSelected();
    });
  }

  function positionFloatBar(el) {
    if (!floatBar) return;
    // centre horizontally above the element, within print-zone coordinates
    const cx = el.offsetLeft + el.offsetWidth  / 2;
    const ty = el.offsetTop  - 42;             // 42px above element top
    floatBar.style.left = cx + 'px';
    floatBar.style.top  = Math.max(-38, ty) + 'px';
  }

  function removeFloatBar() {
    if (floatBar) {
      floatBar.remove();
      floatBar = null;
    }
  }

  /* ─────────────────────────────────────────────────
     PANEL SWITCHING
  ───────────────────────────────────────────────── */
  function showTextPanel() {
    panelProduct.classList.add('hidden');
    panelText.classList.remove('hidden');
  }

  function hideTextPanel() {
    panelText.classList.add('hidden');
    panelProduct.classList.remove('hidden');
  }

  /* ─────────────────────────────────────────────────
     POPULATE TEXT PANEL FROM ELEMENT
  ───────────────────────────────────────────────── */
  function populateTextPanel(el) {
    inputContent.value = el.textContent.trim();

    const hexColor = rgbToHex(el.style.color) || '#000000';
    inputColor.value       = hexColor;
    colorDot.style.background = hexColor;

    inputSize.value = parseInt(el.style.fontSize) || 48;

    // Font family — match select option
    const fam = el.style.fontFamily || '';
    const opt = Array.from(fontSelect.options).find(o => o.value === fam);
    if (opt) fontSelect.value = fam;

    // Bold / Italic
    const isBold   = el.style.fontWeight === '700' || el.style.fontWeight === 'bold';
    const isItalic = el.style.fontStyle  === 'italic';
    btnBold.classList.toggle('active', isBold);
    btnItalic.classList.toggle('active', isItalic);

    // Align
    const align = el.style.textAlign || 'left';
    document.querySelectorAll('.dr-align-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.align === align);
    });

    // Bend (cosmetic only)
    bendVal.value    = 0;
    bendSlider.value = 0;
  }

  /* ─────────────────────────────────────────────────
     TEXT PANEL → LIVE UPDATES
  ───────────────────────────────────────────────── */

  // Text content
  inputContent.addEventListener('input', () => {
    if (!selectedEl) return;
    selectedEl.textContent = inputContent.value;
    positionFloatBar(selectedEl);
  });

  // Text color
  inputColor.addEventListener('input', () => {
    if (!selectedEl) return;
    selectedEl.style.color     = inputColor.value;
    colorDot.style.background  = inputColor.value;
  });

  // Font
  fontSelect.addEventListener('change', () => {
    if (!selectedEl) return;
    selectedEl.style.fontFamily = fontSelect.value;
  });

  // Size via number input
  inputSize.addEventListener('change', () => {
    applySize(parseInt(inputSize.value) || 48);
  });

  // Size via − / + buttons
  btnSizeMinus.addEventListener('click', () => {
    applySize(Math.max(8, (parseInt(inputSize.value) || 48) - 4));
  });
  btnSizePlus.addEventListener('click', () => {
    applySize(Math.min(200, (parseInt(inputSize.value) || 48) + 4));
  });

  function applySize(val) {
    inputSize.value = val;
    if (!selectedEl) return;
    selectedEl.style.fontSize = val + 'px';
    positionFloatBar(selectedEl);
  }

  // Bold
  btnBold.addEventListener('click', () => {
    if (!selectedEl) return;
    const isBold = selectedEl.style.fontWeight === '700' || selectedEl.style.fontWeight === 'bold';
    selectedEl.style.fontWeight = isBold ? '400' : '700';
    btnBold.classList.toggle('active', !isBold);
  });

  // Italic
  btnItalic.addEventListener('click', () => {
    if (!selectedEl) return;
    const isItalic = selectedEl.style.fontStyle === 'italic';
    selectedEl.style.fontStyle = isItalic ? 'normal' : 'italic';
    btnItalic.classList.toggle('active', !isItalic);
  });

  // Alignment
  document.querySelectorAll('.dr-align-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!selectedEl) return;
      selectedEl.style.textAlign = btn.dataset.align;
      document.querySelectorAll('.dr-align-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Bend (cosmetic sync only — not applied to element)
  bendSlider.addEventListener('input', () => { bendVal.value    = bendSlider.value; });
  bendVal.addEventListener('change',   () => { bendSlider.value = bendVal.value;    });

  /* ─────────────────────────────────────────────────
     ACTIONS: Delete / Duplicate / Z-order
  ───────────────────────────────────────────────── */
  btnDelete.addEventListener('click', deleteSelected);

  function deleteSelected() {
    if (!selectedEl) return;
    selectedEl.remove();
    selectedEl = null;
    removeFloatBar();
    hideTextPanel();
  }

  btnDuplicate.addEventListener('click', duplicateSelected);

  function duplicateSelected() {
    if (!selectedEl) return;
    textCounter++;
    const clone = document.createElement('div');
    clone.className   = 'dr-text-el';
    clone.dataset.id  = textCounter;
    clone.textContent = selectedEl.textContent;
    // Copy computed styles
    clone.style.cssText = selectedEl.style.cssText;
    clone.style.left    = (parseInt(selectedEl.style.left) || 0) + 18 + 'px';
    clone.style.top     = (parseInt(selectedEl.style.top)  || 0) + 18 + 'px';
    printZone.appendChild(clone);
    bindTextEl(clone);
    selectElement(clone);
  }

  btnBringFront.addEventListener('click', () => {
    if (!selectedEl) return;
    printZone.appendChild(selectedEl);   // move to end = highest z
    if (floatBar) printZone.appendChild(floatBar);
  });

  btnSendBack.addEventListener('click', () => {
    if (!selectedEl) return;
    printZone.insertBefore(selectedEl, printZone.firstChild);
  });

  /* ─────────────────────────────────────────────────
     KEYBOARD SHORTCUTS
  ───────────────────────────────────────────────── */
  document.addEventListener('keydown', e => {
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (!selectedEl) return;

    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      deleteSelected();
    }
    if (e.key === 'Escape') {
      _deselect();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      duplicateSelected();
    }

    // Nudge with arrow keys
    const step = e.shiftKey ? 10 : 1;
    const l = parseInt(selectedEl.style.left) || 0;
    const t = parseInt(selectedEl.style.top)  || 0;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); selectedEl.style.left = (l - step) + 'px'; positionFloatBar(selectedEl); }
    if (e.key === 'ArrowRight') { e.preventDefault(); selectedEl.style.left = (l + step) + 'px'; positionFloatBar(selectedEl); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); selectedEl.style.top  = (t - step) + 'px'; positionFloatBar(selectedEl); }
    if (e.key === 'ArrowDown')  { e.preventDefault(); selectedEl.style.top  = (t + step) + 'px'; positionFloatBar(selectedEl); }
  });

  /* ─────────────────────────────────────────────────
     UTILITY
  ───────────────────────────────────────────────── */
  function rgbToHex(rgb) {
    if (!rgb) return '#000000';
    if (rgb.startsWith('#')) return rgb;
    const m = rgb.match(/\d+/g);
    if (!m || m.length < 3) return '#000000';
    return '#' + m.slice(0, 3).map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
  }

  /* ─────────────────────────────────────────────────
     INIT — place one default text on load
  ───────────────────────────────────────────────── */
  addText('Your text here');

})();
