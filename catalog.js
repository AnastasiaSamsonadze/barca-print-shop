(function () {
    'use strict';

    var currentLang = 'en';
    var activeFilter = 'all';

    function t(obj) {
        if (!obj) return '';
        return obj[currentLang] || obj.en || '';
    }

    function formatPrice(price) {
        return '€' + price;
    }

    function productMatchesFilter(product, filter) {
        if (filter === 'all') return true;
        var filters = product.catalogFilters || [];
        return filters.indexOf(filter) !== -1;
    }

    function updateLanguage(lang) {
        currentLang = lang;
        document.querySelectorAll('[data-en]').forEach(function (el) {
            var val = el.dataset[lang] || el.dataset.en;
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = val;
            } else {
                el.innerHTML = val;
            }
        });
        document.documentElement.lang = lang === 'ge' ? 'ka' : 'en';
        renderFilterLabels();
        updatePromoCopy();
    }

    function renderFilterLabels() {
        var filters = window.BPS_CATALOG_FILTERS || [];
        document.querySelectorAll('.catalog-filter-btn').forEach(function (btn) {
            var id = btn.dataset.filter;
            var def = filters.find(function (f) { return f.id === id; });
            if (def) btn.textContent = t(def.label);
        });
    }

    function updatePromoCopy() {
        document.querySelectorAll('.catalog-card--promo').forEach(function (card) {
            var headline = card.querySelector('.catalog-promo-headline');
            var subline = card.querySelector('.catalog-promo-subline');
            if (headline && headline.dataset.en) headline.textContent = t({ en: headline.dataset.en, ge: headline.dataset.ge });
            if (subline && subline.dataset.en) subline.textContent = t({ en: subline.dataset.en, ge: subline.dataset.ge });
        });
    }

    function getCatalogImage(product) {
        return product.catalogImage || product.image;
    }

    function getSortedProductIds() {
        var products = window.BPS_PRODUCTS || {};
        return Object.keys(products).sort(function (a, b) {
            var orderA = products[a].catalogOrder != null ? products[a].catalogOrder : 999;
            var orderB = products[b].catalogOrder != null ? products[b].catalogOrder : 999;
            if (orderA !== orderB) return orderA - orderB;
            return products[a].name.localeCompare(products[b].name);
        });
    }

    function lockGridStage() {
        var stage = document.getElementById('catalog-grid-stage');
        if (!stage) return;
        stage.style.minHeight = stage.offsetHeight + 'px';
    }

    function releaseGridStage() {
        var stage = document.getElementById('catalog-grid-stage');
        if (!stage) return;
        requestAnimationFrame(function () {
            stage.style.minHeight = stage.offsetHeight + 'px';
            setTimeout(function () {
                stage.style.minHeight = '';
            }, 580);
        });
    }

    function buildCard(id, product) {
        var isPromo = product.catalogPromo;
        var isFeatured = product.catalogFeatured;
        var card = document.createElement('a');
        card.href = 'product.html?id=' + encodeURIComponent(id);
        card.className = 'catalog-card';
        card.dataset.productId = id;
        card.dataset.filters = (product.catalogFilters || []).join(',');

        if (isFeatured) card.classList.add('catalog-card--featured');
        if (isPromo) card.classList.add('catalog-card--promo');

        var media = document.createElement('div');
        media.className = 'catalog-card-media';
        if (product.catalogImageFit === 'contain') {
            media.classList.add('catalog-card-media--contain');
        }
        if (isPromo && product.catalogPromo.bg) {
            media.style.backgroundColor = product.catalogPromo.bg;
        }

        var img = document.createElement('img');
        img.src = getCatalogImage(product);
        img.alt = product.name;
        img.loading = 'lazy';
        media.appendChild(img);

        if (isPromo) {
            var copy = document.createElement('div');
            copy.className = 'catalog-promo-copy';
            var h = document.createElement('p');
            h.className = 'catalog-promo-headline';
            h.dataset.en = product.catalogPromo.headline.en;
            h.dataset.ge = product.catalogPromo.headline.ge;
            h.textContent = t(product.catalogPromo.headline);
            var s = document.createElement('p');
            s.className = 'catalog-promo-subline';
            s.dataset.en = product.catalogPromo.subline.en;
            s.dataset.ge = product.catalogPromo.subline.ge;
            s.textContent = t(product.catalogPromo.subline);
            copy.appendChild(h);
            copy.appendChild(s);
            media.appendChild(copy);
        }

        var quickAdd = document.createElement('button');
        quickAdd.type = 'button';
        quickAdd.className = 'catalog-quick-add';
        quickAdd.setAttribute('aria-label', 'Quick add');
        quickAdd.textContent = '+';
        quickAdd.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = card.href;
        });
        media.appendChild(quickAdd);

        var title = document.createElement('p');
        title.className = 'catalog-card-title';
        title.textContent = product.name;

        var price = document.createElement('p');
        price.className = 'catalog-card-price';
        price.textContent = formatPrice(product.price);

        card.appendChild(media);
        card.appendChild(title);
        card.appendChild(price);

        return card;
    }

    function renderGrid() {
        var grid = document.getElementById('catalog-grid');
        if (!grid) return;

        var products = window.BPS_PRODUCTS || {};
        grid.innerHTML = '';

        getSortedProductIds().forEach(function (id) {
            if (products[id]) grid.appendChild(buildCard(id, products[id]));
        });
    }

    function updateZeroState(visibleCount) {
        var zero = document.getElementById('catalog-zero');
        var stage = document.getElementById('catalog-grid-stage');
        if (!zero || !stage) return;

        var empty = visibleCount === 0;
        zero.classList.toggle('is-visible', empty);
        stage.style.display = empty ? 'none' : '';
    }

    function applyFilter(filter, animate) {
        activeFilter = filter;
        var grid = document.getElementById('catalog-grid');
        if (!grid) return;

        var cards = Array.from(grid.querySelectorAll('.catalog-card'));

        document.querySelectorAll('.catalog-filter-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        if (typeof Flip === 'undefined' || !animate) {
            var visible = 0;
            cards.forEach(function (card) {
                var id = card.dataset.productId;
                var product = window.BPS_PRODUCTS[id];
                var show = product && productMatchesFilter(product, filter);
                card.classList.toggle('is-hidden', !show);
                if (show) visible++;
            });
            updateZeroState(visible);
            releaseGridStage();
            return;
        }

        lockGridStage();
        var state = Flip.getState(cards);
        var visible = 0;

        cards.forEach(function (card) {
            var id = card.dataset.productId;
            var product = window.BPS_PRODUCTS[id];
            var show = product && productMatchesFilter(product, filter);
            card.classList.toggle('is-hidden', !show);
            if (show) visible++;
        });

        Flip.from(state, {
            duration: 0.55,
            scale: true,
            ease: 'power2.inOut',
            stagger: 0.04,
            absolute: true,
            onEnter: function (elements) {
                return gsap.fromTo(elements,
                    { opacity: 0, scale: 0.88 },
                    { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
                );
            },
            onLeave: function (elements) {
                return gsap.to(elements,
                    { opacity: 0, scale: 0.88, duration: 0.35, ease: 'power2.in' }
                );
            },
            onComplete: function () {
                releaseGridStage();
            }
        });

        updateZeroState(visible);
    }

    function initFilters() {
        var wrap = document.querySelector('.catalog-filters-wrap');
        var filtersEl = document.getElementById('catalog-filters');
        if (!filtersEl) return;

        var filters = window.BPS_CATALOG_FILTERS || [];
        filtersEl.innerHTML = '';

        filters.forEach(function (f, index) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'catalog-filter-btn' + (index === 0 ? ' active' : '');
            btn.dataset.filter = f.id;
            btn.textContent = t(f.label);
            btn.addEventListener('click', function () {
                if (activeFilter === f.id) return;
                applyFilter(f.id, true);
            });
            filtersEl.appendChild(btn);
        });

        if (wrap) {
            var observer = new IntersectionObserver(function (entries) {
                wrap.classList.toggle('is-stuck', !entries[0].isIntersecting);
            }, { threshold: 1, rootMargin: '-80px 0px 0px 0px' });
            var sentinel = document.getElementById('catalog-filter-sentinel');
            if (sentinel) observer.observe(sentinel);
        }
    }

    function initLanguage() {
        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.lang-btn').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                updateLanguage(btn.dataset.lang);
            });
        });
    }

    function initMobileMenu() {
        var hamburger = document.querySelector('.hamburger');
        var mobileMenu = document.querySelector('.mobile-menu');
        if (!hamburger || !mobileMenu) return;

        hamburger.addEventListener('click', function () {
            var open = mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('active', open);
            hamburger.setAttribute('aria-expanded', open);
            mobileMenu.setAttribute('aria-hidden', !open);
        });

        document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
            });
        });
    }

    function initNavbarScroll() {
        window.addEventListener('scroll', function () {
            var navbar = document.getElementById('navbar');
            if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
        });
    }

    function initUrlFilter() {
        var params = new URLSearchParams(window.location.search);
        var cat = params.get('category');
        if (cat && document.querySelector('[data-filter="' + cat + '"]')) {
            activeFilter = cat;
            document.querySelectorAll('.catalog-filter-btn').forEach(function (btn) {
                btn.classList.toggle('active', btn.dataset.filter === cat);
            });
            applyFilter(cat, false);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (typeof gsap !== 'undefined' && typeof Flip !== 'undefined') {
            gsap.registerPlugin(Flip);
        }
        renderGrid();
        initFilters();
        initLanguage();
        initMobileMenu();
        initNavbarScroll();
        initUrlFilter();

        if (!window.location.search.includes('category=')) {
            applyFilter('all', false);
        }
    });
})();
