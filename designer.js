/* ============================================================
   BARCAPRINTSHOP — DESIGN STUDIO  (designer.js)
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────
     FONT CATALOGUE
  ───────────────────────────────────────────────── */
  const FONTS = [
    { label: 'GelatoSans',       value: "'GelatoSans', sans-serif" },
    { label: 'Bebas Neue',       value: "'Bebas Neue', sans-serif" },
    { label: 'Anton',            value: "'Anton', sans-serif" },
    { label: 'Oswald',           value: "'Oswald', sans-serif" },
    { label: 'Russo One',        value: "'Russo One', sans-serif" },
    { label: 'Black Han Sans',   value: "'Black Han Sans', sans-serif" },
    { label: 'Righteous',        value: "'Righteous', sans-serif" },
    { label: 'Montserrat',       value: "'Montserrat', sans-serif" },
    { label: 'Raleway',          value: "'Raleway', sans-serif" },
    { label: 'Playfair Display', value: "'Playfair Display', serif" },
    { label: 'Alfa Slab One',    value: "'Alfa Slab One', serif" },
    { label: 'Pacifico',         value: "'Pacifico', cursive" },
    { label: 'Lobster',          value: "'Lobster', cursive" },
    { label: 'Dancing Script',   value: "'Dancing Script', cursive" },
    { label: 'Satisfy',          value: "'Satisfy', cursive" },
    { label: 'Permanent Marker', value: "'Permanent Marker', cursive" },
  ];

  /* ─────────────────────────────────────────────────
     DATA STORE  (WeakMap: element → properties)
  ───────────────────────────────────────────────── */
  const elData = new WeakMap();

  /* ─────────────────────────────────────────────────
     COUNTERS / STATE
  ───────────────────────────────────────────────── */
  let textCounter = 0;
  let imgCounter  = 0;
  let pathCounter = 0;
  let selectedEl  = null;
  let currentView = 'front';
  let activeProductId = 'shirt';
  const zoneSnapshots = {};

  const PRODUCTS = [
    {
      id: 'shirt',
      title: "Men's T-Shirt",
      variantLabel: 'Product color',
      views: ['front', 'back'],
      zones: {
        front: { top: 12, left: 28, width: 45, height: 84 },
        back:  { top: 11, left: 27, width: 46, height: 85 },
      },
      variants: [
        { name: 'white', image: 'images/whiteshirt.webp', backImage: 'images/whiteback.webp', swatch: '#FFFFFF', dark: false },
        { name: 'black', image: 'images/blackshirt.webp', backImage: 'images/blackshirt-back.webp', swatch: '#111111', dark: true },
        { name: 'gray', image: 'images/grayshirt.webp', backImage: 'images/grayback.webp', swatch: '#888888', dark: false },
        { name: 'blue', image: 'images/blueshirt.png', backImage: 'images/blueshirt-back.png', swatch: '#2F5FA8', dark: true },
        { name: 'pink', image: 'images/pinkshirt.png', backImage: 'images/pinkshirt-back.png', swatch: '#F2A5BD', dark: false },
        { name: 'red', image: 'images/redshirt.png', backImage: 'images/redshirt-back.png', swatch: '#C62828', dark: true },
      ],
    },
    {
      id: 'cap',
      title: 'Classic Cap',
      variantLabel: 'Cap color',
      views: ['front'],
      zones: {
        front: { top: 23, left: 24, width: 52, height: 39 },
      },
      variants: [
        { name: 'black', image: 'images/cap-black-model.png', swatch: '#111111', dark: true },
        { name: 'blue', image: 'images/cap-blue-model.png', swatch: '#355B8C', dark: true },
        { name: 'gray', image: 'images/cap-gray-model.png', swatch: '#9CA3AF', dark: false },
        { name: 'pink', image: 'images/cap-pink-model.png', swatch: '#F4A5B8', dark: false },
        { name: 'red', image: 'images/cap-red-model.png', swatch: '#D23636', dark: true },
        { name: 'white', image: 'images/cap-white-model.png', swatch: '#FFFFFF', dark: false },
      ],
    },
    {
      id: 'keychain',
      title: 'Keychain',
      variantLabel: 'Keychain shape',
      views: ['front'],
      zones: {
        front: { top: 34, left: 24, width: 52, height: 44 },
      },
      variants: [
        {
          name: 'heart',
          image: 'images/keychain-heart-model.webp',
          swatch: '#F38EA6',
          dark: false,
          zones: {
            front: {
              top: 40,
              left: 19,
              width: 62,
              height: 58,
              clipPath: 'polygon(0 0, 100% 0, 100% 50%, 50% 100%, 0 50%)',
            },
          },
        },
        {
          name: 'hex',
          image: 'images/keychain-hex-model.png',
          swatch: '#B0B7C3',
          dark: false,
          zones: {
            front: { top: 48, left: 20, width: 60, height: 48 },
          },
        },
        {
          name: 'rectangle',
          image: 'images/keychain-rectangle-model.png',
          swatch: '#D6D6D6',
          dark: false,
          zones: {
            front: { top: 35, left: 18, width: 70, height: 61 },
          },
        },
        {
          name: 'round',
          image: 'images/keychain-round-model.png',
          swatch: '#E8E8E8',
          dark: false,
          zones: {
            front: { top: 52, left: 15, width: 83, height: 44, shape: 'round', lockCircle: true },
          },
        },
      ],
    },
    {
      id: 'totebag',
      title: 'Tote Bag',
      variantLabel: 'Bag color',
      views: ['front'],
      zones: {
        front: { top: 39, left: 23, width: 54, height: 58 },
      },
      variants: [
        { name: 'black', image: 'images/totebag-model-black.png', swatch: '#111111', dark: true },
        { name: 'gray', image: 'images/totebag-model-gray.png', swatch: '#9CA3AF', dark: false },
        { name: 'white', image: 'images/totebag-model-white.png', swatch: '#FFFFFF', dark: false },
      ],
    },
    {
      id: 'cup',
      title: 'Ceramic Cup',
      variantLabel: 'Cup style',
      views: ['front'],
      zones: {
        front: { top: 22, left: 21, width: 51, height: 62 },
      },
      variants: [
        { name: 'hola', image: 'images/catalog-create-yourdesignimage.jpeg', swatch: '#FFD700', dark: false },
      ],
    },
    {
      id: 'georgian-white',
      title: 'White Georgian Tee',
      variantLabel: 'Style',
      views: ['front'],
      zones: {
        front: { top: 12, left: 28, width: 45, height: 84 },
      },
      variants: [
        { name: 'studio', image: 'images/catalog-whitegeorgian-shirt-bluebackground.jpeg', swatch: '#FFFFFF', dark: false },
      ],
    },
    {
      id: 'georgian-black',
      title: 'Black Georgian Tee',
      variantLabel: 'Style',
      views: ['front'],
      zones: {
        front: { top: 12, left: 28, width: 45, height: 84 },
      },
      variants: [
        { name: 'studio', image: 'images/catalog-black-georgian-shirt-bluebackground.jpeg', swatch: '#111111', dark: true },
      ],
    },
    {
      id: 'georgian-red',
      title: 'Red Georgian Tee',
      variantLabel: 'Style',
      views: ['front'],
      zones: {
        front: { top: 12, left: 28, width: 45, height: 84 },
      },
      variants: [
        { name: 'studio', image: 'images/catalog-redgeorgian-shirt-bluebackground.jpeg', swatch: '#C62828', dark: true },
      ],
    },
    {
      id: 'editorial-heart',
      title: 'Editorial Heart Tee',
      variantLabel: 'Style',
      views: ['front'],
      zones: {
        front: { top: 12, left: 28, width: 45, height: 84 },
      },
      variants: [
        { name: 'default', image: 'images/instapost1.PNG', swatch: '#FFFFFF', dark: false },
      ],
    },
    {
      id: 'palm-paradise',
      title: 'Palm Paradise Tee',
      variantLabel: 'Style',
      views: ['front'],
      zones: {
        front: { top: 12, left: 28, width: 45, height: 84 },
      },
      variants: [
        { name: 'black', image: 'images/instapost2.PNG', swatch: '#111111', dark: true },
      ],
    },
    {
      id: 'pirosmani-jacket',
      title: 'Pirosmani Denim Jacket',
      variantLabel: 'Style',
      views: ['front'],
      zones: {
        front: { top: 8, left: 18, width: 64, height: 80 },
      },
      variants: [
        { name: 'denim', image: 'images/instapost5.PNG', swatch: '#5C7C99', dark: false },
      ],
    },
  ];

  const productById = {};
  const selectedVariantByProduct = {};
  PRODUCTS.forEach(product => {
    productById[product.id] = product;
    selectedVariantByProduct[product.id] = 0;
  });

  /* ─────────────────────────────────────────────────
     UNDO / REDO HISTORY
  ───────────────────────────────────────────────── */
  const undoStack = [];   // array of JSON snapshots
  let   undoPtr   = -1;
  let   historyDebounce = null;

  function serializeZone() {
    const items = [];
    printZone.querySelectorAll('.dr-text-el, .dr-img-el').forEach(el => {
      const d = elData.get(el);
      if (d) items.push(Object.assign({}, d));
    });
    return JSON.stringify(items);
  }

  function clearZoneElements() {
    _deselect(true);
    Array.from(printZone.querySelectorAll('.dr-text-el, .dr-img-el')).forEach(e => e.remove());
  }

  function zoneKey(productId, view) {
    return `${productId}:${view}`;
  }

  function saveCurrentZoneSnapshot() {
    zoneSnapshots[zoneKey(activeProductId, currentView)] = serializeZone();
  }

  function loadZoneSnapshot(productId, view) {
    const snapshot = zoneSnapshots[zoneKey(productId, view)] || '[]';
    restoreZone(snapshot);
  }

  function resetProductSnapshots(productId) {
    zoneSnapshots[zoneKey(productId, 'front')] = '[]';
    zoneSnapshots[zoneKey(productId, 'back')] = '[]';
  }

  function resetHistoryFromCurrentZone() {
    undoStack.length = 0;
    undoStack.push(serializeZone());
    undoPtr = 0;
    updateUndoBtns();
  }

  function pushHistory() {
    clearTimeout(historyDebounce);
    // Drop any redo future
    undoStack.splice(undoPtr + 1);
    undoStack.push(serializeZone());
    undoPtr = undoStack.length - 1;
    updateUndoBtns();
  }

  function pushHistoryDebounced(ms) {
    clearTimeout(historyDebounce);
    historyDebounce = setTimeout(pushHistory, ms || 400);
  }

  function updateUndoBtns() {
    if (btnUndo) btnUndo.disabled = undoPtr <= 0;
    if (btnRedo) btnRedo.disabled = undoPtr >= undoStack.length - 1;
    if (mobBtnUndo) mobBtnUndo.disabled = undoPtr <= 0;
    if (mobBtnRedo) mobBtnRedo.disabled = undoPtr >= undoStack.length - 1;
  }

  function restoreZone(snapshot) {
    _deselect(true);
    clearZoneElements();
    const items = JSON.parse(snapshot);
    items.forEach(item => {
      if (item._type === 'image') {
        const el = _createImgEl(item);
        printZone.appendChild(el);
        constrainToZone(el);
      } else {
        const el = createTextEl(item);
        printZone.appendChild(el);
        renderContent(el);
        clampFontSize(el);
        constrainToZone(el);
      }
    });
  }

  function doUndo() {
    if (undoPtr <= 0) return;
    undoPtr--;
    restoreZone(undoStack[undoPtr]);
    updateUndoBtns();
  }

  function doRedo() {
    if (undoPtr >= undoStack.length - 1) return;
    undoPtr++;
    restoreZone(undoStack[undoPtr]);
    updateUndoBtns();
  }

  /* ─────────────────────────────────────────────────
     DOM REFS
  ───────────────────────────────────────────────── */
  const printZone       = document.getElementById('print-zone');
  const shirtImg        = document.getElementById('shirt-img');
  const viewFrontThumb  = document.getElementById('view-front-thumb');
  const viewBackThumb   = document.getElementById('view-back-thumb');
  const panelProduct    = document.getElementById('panel-product');
  const panelText       = document.getElementById('panel-text');
  const productPicker   = document.getElementById('dr-product-picker');
  const colorGrid       = document.getElementById('color-grid');
  const activeProductTitle = document.getElementById('active-product-title');
  const variantLabelPrefix = document.getElementById('variant-label-prefix');
  const activeColorName = document.getElementById('active-color-name');
  const btnUndo         = document.getElementById('btn-undo');
  const btnRedo         = document.getElementById('btn-redo');
  const mobBtnUndo      = document.getElementById('mob-btn-undo');
  const mobBtnRedo      = document.getElementById('mob-btn-redo');

  const inputContent  = document.getElementById('text-content');
  const inputColor    = document.getElementById('text-color');
  const colorDot      = document.getElementById('text-color-dot');
  const fontTrigger   = document.getElementById('font-trigger');
  const fontLabel     = document.getElementById('font-label');
  const fontList      = document.getElementById('font-list');
  const inputSize     = document.getElementById('text-size');
  const btnBold       = document.getElementById('btn-bold');
  const btnItalic     = document.getElementById('btn-italic');
  const btnSizeMinus  = document.getElementById('btn-size-minus');
  const btnSizePlus   = document.getElementById('btn-size-plus');
  const btnDelete     = document.getElementById('btn-delete');
  const btnDuplicate  = document.getElementById('btn-duplicate');
  const btnBringFront = document.getElementById('btn-bring-front');
  const btnSendBack   = document.getElementById('btn-send-back');
  const bendValInput  = document.getElementById('bend-val');
  const bendSlider    = document.getElementById('bend-slider');

  const viewFrontBtn = document.querySelector('.dr-view-btn[data-view="front"]');
  const viewBackBtn  = document.querySelector('.dr-view-btn[data-view="back"]');

  function getActiveProduct() {
    return productById[activeProductId] || PRODUCTS[0];
  }

  function getActiveVariant() {
    const product = getActiveProduct();
    const idx = selectedVariantByProduct[product.id] || 0;
    return product.variants[Math.max(0, Math.min(idx, product.variants.length - 1))];
  }

  function updateImageAndThumbs() {
    const variant = getActiveVariant();
    if (!variant) return;
    const frontSrc = variant.image;
    const backSrc = variant.backImage || variant.image;

    if (viewFrontThumb) viewFrontThumb.src = frontSrc;
    if (viewBackThumb)  viewBackThumb.src = backSrc;
    shirtImg.src = currentView === 'back' ? backSrc : frontSrc;
  }

  function applyPrintZoneByProduct() {
    const product = getActiveProduct();
    const activeVariant = getActiveVariant();
    const variantZones = activeVariant && activeVariant.zones ? activeVariant.zones : null;
    const zone =
      (variantZones && (variantZones[currentView] || variantZones.front)) ||
      product.zones[currentView] ||
      product.zones.front;
    if (!zone) return;

    printZone.classList.remove('zone-round', 'back-view');
    if (zone.shape === 'round' || zone.lockCircle) {
      printZone.classList.add('zone-round');
    }
    if (currentView === 'back') {
      printZone.classList.add('back-view');
    }

    let widthPct = zone.width;
    let heightPct = zone.height;

    // Only auto-compute circle height when a zone height is not explicitly provided.
    if (
      zone.lockCircle &&
      (zone.height === undefined || zone.height === null) &&
      shirtImg &&
      shirtImg.clientWidth &&
      shirtImg.clientHeight
    ) {
      heightPct = widthPct * (shirtImg.clientWidth / shirtImg.clientHeight);
    }

    printZone.style.top = `${zone.top}%`;
    printZone.style.left = `${zone.left}%`;
    printZone.style.width = `${widthPct}%`;
    printZone.style.height = `${heightPct}%`;
    printZone.style.clipPath = zone.clipPath || 'none';
  }

  function setViewButtonsForProduct() {
    const product = getActiveProduct();
    const supportsBack = product.views.includes('back');

    if (viewBackBtn) {
      viewBackBtn.style.display = supportsBack ? '' : 'none';
    }

    if (!supportsBack && currentView === 'back') {
      currentView = 'front';
    }

    if (viewFrontBtn) viewFrontBtn.classList.toggle('active', currentView === 'front');
    if (viewBackBtn) viewBackBtn.classList.toggle('active', currentView === 'back' && supportsBack);

    const mobFrontBtn = document.querySelector('.mob-view-btn[data-view="front"]');
    const mobBackBtn = document.querySelector('.mob-view-btn[data-view="back"]');
    if (mobBackBtn) mobBackBtn.style.display = supportsBack ? '' : 'none';
    if (mobFrontBtn) mobFrontBtn.classList.toggle('active', currentView === 'front');
    if (mobBackBtn) mobBackBtn.classList.toggle('active', currentView === 'back' && supportsBack);
  }

  function maybeAutoAdjustTextColor(previousVariant, nextVariant) {
    if (!previousVariant || !nextVariant) return;
    const goingDark = !!nextVariant.dark && !previousVariant.dark;
    const leavingDark = !!previousVariant.dark && !nextVariant.dark;

    if (!goingDark && !leavingDark) return;

    printZone.querySelectorAll('.dr-text-el').forEach(el => {
      const d = elData.get(el);
      if (!d) return;

      if (goingDark && (d.color === '#000000' || d.color === '#000')) {
        d.color = '#ffffff';
        renderContent(el);
        if (el === selectedEl) {
          inputColor.value = '#ffffff';
          colorDot.style.background = '#ffffff';
        }
      } else if (leavingDark && (d.color === '#ffffff' || d.color === '#fff')) {
        d.color = '#000000';
        renderContent(el);
        if (el === selectedEl) {
          inputColor.value = '#000000';
          colorDot.style.background = '#000000';
        }
      }
    });
  }

  function renderVariantSwatches() {
    if (!colorGrid) return;
    const product = getActiveProduct();
    const selectedIdx = selectedVariantByProduct[product.id] || 0;

    colorGrid.innerHTML = '';
    product.variants.forEach((variant, index) => {
      const sw = document.createElement('button');
      sw.type = 'button';
      sw.className = 'dr-swatch';
      if (index === selectedIdx) sw.classList.add('selected');
      sw.dataset.index = String(index);
      sw.dataset.color = variant.name;
      sw.title = variant.name;
      sw.style.setProperty('--sw', variant.swatch || '#d0d0d0');
      sw.innerHTML = `
        <svg class="dr-swatch-check" width="12" height="12" viewBox="0 0 12 12">
          <path d="M2 6l3 3 5-5" stroke="#333" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
      colorGrid.appendChild(sw);
    });
  }

  function renderDesktopProductPicker() {
    if (!productPicker) return;
    productPicker.innerHTML = '';

    PRODUCTS.forEach(product => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'dr-product-option';
      option.dataset.productId = product.id;
      if (product.id === activeProductId) option.classList.add('active');
      option.innerHTML = `
        <img src="${product.variants[0].image}" alt="${product.title}">
        <span>${product.title}</span>`;

      option.addEventListener('click', e => {
        e.stopPropagation();
        applyProduct(product.id);
      });

      productPicker.appendChild(option);
    });
  }

  function renderMobileProductCards() {
    const mobProductGrid = document.getElementById('mob-product-grid');
    if (!mobProductGrid) return;

    mobProductGrid.innerHTML = '';
    PRODUCTS.forEach(product => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'mob-product-card';
      if (product.id === activeProductId) card.classList.add('active');
      card.dataset.productId = product.id;
      card.innerHTML = `
        <img src="${product.variants[0].image}" alt="${product.title}">
        <span>${product.title}</span>`;

      card.addEventListener('click', () => {
        applyProduct(product.id);
      });

      mobProductGrid.appendChild(card);
    });
  }

  function syncMobileSwatches() {
    const mobSwatchRow = document.getElementById('mob-swatch-row');
    const mobVariantLabel = document.getElementById('mob-variant-label');
    if (!mobSwatchRow) return;

    const product = getActiveProduct();
    const selectedIdx = selectedVariantByProduct[product.id] || 0;
    const variant = product.variants[selectedIdx] || product.variants[0];

    mobSwatchRow.innerHTML = '';
    product.variants.forEach((variant, index) => {
      const sw = document.createElement('button');
      sw.type = 'button';
      sw.className = 'dr-swatch';
      if (index === selectedIdx) sw.classList.add('selected');
      sw.dataset.index = String(index);
      sw.dataset.color = variant.name;
      sw.title = variant.name;
      sw.style.setProperty('--sw', variant.swatch || '#d0d0d0');
      sw.innerHTML = `
        <svg class="dr-swatch-check" width="12" height="12" viewBox="0 0 12 12">
          <path d="M2 6l3 3 5-5" stroke="#333" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
      mobSwatchRow.appendChild(sw);
    });

    if (mobVariantLabel) {
      if (mobVariantLabel.childNodes.length > 0) {
        mobVariantLabel.childNodes[0].nodeValue = `${product.variantLabel}: `;
      }
      const mobActiveColor = mobVariantLabel.querySelector('strong');
      if (mobActiveColor) {
        mobActiveColor.textContent = variant ? variant.name : '';
      }
    }
  }

  function setActiveVariant(index, options) {
    const opts = options || {};
    const product = getActiveProduct();
    const prevVariant = getActiveVariant();

    const safeIndex = Math.max(0, Math.min(index, product.variants.length - 1));
    selectedVariantByProduct[product.id] = safeIndex;
    const nextVariant = getActiveVariant();

    if (activeColorName) activeColorName.textContent = nextVariant.name;
    renderVariantSwatches();
    syncMobileSwatches();
    updateImageAndThumbs();
    applyPrintZoneByProduct();
    printZone.querySelectorAll('.dr-text-el, .dr-img-el').forEach(el => {
      constrainToZone(el);
    });

    if (opts.autoTextColor !== false) {
      maybeAutoAdjustTextColor(prevVariant, nextVariant);
    }

    if (!opts.silent) {
      pushHistoryDebounced(250);
    }
  }

  function applyProduct(productId) {
    if (!productById[productId]) return;
    const previousProductId = activeProductId;

    // Persist current side before moving away.
    saveCurrentZoneSnapshot();

    // User-requested behavior: when product changes, start with a clean design.
    if (productId !== previousProductId) {
      resetProductSnapshots(productId);
      currentView = 'front';
    }

    activeProductId = productId;
    const cw = document.getElementById('canvas-wrap');
    if (cw) cw.setAttribute('data-product', activeProductId);

    const product = getActiveProduct();
    if (activeProductTitle) activeProductTitle.textContent = product.title;
    if (variantLabelPrefix) variantLabelPrefix.textContent = `${product.variantLabel}:`;

    setViewButtonsForProduct();
    applyPrintZoneByProduct();
    setActiveVariant(selectedVariantByProduct[product.id] || 0, { silent: true });
    loadZoneSnapshot(product.id, currentView);

    printZone.querySelectorAll('.dr-text-el, .dr-img-el').forEach(el => {
      constrainToZone(el);
    });

    resetHistoryFromCurrentZone();

    renderDesktopProductPicker();
    renderMobileProductCards();
  }

  function hideProductPicker() {
    if (productPicker) productPicker.classList.add('hidden');
  }

  function toggleProductPicker() {
    if (!productPicker) return;
    productPicker.classList.toggle('hidden');
  }

  /* ─────────────────────────────────────────────────
     CANVAS TEXT MEASUREMENT
  ───────────────────────────────────────────────── */
  let _ctx2d = null;

  function measureText(text, fontSize, fontFamily, fontWeight, fontStyle) {
    if (!_ctx2d) {
      _ctx2d = document.createElement('canvas').getContext('2d');
    }
    const ff = fontFamily.replace(/'/g, '"');
    _ctx2d.font = `${fontStyle} ${fontWeight} ${Math.round(fontSize)}px ${ff}`;
    return _ctx2d.measureText(text).width;
  }

  function escapeXml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ─────────────────────────────────────────────────
     BUILD SVG — straight or arced text
  ───────────────────────────────────────────────── */
  function buildSVG(d) {
    const { text, bend, fontSize, fontFamily, fontWeight, fontStyle, color } = d;
    const ff      = fontFamily.replace(/'/g, '"');
    const rawW    = measureText(text || ' ', fontSize, fontFamily, fontWeight, fontStyle);
    const pad     = fontSize * 0.25;
    const W       = Math.max(rawW + pad * 2, 1);
    // Fixed SVG height for ALL bend values → element never shifts up/down when arc changes
    const nomH    = Math.ceil(fontSize * 1.4);
    const absBend = Math.abs(bend);

    if (absBend < 2) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(W)}" height="${nomH}" overflow="visible">
        <text x="${pad}" y="${Math.round(fontSize)}"
          font-family="${ff}" font-size="${fontSize}"
          font-weight="${fontWeight}" font-style="${fontStyle}"
          fill="${color}">${escapeXml(text)}</text>
      </svg>`;
    }

    /* ── ARCED ── */
    const chord = rawW;
    const sag   = (absBend / 100) * chord * 0.45;
    const R     = Math.max(chord / 2 + 1, (chord * chord) / (8 * sag) + sag / 2);
    const pid   = `p${++pathCounter}`;

    // Visual centre of text (cap-height midpoint) anchored at refY regardless of bend
    const refY = fontSize * 0.72;
    let pathD;

    if (bend > 0) {
      // Rainbow arch: peak is sag above arc endpoints.
      // Visual centre ≈ y0 - sag/2 → pin to refY → y0 = refY + sag/2
      const y0 = refY + sag / 2;
      pathD = `M ${pad},${y0} A ${R},${R} 0 0,0 ${pad + chord},${y0}`;
    } else {
      // Frown arch: nadir is sag below arc endpoints.
      // Visual centre ≈ y0 + sag/2 → pin to refY → y0 = refY - sag/2
      const y0 = Math.max(fontSize * 0.2, refY - sag / 2);
      pathD = `M ${pad},${y0} A ${R},${R} 0 0,1 ${pad + chord},${y0}`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(W)}" height="${nomH}" overflow="visible">
      <defs><path id="${pid}" d="${pathD}"/></defs>
      <text font-family="${ff}" font-size="${fontSize}"
        font-weight="${fontWeight}" font-style="${fontStyle}" fill="${color}">
        <textPath href="#${pid}" startOffset="50%" text-anchor="middle">${escapeXml(text)}</textPath>
      </text>
    </svg>`;
  }

  /* ─────────────────────────────────────────────────
     RENDER ELEMENT CONTENT  (updates SVG inside el)
  ───────────────────────────────────────────────── */
  function renderContent(el) {
    const d = elData.get(el);
    if (!d) return;
    const content = el.querySelector('.dr-text-content');
    if (content) content.innerHTML = buildSVG(d);
  }

  function renderImageContent(el) {
    const d = elData.get(el);
    if (!d || d._type !== 'image') return;
    const img = el.querySelector('img');
    if (!img) return;

    const fitMode = d.fitMode || 'contain';
    img.style.objectFit = fitMode;
    img.style.opacity = String(d.opacity === undefined ? 1 : d.opacity);
    img.style.filter = d.grayscale ? 'grayscale(1)' : 'none';
  }

  /* ─────────────────────────────────────────────────
     CLAMP FONT SIZE  so element never overflows zone
  ───────────────────────────────────────────────── */
  function clampFontSize(el) {
    const d = elData.get(el);
    if (!d) return;

    const maxW = printZone.clientWidth  - 4;
    const maxH = printZone.clientHeight - 4;

    let changed = false;
    for (let i = 0; i < 40; i++) {
      renderContent(el);
      if (el.offsetWidth <= maxW && el.offsetHeight <= maxH) break;
      if (d.fontSize <= 8) break;
      d.fontSize = Math.max(8, d.fontSize - 2);
      changed = true;
    }
    if (changed) {
      renderContent(el);
      if (inputSize && selectedEl === el) inputSize.value = Math.round(d.fontSize);
    }
  }

  /* ─────────────────────────────────────────────────
     CONSTRAIN POSITION inside print zone
  ───────────────────────────────────────────────── */
  function constrainToZone(el) {
    const zW = printZone.clientWidth;
    const zH = printZone.clientHeight;
    const eW = el.offsetWidth;
    const eH = el.offsetHeight;

    let l = parseFloat(el.style.left) || 0;
    let t = parseFloat(el.style.top)  || 0;

    l = Math.max(0, Math.min(l, Math.max(0, zW - eW)));
    t = Math.max(0, Math.min(t, Math.max(0, zH - eH)));

    el.style.left = l + 'px';
    el.style.top  = t + 'px';
  }

  function applyElementTransform(el) {
    const d = elData.get(el);
    if (!d) return;
    const rotation = Number.isFinite(d.rotation) ? d.rotation : 0;
    el.style.transform = `rotate(${rotation}deg)`;
  }

  /* ─────────────────────────────────────────────────
     SHARED ELEMENT HANDLES & BAR BUILDER
  ───────────────────────────────────────────────── */
  function addHandlesAndBar(el) {
    /* Floating action bar */
    const bar = document.createElement('div');
    bar.className = 'dr-el-bar';
    bar.innerHTML = `
      <button class="dr-el-btn dr-btn-edit" title="Edit settings">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3v4"/><path d="M12 17v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/>
          <path d="M3 12h4"/><path d="M17 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/>
        </svg>
        <span class="dr-btn-edit-label">Edit</span>
      </button>
      <button class="dr-el-btn dr-btn-dup" title="Duplicate">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="1"/>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
        </svg>
      </button>
      <button class="dr-el-btn dr-btn-delete" title="Delete">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
        </svg>
      </button>`;
    el.appendChild(bar);

    /* Corner handles */
    ['tl','tr','bl','br'].forEach(c => {
      const h = document.createElement('span');
      h.className      = `dr-handle dr-h-${c}`;
      h.dataset.corner = c;
      el.appendChild(h);
    });
  }

  /* ─────────────────────────────────────────────────
     CREATE TEXT ELEMENT
  ───────────────────────────────────────────────── */
  function createTextEl(overrides) {
    textCounter++;
    const d = Object.assign({
      _type:      'text',
      text:       'Your text here',
      bend:       0,
      fontSize:   48,
      fontFamily: FONTS[0].value,
      fontWeight: '700',
      fontStyle:  'normal',
      color:      '#000000',
      textAlign:  'center',
      left:       16,
      top:        Math.max(16, Math.round(printZone.clientHeight * 0.3)),
      rotation:   0,
    }, overrides || {});

    const el = document.createElement('div');
    el.className  = 'dr-text-el';
    el.dataset.id = String(textCounter);
    el.style.left = d.left + 'px';
    el.style.top  = d.top  + 'px';

    const content = document.createElement('div');
    content.className = 'dr-text-content';
    el.appendChild(content);

    addHandlesAndBar(el);

    /* Rotate handle */
    const rotWrap = document.createElement('div');
    rotWrap.className = 'dr-rotate-wrap';
    rotWrap.innerHTML = `
      <div class="dr-rotate-line"></div>
      <button class="dr-rotate-btn" title="Rotate" tabindex="-1">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0115-6.7L21 8"/>
        </svg>
      </button>`;
    el.appendChild(rotWrap);

    elData.set(el, d);
    applyElementTransform(el);
    bindTextEl(el);
    return el;
  }

  /* ─────────────────────────────────────────────────
     CREATE IMAGE ELEMENT
  ───────────────────────────────────────────────── */
  function _createImgEl(overrides) {
    imgCounter++;
    const d = Object.assign({
      _type:  'image',
      src:    '',
      left:   8,
      top:    8,
      width:  120,
      height: 120,
      fitMode: 'contain',
      grayscale: false,
      opacity: 1,
      rotation: 0,
    }, overrides || {});

    const el = document.createElement('div');
    el.className  = 'dr-img-el';
    el.dataset.id = 'img-' + imgCounter;
    el.style.cssText = `position:absolute;left:${d.left}px;top:${d.top}px;width:${d.width}px;height:${d.height}px;
      cursor:grab;user-select:none;line-height:0;`;

    const img = document.createElement('img');
    img.src   = d.src;
    img.style.cssText = 'width:100%;height:100%;object-fit:contain;pointer-events:none;display:block;';
    el.appendChild(img);
    renderImageContent(el);

    addHandlesAndBar(el);
    elData.set(el, d);
    applyElementTransform(el);
    bindImgEl(el);
    return el;
  }

  /* ─────────────────────────────────────────────────
     ADD TEXT (public — used by tab click + init)
  ───────────────────────────────────────────────── */
  function addText(overrides) {
    // Auto-pick white text on dark product variants
    const activeVariant = getActiveVariant();
    const defaults = activeVariant && activeVariant.dark ? { color: '#ffffff' } : {};

    const el = createTextEl(Object.assign(defaults, overrides || {}));
    printZone.appendChild(el);
    renderContent(el);
    clampFontSize(el);
    constrainToZone(el);
    selectEl(el);
    pushHistory();
  }

  /* ─────────────────────────────────────────────────
     BIND EVENTS — TEXT ELEMENT
  ───────────────────────────────────────────────── */
  function bindTextEl(el) {
    function handleDragStart(e) {
      if (e.target.classList.contains('dr-handle'))  return;
      if (e.target.classList.contains('dr-el-btn'))  return;
      if (e.target.closest('.dr-el-bar'))            return;
      if (e.target.closest('.dr-rotate-wrap'))       return;
      e.stopPropagation();
      if (e.type === 'touchstart') e.preventDefault();
      selectEl(el);
      startDrag(e, el);
    }
    el.addEventListener('mousedown',  handleDragStart);
    el.addEventListener('touchstart', handleDragStart, { passive: false });

    el.addEventListener('dblclick', e => {
      e.stopPropagation();
      if (inputContent) { inputContent.focus(); inputContent.select(); }
    });

    el.querySelector('.dr-btn-edit').addEventListener('click', e => {
      e.stopPropagation();
      selectEl(el);
      if (isMobile()) mobShowEditSheet(el);
    });

    el.querySelector('.dr-btn-dup').addEventListener('click', e => {
      e.stopPropagation(); duplicateEl(el);
    });
    el.querySelector('.dr-btn-delete').addEventListener('click', e => {
      e.stopPropagation(); deleteEl(el);
    });

    el.querySelectorAll('.dr-handle').forEach(h => {
      h.addEventListener('mousedown', e => {
        e.stopPropagation(); e.preventDefault();
        startResize(e, el, h.dataset.corner);
      });
      h.addEventListener('touchstart', e => {
        e.stopPropagation(); e.preventDefault();
        startResize(e, el, h.dataset.corner);
      }, { passive: false });
    });

    const rotateBtn = el.querySelector('.dr-rotate-btn');
    if (rotateBtn) {
      rotateBtn.addEventListener('mousedown', e => startRotate(e, el));
      rotateBtn.addEventListener('touchstart', e => startRotate(e, el), { passive: false });
    }
  }

  /* ─────────────────────────────────────────────────
     BIND EVENTS — IMAGE ELEMENT
  ───────────────────────────────────────────────── */
  function bindImgEl(el) {
    function handleDragStart(e) {
      if (e.target.classList.contains('dr-handle'))  return;
      if (e.target.classList.contains('dr-el-btn'))  return;
      if (e.target.closest('.dr-el-bar'))            return;
      e.stopPropagation();
      if (e.type === 'touchstart') e.preventDefault();
      selectEl(el, 'image');
      startDrag(e, el);
    }
    el.addEventListener('mousedown',  handleDragStart);
    el.addEventListener('touchstart', handleDragStart, { passive: false });

    el.querySelector('.dr-btn-edit').addEventListener('click', e => {
      e.stopPropagation();
      selectEl(el, 'image');
      if (isMobile()) mobShowEditSheet(el);
    });

    el.querySelector('.dr-btn-dup').addEventListener('click', e => {
      e.stopPropagation(); duplicateEl(el);
    });
    el.querySelector('.dr-btn-delete').addEventListener('click', e => {
      e.stopPropagation(); deleteEl(el);
    });

    el.querySelectorAll('.dr-handle').forEach(h => {
      h.addEventListener('mousedown', e => {
        e.stopPropagation(); e.preventDefault();
        startImgResize(e, el, h.dataset.corner);
      });
      h.addEventListener('touchstart', e => {
        e.stopPropagation(); e.preventDefault();
        startImgResize(e, el, h.dataset.corner);
      }, { passive: false });
    });
  }

  /* ─────────────────────────────────────────────────
     SELECT / DESELECT
  ───────────────────────────────────────────────── */
  function selectEl(el, type) {
    if (selectedEl === el) return;
    if (selectedEl) _deselect(false);
    selectedEl = el;
    el.classList.add('selected');
    el.style.zIndex      = '40';

    const d = elData.get(el);
    if (d && d._type === 'image') {
      hideTextPanel(); // show product panel for images
    } else {
      showTextPanel();
      populatePanel(el);
    }
    // Mobile: edit sheet opens only from explicit Edit action.
  }

  function _deselect(hidePanel) {
    if (!selectedEl) return;
    selectedEl.classList.remove('selected');
    selectedEl.style.zIndex      = '';
    selectedEl = null;
    if (hidePanel !== false) hideTextPanel();
    // Mobile: hide edit sheet + unzoom
    if (isMobile()) mobEndTransform();
    if (isMobile()) mobHideEditSheet();
  }

  /* Click on grey background → deselect */
  document.getElementById('canvas-wrap').addEventListener('mousedown', e => {
    if (e.target === document.getElementById('canvas-wrap') ||
        e.target === document.getElementById('design-canvas') ||
        e.target === shirtImg) {
      _deselect();
    }
  });
  printZone.addEventListener('mousedown', e => {
    if (e.target === printZone) _deselect();
  });

  /* ─────────────────────────────────────────────────
     TOUCH HELPER
  ───────────────────────────────────────────────── */
  function ptOf(e) {
    if (e.touches      && e.touches.length)        return e.touches[0];
    if (e.changedTouches && e.changedTouches.length) return e.changedTouches[0];
    return e;
  }

  /* ─────────────────────────────────────────────────
     DRAG (constrained to print zone)
  ───────────────────────────────────────────────── */
  function startDrag(e, el) {
    const isTouch = e.type === 'touchstart';
    if (!isTouch && e.button !== 0) return;
    el.classList.add('is-dragging');
    el.style.cursor = 'grabbing';
    if (isMobile()) mobBeginTransform();

    const pt     = ptOf(e);
    const zRect  = printZone.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const offX   = pt.clientX - elRect.left;
    const offY   = pt.clientY - elRect.top;

    function onMove(mv) {
      if (mv.cancelable) mv.preventDefault();
      const p = ptOf(mv);
      const d = elData.get(el);
      if (!d) return;
      d.left = p.clientX - zRect.left - offX;
      d.top  = p.clientY - zRect.top  - offY;
      el.style.left = d.left + 'px';
      el.style.top  = d.top  + 'px';
      constrainToZone(el);
      d.left = parseFloat(el.style.left);
      d.top  = parseFloat(el.style.top);
    }

    function onUp() {
      el.classList.remove('is-dragging');
      el.style.cursor = '';
      if (isMobile()) mobEndTransform();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend',  onUp);
      pushHistory();
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend',  onUp);
  }

  /* ─────────────────────────────────────────────────
     RESIZE — TEXT: corner drag scales fontSize
  ───────────────────────────────────────────────── */
  function startResize(e, el, corner) {
    selectEl(el);
    const d = elData.get(el);
    if (!d) return;

    const p0     = ptOf(e);
    const startX  = p0.clientX;
    const startY  = p0.clientY;
    const startSz = d.fontSize;
    const signX   = corner.includes('r') ?  1 : -1;
    const signY   = corner.includes('b') ?  1 : -1;

    document.body.style.cursor = `${corner}-resize`;
    if (isMobile()) mobBeginTransform();

    function onMove(mv) {
      if (mv.cancelable) mv.preventDefault();
      const p  = ptOf(mv);
      const dx = (p.clientX - startX) * signX;
      const dy = (p.clientY - startY) * signY;
      d.fontSize = Math.max(8, startSz + (dx + dy) * 0.35);
      renderContent(el);
      clampFontSize(el);
      constrainToZone(el);
      if (inputSize) inputSize.value = Math.round(d.fontSize);
    }

    function onUp() {
      document.body.style.cursor = '';
      if (isMobile()) mobEndTransform();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend',  onUp);
      pushHistory();
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend',  onUp);
  }

  /* ─────────────────────────────────────────────────
     RESIZE — IMAGE: corner drag resizes element
  ───────────────────────────────────────────────── */
  function startImgResize(e, el, corner) {
    selectEl(el, 'image');
    const d = elData.get(el);
    if (!d) return;

    const p0     = ptOf(e);
    const startX = p0.clientX;
    const startY = p0.clientY;
    const startW = d.width;
    const startH = d.height;
    const signX  = corner.includes('r') ?  1 : -1;
    const signY  = corner.includes('b') ?  1 : -1;

    const maxW = printZone.clientWidth  - 4;
    const maxH = printZone.clientHeight - 4;

    document.body.style.cursor = `${corner}-resize`;
    if (isMobile()) mobBeginTransform();

    function onMove(mv) {
      if (mv.cancelable) mv.preventDefault();
      const p  = ptOf(mv);
      const dx = (p.clientX - startX) * signX;
      const dy = (p.clientY - startY) * signY;
      const avg = (dx + dy) / 2;
      d.width  = Math.max(20, Math.min(maxW, startW + avg));
      d.height = Math.max(20, Math.min(maxH, startH + avg));
      el.style.width  = d.width  + 'px';
      el.style.height = d.height + 'px';
      constrainToZone(el);
    }

    function onUp() {
      document.body.style.cursor = '';
      if (isMobile()) mobEndTransform();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend',  onUp);
      pushHistory();
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend',  onUp);
  }

  function startRotate(e, el) {
    if (!el) return;
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    selectEl(el);

    const d = elData.get(el);
    if (!d) return;

    if (isMobile()) mobBeginTransform();

    const p0 = ptOf(e);
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const startPointerAngle = Math.atan2(p0.clientY - cy, p0.clientX - cx) * 180 / Math.PI;
    const startRotation = Number.isFinite(d.rotation) ? d.rotation : 0;

    function onMove(mv) {
      if (mv.cancelable) mv.preventDefault();
      const p = ptOf(mv);
      const currentAngle = Math.atan2(p.clientY - cy, p.clientX - cx) * 180 / Math.PI;
      d.rotation = startRotation + (currentAngle - startPointerAngle);
      applyElementTransform(el);
    }

    function onUp() {
      if (isMobile()) mobEndTransform();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
      pushHistory();
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
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
     POPULATE TEXT PANEL FROM ELEMENT DATA
  ───────────────────────────────────────────────── */
  function populatePanel(el) {
    const d = elData.get(el);
    if (!d) return;

    inputContent.value        = d.text;
    inputColor.value          = d.color;
    colorDot.style.background = d.color;
    inputSize.value           = Math.round(d.fontSize);

    const match = FONTS.find(f => f.value === d.fontFamily) || FONTS[0];
    fontLabel.textContent      = match.label;
    fontLabel.style.fontFamily = match.value;
    fontList.querySelectorAll('li').forEach(li => {
      li.classList.toggle('selected', li.dataset.font === d.fontFamily);
    });

    btnBold.classList.toggle('active',   d.fontWeight === '700' || d.fontWeight === 'bold');
    btnItalic.classList.toggle('active', d.fontStyle  === 'italic');

    document.querySelectorAll('.dr-align-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.align === d.textAlign);
    });

    bendValInput.value = d.bend;
    bendSlider.value   = d.bend;

    // Also sync mobile sheet
    mobPopulateSheet(el);
  }

  /* ─────────────────────────────────────────────────
     TEXT PANEL → LIVE UPDATES
  ───────────────────────────────────────────────── */

  function updateAndRender(key, value) {
    if (!selectedEl) return;
    const d = elData.get(selectedEl);
    if (!d) return;
    d[key] = value;
    renderContent(selectedEl);
    clampFontSize(selectedEl);
    constrainToZone(selectedEl);
    pushHistory();
  }

  inputContent.addEventListener('input', () => {
    if (!selectedEl) return;
    const d = elData.get(selectedEl);
    if (!d) return;
    d.text = inputContent.value;
    renderContent(selectedEl);
    clampFontSize(selectedEl);
    constrainToZone(selectedEl);
    pushHistoryDebounced(600);
  });

  inputColor.addEventListener('input', () => {
    colorDot.style.background = inputColor.value;
    if (!selectedEl) return;
    const d = elData.get(selectedEl);
    if (!d) return;
    d.color = inputColor.value;
    renderContent(selectedEl);
    constrainToZone(selectedEl);
    pushHistoryDebounced(400);
  });

  inputSize.addEventListener('change', () => {
    const v = Math.max(8, Math.min(200, parseInt(inputSize.value) || 48));
    inputSize.value = v;
    updateAndRender('fontSize', v);
  });

  btnSizeMinus.addEventListener('click', () => {
    if (!selectedEl) return;
    const d = elData.get(selectedEl);
    if (!d) return;
    d.fontSize = Math.max(8, d.fontSize - 4);
    inputSize.value = Math.round(d.fontSize);
    renderContent(selectedEl);
    constrainToZone(selectedEl);
    pushHistory();
  });

  btnSizePlus.addEventListener('click', () => {
    if (!selectedEl) return;
    const d = elData.get(selectedEl);
    if (!d) return;
    d.fontSize += 4;
    inputSize.value = Math.round(d.fontSize);
    renderContent(selectedEl);
    clampFontSize(selectedEl);
    constrainToZone(selectedEl);
    pushHistory();
  });

  btnBold.addEventListener('click', () => {
    if (!selectedEl) return;
    const d = elData.get(selectedEl);
    if (!d) return;
    const on = d.fontWeight === '700' || d.fontWeight === 'bold';
    d.fontWeight = on ? '400' : '700';
    btnBold.classList.toggle('active', !on);
    renderContent(selectedEl);
    clampFontSize(selectedEl);
    constrainToZone(selectedEl);
    pushHistory();
  });

  btnItalic.addEventListener('click', () => {
    if (!selectedEl) return;
    const d = elData.get(selectedEl);
    if (!d) return;
    const on = d.fontStyle === 'italic';
    d.fontStyle = on ? 'normal' : 'italic';
    btnItalic.classList.toggle('active', !on);
    renderContent(selectedEl);
    clampFontSize(selectedEl);
    constrainToZone(selectedEl);
    pushHistory();
  });

  document.querySelectorAll('.dr-align-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!selectedEl) return;
      const d = elData.get(selectedEl);
      if (!d) return;
      d.textAlign = btn.dataset.align;
      document.querySelectorAll('.dr-align-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderContent(selectedEl);
      pushHistory();
    });
  });

  /* ── Bend slider ── */
  function applyBend(val) {
    const v = Math.max(-100, Math.min(100, parseInt(val) || 0));
    bendSlider.value   = v;
    bendValInput.value = v;
    if (!selectedEl) return;
    const d = elData.get(selectedEl);
    if (!d) return;
    d.bend = v;
    renderContent(selectedEl);
    clampFontSize(selectedEl);
    constrainToZone(selectedEl);
    pushHistoryDebounced(400);
  }

  bendSlider.addEventListener('input',   () => applyBend(bendSlider.value));
  bendValInput.addEventListener('change',() => applyBend(bendValInput.value));

  /* ─────────────────────────────────────────────────
     FONT DROPDOWN
  ───────────────────────────────────────────────── */
  FONTS.forEach((f, i) => {
    const li = document.createElement('li');
    li.textContent       = f.label;
    li.style.fontFamily  = f.value;
    li.dataset.font      = f.value;
    li.dataset.label     = f.label;
    li.setAttribute('role', 'option');
    if (i === 0) li.classList.add('selected');
    li.addEventListener('click', e => {
      e.stopPropagation();
      fontList.querySelectorAll('li').forEach(l => l.classList.remove('selected'));
      li.classList.add('selected');
      fontLabel.textContent      = f.label;
      fontLabel.style.fontFamily = f.value;
      closeFontList();
      updateAndRender('fontFamily', f.value);
    });
    fontList.appendChild(li);
  });

  document.getElementById('font-row').addEventListener('click', e => {
    e.stopPropagation();
    fontList.classList.toggle('hidden');
  });

  function closeFontList() { fontList.classList.add('hidden'); }

  document.addEventListener('mousedown', e => {
    if (!document.getElementById('font-row').contains(e.target)) closeFontList();

    const productsTab = document.querySelector('.dr-tab[data-tab="products"]');
    if (
      productPicker &&
      !productPicker.classList.contains('hidden') &&
      !productPicker.contains(e.target) &&
      (!productsTab || !productsTab.contains(e.target))
    ) {
      hideProductPicker();
    }
  }, true);

  /* ─────────────────────────────────────────────────
     ACTIONS: delete / duplicate / z-order
  ───────────────────────────────────────────────── */
  function deleteEl(el) {
    if (!el) return;
    if (el === selectedEl) { selectedEl = null; hideTextPanel(); }
    el.remove();
    pushHistory();
  }

  function duplicateEl(el) {
    if (!el) return;
    const orig = elData.get(el);
    if (!orig) return;

    if (orig._type === 'image') {
      const clone = _createImgEl(Object.assign({}, orig, { left: orig.left + 18, top: orig.top + 18 }));
      printZone.appendChild(clone);
      constrainToZone(clone);
      selectEl(clone, 'image');
    } else {
      const clone = createTextEl(Object.assign({}, orig, { left: orig.left + 18, top: orig.top + 18 }));
      printZone.appendChild(clone);
      renderContent(clone);
      clampFontSize(clone);
      constrainToZone(clone);
      selectEl(clone);
    }
    pushHistory();
  }

  btnDelete.addEventListener('click',     () => deleteEl(selectedEl));
  btnDuplicate.addEventListener('click',  () => duplicateEl(selectedEl));

  btnBringFront.addEventListener('click', () => {
    if (!selectedEl) return;
    printZone.appendChild(selectedEl);
    pushHistory();
  });
  btnSendBack.addEventListener('click', () => {
    if (!selectedEl) return;
    printZone.insertBefore(selectedEl, printZone.firstChild);
    pushHistory();
  });

  /* ─────────────────────────────────────────────────
     UNDO / REDO BUTTONS
  ───────────────────────────────────────────────── */
  if (btnUndo) btnUndo.addEventListener('click', doUndo);
  if (btnRedo) btnRedo.addEventListener('click', doRedo);
  if (mobBtnUndo) mobBtnUndo.addEventListener('click', doUndo);
  if (mobBtnRedo) mobBtnRedo.addEventListener('click', doRedo);

  /* ─────────────────────────────────────────────────
     SIDEBAR TABS
  ───────────────────────────────────────────────── */
  document.querySelectorAll('.dr-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.dr-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (tab.dataset.tab === 'products') {
        toggleProductPicker();
        return;
      }
      hideProductPicker();
      if (tab.dataset.tab === 'text')   addText();
      if (tab.dataset.tab === 'upload') triggerUpload();
    });
  });

  const sidebarAddTextBtn = document.getElementById('dr-sidebar-add-text');
  const sidebarUploadBtn = document.getElementById('dr-sidebar-upload');
  if (sidebarAddTextBtn) {
    sidebarAddTextBtn.addEventListener('click', () => addText());
  }
  if (sidebarUploadBtn) {
    sidebarUploadBtn.addEventListener('click', () => triggerUpload());
  }

  /* ─────────────────────────────────────────────────
     UPLOAD IMAGE
  ───────────────────────────────────────────────── */
  const uploadInput = document.getElementById('upload-input');

  function triggerUpload() {
    if (uploadInput) uploadInput.click();
  }

  if (uploadInput) {
    uploadInput.addEventListener('change', () => {
      const file = uploadInput.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      uploadInput.value = ''; // reset so same file can be re-picked

      const reader = new FileReader();
      reader.onload = ev => {
        const src = ev.target.result;
        const maxSide = Math.min(printZone.clientWidth, printZone.clientHeight) * 0.7;
        const el = _createImgEl({ src, left: 8, top: 8, width: maxSide, height: maxSide });
        printZone.appendChild(el);
        constrainToZone(el);
        selectEl(el, 'image');
        pushHistory();
      };
      reader.readAsDataURL(file);
    });
  }

  /* ─────────────────────────────────────────────────
     COLOUR SWATCHES — with auto text-color on black
  ───────────────────────────────────────────────── */
  if (colorGrid) {
    colorGrid.addEventListener('click', e => {
      const sw = e.target.closest('.dr-swatch');
      if (!sw) return;
      const idx = parseInt(sw.dataset.index, 10);
      if (Number.isNaN(idx)) return;
      setActiveVariant(idx);
    });
  }

  /* ─────────────────────────────────────────────────
     VIEW BUTTONS
  ───────────────────────────────────────────────── */
  document.querySelectorAll('.dr-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = getActiveProduct();
      if (btn.dataset.view === 'back' && !product.views.includes('back')) return;

      saveCurrentZoneSnapshot();

      document.querySelectorAll('.dr-view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.dataset.view;
      setViewButtonsForProduct();
      updateImageAndThumbs();
      applyPrintZoneByProduct();
      loadZoneSnapshot(activeProductId, currentView);
      // After reposition, re-clamp all elements in case new zone is smaller
      printZone.querySelectorAll('.dr-text-el, .dr-img-el').forEach(el => {
        constrainToZone(el);
      });
      resetHistoryFromCurrentZone();
    });
  });

  /* ─────────────────────────────────────────────────
     KEYBOARD SHORTCUTS
  ───────────────────────────────────────────────── */
  document.addEventListener('keydown', e => {
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      // Allow Ctrl+Z / Ctrl+Y even in inputs
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); doUndo(); return; }
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) { e.preventDefault(); doRedo(); return; }
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); doUndo(); return; }
    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) { e.preventDefault(); doRedo(); return; }

    if (!selectedEl) return;

    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteEl(selectedEl); return; }
    if (e.key === 'Escape') { _deselect(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') { e.preventDefault(); duplicateEl(selectedEl); return; }

    const step = e.shiftKey ? 10 : 1;
    const d    = elData.get(selectedEl);
    if (!d) return;

    let moved = false;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); d.left -= step; moved = true; }
    if (e.key === 'ArrowRight') { e.preventDefault(); d.left += step; moved = true; }
    if (e.key === 'ArrowUp')    { e.preventDefault(); d.top  -= step; moved = true; }
    if (e.key === 'ArrowDown')  { e.preventDefault(); d.top  += step; moved = true; }

    if (moved) {
      selectedEl.style.left = d.left + 'px';
      selectedEl.style.top  = d.top  + 'px';
      constrainToZone(selectedEl);
      d.left = parseFloat(selectedEl.style.left);
      d.top  = parseFloat(selectedEl.style.top);
      pushHistoryDebounced(300);
    }
  });

  /* ─────────────────────────────────────────────────
     NAVBAR
  ───────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 10
        ? '0 2px 16px rgba(0,0,0,0.10)' : 'none';
    }, { passive: true });
  }

  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!open));
      hamburger.classList.toggle('open', !open);
      mobileMenu.classList.toggle('active', !open);
      mobileMenu.setAttribute('aria-hidden', String(open));
    });
  }

  let currentLang = 'en';
  function updateLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-en]').forEach(el => {
      el.innerHTML = lang === 'ge' ? (el.dataset.ge || el.dataset.en) : el.dataset.en;
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => updateLanguage(btn.dataset.lang));
  });

  /* ─────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────── */
  window.addEventListener('load', () => {
    renderDesktopProductPicker();
    renderMobileProductCards();
    applyProduct('shirt');

    if (isMobile()) {
      // Mobile starts with product selection first, without auto-opening text edit.
      syncMobileSwatches();
      setViewButtonsForProduct();
      mobOpenSheet('mob-product-sheet');
      resetHistoryFromCurrentZone();
      return;
    }

    // Desktop keeps the seeded starter text for quick editing.
    addText({ text: 'Your text here' });
    saveCurrentZoneSnapshot();
    zoneSnapshots[zoneKey('shirt', 'back')] = '[]';
    resetHistoryFromCurrentZone();
  });

  /* ═══════════════════════════════════════════════════════════
     MOBILE UI
     ═══════════════════════════════════════════════════════════ */

  function isMobile() { return window.innerWidth <= 768; }
  let mobIsTransforming = false;

  function mobBeginTransform() {
    if (!isMobile()) return;
    mobIsTransforming = true;
    document.body.classList.add('mob-transforming');
    mobCloseSheet('mob-edit-sheet');
  }

  function mobEndTransform() {
    if (!isMobile()) return;
    mobIsTransforming = false;
    document.body.classList.remove('mob-transforming');
  }

  /* ── Sheet management ── */
  const mobBackdrop = document.getElementById('mob-backdrop');

  function mobCloseAllSheets(exceptId) {
    document.querySelectorAll('.mob-sheet').forEach(s => {
      if (exceptId && s.id === exceptId) return;
      s.classList.remove('mob-sheet-open');
      s.setAttribute('aria-hidden', 'true');
    });
  }

  function mobOpenSheet(id) {
    const el = document.getElementById(id);
    if (!el) return;
    mobCloseAllSheets(id);
    el.classList.add('mob-sheet-open');
    el.setAttribute('aria-hidden', 'false');
  }

  function mobCloseSheet(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('mob-sheet-open');
    el.setAttribute('aria-hidden', 'true');
  }

  /* Backdrop tap closes all sheets */
  if (mobBackdrop) {
    mobBackdrop.addEventListener('click', () => {
      mobCloseAllSheets();
      _deselect();
    });
  }

  /* ── Canvas wrap zoom ── */
  const canvasWrap = document.getElementById('canvas-wrap');
  function mobZoomIn()  { if (canvasWrap) canvasWrap.classList.add('mob-zoomed'); }
  function mobZoomOut() { if (canvasWrap) canvasWrap.classList.remove('mob-zoomed'); }

  /* ── Edit sheet show/hide ── */
  function mobShowEditSheet(el) {
    if (mobIsTransforming || !el) return;
    mobZoomIn();
    mobOpenSheet('mob-edit-sheet');

    const editTitle = document.getElementById('mob-edit-title');
    const settingsRow = document.querySelector('#mob-edit-sheet .mob-settings-row');
    const textInputRow = document.getElementById('mob-text-input-row');
    const textInput = document.getElementById('mob-text-content');
    const fontList = document.getElementById('mob-font-list-wrap');
    const bendRow = document.getElementById('mob-bend-row');
    const imgControls = document.getElementById('mob-img-controls');
    const selectedData = elData.get(el);
    const isTextSelection = !!selectedData && selectedData._type === 'text';
    const isImageSelection = !!selectedData && selectedData._type === 'image';

    if (editTitle) editTitle.textContent = isImageSelection ? 'Image settings' : 'Text settings';
    if (settingsRow) settingsRow.classList.toggle('mob-hidden', !isTextSelection);
    if (imgControls) imgControls.classList.toggle('mob-hidden', !isImageSelection);

    if (fontList) fontList.classList.add('mob-hidden');
    if (bendRow) bendRow.classList.add('mob-hidden');
    if (textInputRow) textInputRow.classList.toggle('mob-hidden', !isTextSelection);

    if (textInput && isTextSelection) {
      textInput.value = selectedData.text || '';
      setTimeout(() => {
        textInput.focus();
        textInput.select();
      }, 20);
    }

    mobPopulateSheet(el);
  }
  function mobHideEditSheet() {
    mobZoomOut();
    mobCloseSheet('mob-edit-sheet');
    // Reset pill sub-rows
    document.getElementById('mob-text-input-row')  && document.getElementById('mob-text-input-row').classList.add('mob-hidden');
    document.getElementById('mob-font-list-wrap')  && document.getElementById('mob-font-list-wrap').classList.add('mob-hidden');
    document.getElementById('mob-bend-row')        && document.getElementById('mob-bend-row').classList.add('mob-hidden');
  }

  /* ── Populate mobile edit sheet from element data ── */
  function mobPopulateSheet(el) {
    if (!el) return;
    const d = elData.get(el);
    if (!d) return;

    if (d._type === 'image') {
      const opacitySlider = document.getElementById('mob-img-opacity');
      const opacityVal = document.getElementById('mob-img-opacity-val');
      const opacityPct = Math.round((d.opacity === undefined ? 1 : d.opacity) * 100);
      if (opacitySlider) opacitySlider.value = String(opacityPct);
      if (opacityVal) opacityVal.textContent = `${opacityPct}%`;

      const filterRow = document.getElementById('mob-filter-row');
      const fitRow = document.getElementById('mob-fit-row');
      if (filterRow) {
        filterRow.querySelectorAll('.mob-chip').forEach(btn => {
          const want = btn.dataset.filter === 'bw';
          btn.classList.toggle('active', !!d.grayscale === want);
        });
      }
      if (fitRow) {
        fitRow.querySelectorAll('.mob-chip').forEach(btn => {
          btn.classList.toggle('active', (d.fitMode || 'contain') === btn.dataset.fit);
        });
      }
      return;
    }

    const dotEl   = document.getElementById('mob-color-dot');
    const colInpt = document.getElementById('mob-color-input');
    const szVal   = document.getElementById('mob-sz-val');
    const fPrev   = document.getElementById('mob-font-preview');

    if (dotEl)   dotEl.style.background = d.color;
    if (colInpt) colInpt.value          = d.color;
    if (szVal)   szVal.textContent       = Math.round(d.fontSize);
    if (fPrev) {
      const match = FONTS.find(f => f.value === d.fontFamily) || FONTS[0];
      fPrev.style.fontFamily = match.value;
    }
    // Sync text content input if visible
    const mobTxtContent = document.getElementById('mob-text-content');
    if (mobTxtContent) mobTxtContent.value = d.text || '';
    // Sync bend slider
    const mobBSlider = document.getElementById('mob-bend-slider');
    const mobBDisp   = document.getElementById('mob-bend-val-display');
    if (mobBSlider) mobBSlider.value         = d.bend || 0;
    if (mobBDisp)   mobBDisp.textContent     = d.bend || 0;
    // Sync font list selected state
    const mobFontUl = document.getElementById('mob-font-ul');
    if (mobFontUl) {
      mobFontUl.querySelectorAll('li').forEach(li => {
        li.classList.toggle('mob-selected', li.dataset.font === d.fontFamily);
      });
    }
  }

  /* ── Bottom bar buttons ── */
  const mobBtnAdd     = document.getElementById('mob-btn-add');
  const mobSubTray    = document.getElementById('mob-sub-tray');
  const mobSubText    = document.getElementById('mob-sub-text');
  const mobSubUpload  = document.getElementById('mob-sub-upload');
  const mobBtnProduct = document.getElementById('mob-btn-product');
  const mobBtnSave    = document.getElementById('mob-btn-save');
  const mobBtnChoose  = document.getElementById('mob-btn-choose');

  // Add — toggle sub-tray
  if (mobBtnAdd && mobSubTray) {
    mobBtnAdd.addEventListener('click', () => {
      mobCloseSheet('mob-product-sheet');
      const open = !mobSubTray.classList.contains('mob-hidden');
      mobSubTray.classList.toggle('mob-hidden', open);
    });
  }

  // Sub-tray: Text
  if (mobSubText) {
    mobSubText.addEventListener('click', () => {
      mobSubTray && mobSubTray.classList.add('mob-hidden');
      addText({ text: 'TEXT' });
    });
  }

  // Sub-tray: Upload
  if (mobSubUpload) {
    mobSubUpload.addEventListener('click', () => {
      mobSubTray && mobSubTray.classList.add('mob-hidden');
      document.getElementById('upload-input') && document.getElementById('upload-input').click();
    });
  }

  // Product
  if (mobBtnProduct) {
    mobBtnProduct.addEventListener('click', () => {
      renderMobileProductCards();
      syncMobileSwatches();
      setViewButtonsForProduct();
      mobOpenSheet('mob-product-sheet');
    });
  }

  // Save (same as desktop Save button)
  if (mobBtnSave) {
    mobBtnSave.addEventListener('click', () => {
      // Placeholder – mirrors desktop Save button
      const h2 = document.createElement('div');
      h2.textContent = 'Design saved!';
      Object.assign(h2.style, {
        position:'fixed', top:'80px', left:'50%', transform:'translateX(-50%)',
        background:'#009688', color:'#fff', padding:'10px 22px', borderRadius:'8px',
        fontFamily:"'GelatoSans',sans-serif", fontSize:'0.9rem', fontWeight:'700',
        zIndex:'9999', pointerEvents:'none'
      });
      document.body.appendChild(h2);
      setTimeout(() => h2.remove(), 1800);
    });
  }

  // Choose size
  if (mobBtnChoose) {
    mobBtnChoose.addEventListener('click', () => {
      mobOpenSheet('mob-size-sheet');
    });
  }

  // Fullscreen button
  const mobFsBtn = document.getElementById('mob-fs-btn');
  if (mobFsBtn) {
    mobFsBtn.addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen && document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
      }
    });
  }

  /* ── Edit sheet buttons ── */
  const mobBtnDone   = document.getElementById('mob-btn-done');
  const mobActDup    = document.getElementById('mob-act-dup');
  const mobActDel    = document.getElementById('mob-act-del');
  const mobActBfront = document.getElementById('mob-act-bfront');
  const mobActBback  = document.getElementById('mob-act-bback');

  if (mobBtnDone)   mobBtnDone.addEventListener('click',   () => _deselect());
  if (mobActDup)    mobActDup.addEventListener('click',    () => selectedEl && duplicateEl(selectedEl));
  if (mobActDel)    mobActDel.addEventListener('click',    () => selectedEl && deleteEl(selectedEl));
  if (mobActBfront) mobActBfront.addEventListener('click', () => document.getElementById('btn-bring-front').click());
  if (mobActBback)  mobActBback.addEventListener('click',  () => document.getElementById('btn-send-back').click());

  /* ── Color pill ── */
  const mobColorInput = document.getElementById('mob-color-input');
  const mobColorDot   = document.getElementById('mob-color-dot');
  if (mobColorInput) {
    mobColorInput.addEventListener('input', () => {
      if (mobColorDot) mobColorDot.style.background = mobColorInput.value;
      // Sync desktop and trigger update
      const deskColor = document.getElementById('text-color');
      if (deskColor) {
        deskColor.value = mobColorInput.value;
        deskColor.dispatchEvent(new Event('input'));
      }
    });
  }

  const mobFilterRow = document.getElementById('mob-filter-row');
  const mobFitRow = document.getElementById('mob-fit-row');
  const mobImgOpacity = document.getElementById('mob-img-opacity');
  const mobImgOpacityVal = document.getElementById('mob-img-opacity-val');

  if (mobFilterRow) {
    mobFilterRow.addEventListener('click', e => {
      const btn = e.target.closest('.mob-chip[data-filter]');
      if (!btn || !selectedEl) return;
      const d = elData.get(selectedEl);
      if (!d || d._type !== 'image') return;
      d.grayscale = btn.dataset.filter === 'bw';
      renderImageContent(selectedEl);
      mobPopulateSheet(selectedEl);
      pushHistoryDebounced(250);
    });
  }

  if (mobFitRow) {
    mobFitRow.addEventListener('click', e => {
      const btn = e.target.closest('.mob-chip[data-fit]');
      if (!btn || !selectedEl) return;
      const d = elData.get(selectedEl);
      if (!d || d._type !== 'image') return;
      d.fitMode = btn.dataset.fit || 'contain';
      renderImageContent(selectedEl);
      mobPopulateSheet(selectedEl);
      pushHistoryDebounced(250);
    });
  }

  if (mobImgOpacity) {
    mobImgOpacity.addEventListener('input', () => {
      if (!selectedEl) return;
      const d = elData.get(selectedEl);
      if (!d || d._type !== 'image') return;
      const pct = Math.max(20, Math.min(100, parseInt(mobImgOpacity.value, 10) || 100));
      d.opacity = pct / 100;
      if (mobImgOpacityVal) mobImgOpacityVal.textContent = `${pct}%`;
      renderImageContent(selectedEl);
      pushHistoryDebounced(250);
    });
  }

  /* ── Size pill ── */
  const mobSzMinus = document.getElementById('mob-sz-minus');
  const mobSzPlus  = document.getElementById('mob-sz-plus');
  const mobSzVal   = document.getElementById('mob-sz-val');

  function mobUpdateSize(delta) {
    if (!selectedEl) return;
    const d = elData.get(selectedEl);
    if (!d) return;
    const newSz = Math.max(8, Math.min(200, Math.round(d.fontSize) + delta));
    d.fontSize = newSz;
    if (mobSzVal) mobSzVal.textContent = newSz;
    renderContent(selectedEl);
    clampFontSize(selectedEl);
    constrainToZone(selectedEl);
    if (inputSize) inputSize.value = newSz;
    pushHistoryDebounced(400);
  }
  if (mobSzMinus) mobSzMinus.addEventListener('click', e => { e.stopPropagation(); mobUpdateSize(-2); });
  if (mobSzPlus)  mobSzPlus.addEventListener('click',  e => { e.stopPropagation(); mobUpdateSize(+2); });

  /* ── Text pill — reveals input row ── */
  const mobTextPill      = document.getElementById('mob-text-pill');
  const mobColorPill     = document.getElementById('mob-color-pill');
  const mobSizePill      = document.getElementById('mob-size-pill');
  const mobTextInputRow  = document.getElementById('mob-text-input-row');
  const mobTextContent   = document.getElementById('mob-text-content');
  const mobTextClose     = document.getElementById('mob-text-close');

  function mobCloseTextSubPanels() {
    mobTextInputRow && mobTextInputRow.classList.add('mob-hidden');
    mobFontListWrap && mobFontListWrap.classList.add('mob-hidden');
    mobBendRow && mobBendRow.classList.add('mob-hidden');
  }

  if (mobTextPill && mobTextInputRow) {
    mobTextPill.addEventListener('click', () => {
      const willOpen = mobTextInputRow.classList.contains('mob-hidden');
      mobCloseTextSubPanels();
      if (willOpen) {
        mobTextInputRow.classList.remove('mob-hidden');
      }
      if (willOpen && mobTextContent) {
        mobTextContent.focus();
        mobTextContent.select();
      }
    });
  }
  if (mobColorPill) {
    mobColorPill.addEventListener('click', () => mobCloseTextSubPanels());
  }
  if (mobSizePill) {
    mobSizePill.addEventListener('click', () => mobCloseTextSubPanels());
  }
  if (mobTextClose && mobTextInputRow) {
    mobTextClose.addEventListener('click', () => mobTextInputRow.classList.add('mob-hidden'));
  }
  if (mobTextContent) {
    mobTextContent.addEventListener('input', () => {
      const deskContent = document.getElementById('text-content');
      if (deskContent) {
        deskContent.value = mobTextContent.value;
        deskContent.dispatchEvent(new Event('input'));
      }
    });
  }

  /* ── Font pill — reveals font list ── */
  const mobFontPill     = document.getElementById('mob-font-pill');
  const mobFontListWrap = document.getElementById('mob-font-list-wrap');
  const mobFontClose    = document.getElementById('mob-font-close');
  const mobFontUl       = document.getElementById('mob-font-ul');

  // Build mobile font list once
  if (mobFontUl) {
    FONTS.forEach(f => {
      const li = document.createElement('li');
      li.textContent       = f.label;
      li.style.fontFamily  = f.value;
      li.dataset.font      = f.value;
      li.addEventListener('click', () => {
        // Mark selected
        mobFontUl.querySelectorAll('li').forEach(x => x.classList.remove('mob-selected'));
        li.classList.add('mob-selected');
        // Update preview
        const fPrev = document.getElementById('mob-font-preview');
        if (fPrev) fPrev.style.fontFamily = f.value;
        // Sync desktop font list click
        const deskLi = fontList.querySelector(`li[data-font="${CSS.escape(f.value)}"]`);
        if (deskLi) deskLi.click();
        else {
          if (selectedEl) {
            const d = elData.get(selectedEl);
            if (d) { d.fontFamily = f.value; renderContent(selectedEl); clampFontSize(selectedEl); constrainToZone(selectedEl); pushHistory(); }
          }
        }
        mobFontListWrap && mobFontListWrap.classList.add('mob-hidden');
      });
      mobFontUl.appendChild(li);
    });
  }

  if (mobFontPill && mobFontListWrap) {
    mobFontPill.addEventListener('click', () => {
      const willOpen = mobFontListWrap.classList.contains('mob-hidden');
      mobCloseTextSubPanels();
      if (willOpen) mobFontListWrap.classList.remove('mob-hidden');
    });
  }
  if (mobFontClose && mobFontListWrap) {
    mobFontClose.addEventListener('click', () => mobFontListWrap.classList.add('mob-hidden'));
  }
  if (mobFontListWrap) {
    mobFontListWrap.addEventListener('click', e => {
      if (e.target === mobFontListWrap) {
        mobFontListWrap.classList.add('mob-hidden');
      }
    });
  }

  /* ── Bend pill — reveals bend slider ── */
  const mobBendPill    = document.getElementById('mob-bend-pill');
  const mobBendRow     = document.getElementById('mob-bend-row');
  const mobBendSlider  = document.getElementById('mob-bend-slider');
  const mobBendValDisp = document.getElementById('mob-bend-val-display');
  const mobBendClose   = document.getElementById('mob-bend-close');

  if (mobBendPill && mobBendRow) {
    mobBendPill.addEventListener('click', () => {
      const willOpen = mobBendRow.classList.contains('mob-hidden');
      mobCloseTextSubPanels();
      if (willOpen) mobBendRow.classList.remove('mob-hidden');
    });
  }
  if (mobBendClose && mobBendRow) {
    mobBendClose.addEventListener('click', () => mobBendRow.classList.add('mob-hidden'));
  }
  if (mobBendSlider) {
    mobBendSlider.addEventListener('input', () => {
      const val = parseInt(mobBendSlider.value);
      if (mobBendValDisp) mobBendValDisp.textContent = val;
      // Sync desktop bend slider and trigger update
      const deskBendSlider = document.getElementById('bend-slider');
      const deskBendVal    = document.getElementById('bend-val');
      if (deskBendSlider) { deskBendSlider.value = val; deskBendSlider.dispatchEvent(new Event('input')); }
      if (deskBendVal)    { deskBendVal.value = val; }
    });
  }

  /* ── Size sheet — build size rows ── */
  const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
  const PRICE_PER = 26.99;
  const sizeQtys  = {};
  SIZES.forEach(s => { sizeQtys[s] = 0; });

  function mobUpdateSizeTotal() {
    const total    = Object.values(sizeQtys).reduce((a, b) => a + b, 0);
    const totalPrc = Object.values(sizeQtys).reduce((a, b) => a + b, 0) * PRICE_PER;
    const disc     = total >= 6 ? 0.9 : 1;
    const infoEl   = document.getElementById('mob-size-info');
    const priceEl  = document.getElementById('mob-total-price');
    if (infoEl)  infoEl.textContent  = `${total} item${total !== 1 ? 's' : ''} selected`;
    if (priceEl) priceEl.textContent = `$${(totalPrc * disc).toFixed(2)}`;
  }

  const mobSizeGrid = document.getElementById('mob-size-grid');
  if (mobSizeGrid) {
    SIZES.forEach(size => {
      const row = document.createElement('div');
      row.className = 'mob-size-row';
      row.innerHTML = `
        <span class="mob-size-label">${size}</span>
        <div class="mob-size-qty">
          <button class="mob-qty-btn mob-qty-minus" data-size="${size}">−</button>
          <span class="mob-qty-val" id="mob-qty-${size}">0</span>
          <button class="mob-qty-btn mob-qty-plus" data-size="${size}">+</button>
        </div>`;
      mobSizeGrid.appendChild(row);
    });

    mobSizeGrid.addEventListener('click', e => {
      const btn  = e.target.closest('.mob-qty-btn');
      if (!btn) return;
      const size = btn.dataset.size;
      if (!size) return;
      const isMinus = btn.classList.contains('mob-qty-minus');
      sizeQtys[size] = Math.max(0, sizeQtys[size] + (isMinus ? -1 : 1));
      const valEl = document.getElementById(`mob-qty-${size}`);
      if (valEl) valEl.textContent = sizeQtys[size];
      mobUpdateSizeTotal();
    });
  }

  document.getElementById('mob-size-close') &&
    document.getElementById('mob-size-close').addEventListener('click', () => mobCloseSheet('mob-size-sheet'));

  document.getElementById('mob-add-cart') &&
    document.getElementById('mob-add-cart').addEventListener('click', () => {
      const total = Object.values(sizeQtys).reduce((a, b) => a + b, 0);
      if (total === 0) { alert('Please select at least one size.'); return; }
      alert(`🛒 Added ${total} item(s) to cart!\nWe'll contact you via WhatsApp to confirm your order.`);
      mobCloseSheet('mob-size-sheet');
    });

  /* ── Product sheet — view & color ── */
  const mobViewBtns = document.querySelectorAll('.mob-view-btn');
  mobViewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const product = getActiveProduct();
      if (btn.dataset.view === 'back' && !product.views.includes('back')) return;

      mobViewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Trigger desktop view button
      const deskBtn = document.querySelector(`.dr-view-btn[data-view="${btn.dataset.view}"]`);
      if (deskBtn) deskBtn.click();
    });
  });

  const mobSwatchRow = document.getElementById('mob-swatch-row');
  if (mobSwatchRow) {
    mobSwatchRow.addEventListener('click', e => {
      const sw = e.target.closest('.dr-swatch');
      if (!sw) return;
      const idx = parseInt(sw.dataset.index, 10);
      if (Number.isNaN(idx)) return;
      setActiveVariant(idx);
    });
  }

  document.getElementById('mob-product-close') &&
    document.getElementById('mob-product-close').addEventListener('click', () => mobCloseSheet('mob-product-sheet'));

  /* ── Deselect on canvas-wrap / zone touch ── */
  if (canvasWrap) {
    canvasWrap.addEventListener('touchstart', e => {
      if (e.target === canvasWrap ||
          e.target === document.getElementById('design-canvas') ||
          e.target === shirtImg) {
        _deselect();
      }
    }, { passive: true });
  }
  printZone.addEventListener('touchstart', e => {
    if (e.target === printZone) _deselect();
  }, { passive: true });

})();
