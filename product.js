(function () {
    'use strict';

    const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
    let currentLang = 'en';

    function getProductId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    function t(obj) {
        if (!obj) return '';
        return obj[currentLang] || obj.en || '';
    }

    function formatPrice(price) {
        return '€' + price;
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
        renderProduct();
    }

    function initLanguage() {
        var langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                langBtns.forEach(function (b) { b.classList.remove('active'); });
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

    function initAccordion() {
        var items = document.querySelectorAll('.product-accordion-item');
        items.forEach(function (item) {
            var trigger = item.querySelector('.product-accordion-trigger');
            var panel = item.querySelector('.product-accordion-panel');
            if (!trigger || !panel) return;

            trigger.addEventListener('click', function () {
                var isOpen = item.classList.contains('is-open');

                items.forEach(function (other) {
                    other.classList.remove('is-open');
                    var otherPanel = other.querySelector('.product-accordion-panel');
                    if (otherPanel) {
                        otherPanel.classList.remove('is-open');
                        otherPanel.style.height = '0';
                    }
                });

                if (!isOpen) {
                    item.classList.add('is-open');
                    panel.classList.add('is-open');
                    panel.style.height = panel.scrollHeight + 'px';
                }
            });
        });
    }

    function initSizeSelector(sizes) {
        var row = document.getElementById('product-size-row');
        var block = document.getElementById('product-size-block');
        if (!row || !block) return;

        row.innerHTML = '';
        sizes.forEach(function (size, index) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'product-size-btn' + (index === 1 ? ' active' : '');
            btn.textContent = size;
            btn.dataset.size = size;
            btn.addEventListener('click', function () {
                row.querySelectorAll('.product-size-btn').forEach(function (b) {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
            });
            row.appendChild(btn);
        });
    }

    function showNotFound() {
        document.getElementById('product-layout').hidden = true;
        document.getElementById('product-not-found').hidden = false;
        document.title = 'Product Not Found | Barcaprintshop';
    }

    function renderProduct() {
        var id = getProductId();
        var catalog = window.BPS_PRODUCTS || {};
        var product = id ? catalog[id] : null;

        if (!product) {
            showNotFound();
            return;
        }

        document.getElementById('product-not-found').hidden = true;
        document.getElementById('product-layout').hidden = false;

        document.title = product.name + ' | Barcaprintshop';

        var img = document.getElementById('dynamic-product-image');
        img.src = product.image;
        img.alt = product.name;

        document.getElementById('dynamic-product-title').textContent = product.name;
        document.getElementById('dynamic-product-price').textContent = formatPrice(product.price);
        document.getElementById('dynamic-product-description').textContent = t(product.description);

        document.getElementById('breadcrumb-category').textContent = t(product.category);
        document.getElementById('breadcrumb-name').textContent = product.name;

        document.getElementById('dynamic-spec-material').textContent = t(product.material);
        document.getElementById('dynamic-spec-shipping').textContent = t(product.shipping);

        var sizeBlock = document.getElementById('product-size-block');
        var designerWrap = document.getElementById('product-designer-wrap');

        if (product.hasSizes) {
            sizeBlock.hidden = false;
            initSizeSelector(product.sizes || DEFAULT_SIZES);
        } else {
            sizeBlock.hidden = true;
        }

        if (product.designerLink && designerWrap) {
            designerWrap.hidden = false;
            designerWrap.querySelector('a').href = product.designerLink;
        } else if (designerWrap) {
            designerWrap.hidden = true;
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        initLanguage();
        initMobileMenu();
        initNavbarScroll();
        initAccordion();
        renderProduct();
    });
})();
