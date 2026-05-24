/**
 * Post-hero scroll reveals & micro-interactions — index.html only
 */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    /* Clear stuck inline styles from prior immediateRender bug */
    gsap.set(
        '.carousel-card, .carousel-header > *, .homepage-2nd-teaser video, ' +
        '.homepage-2nd-teaser__text-wrapper, .cta-section h2, .cta-section p, ' +
        '.cta-section .btn, .grev-heading, .grev-track, .trust-item, ' +
        '.about-left, .about-right, .faq-aside > *',
        { opacity: 1, x: 0, y: 0, scale: 1, clearProps: 'transform,opacity' }
    );

    var ease = 'power3.out';
    var snap = 'power2.out';

    function once(trigger, start) {
        return {
            trigger: trigger,
            start: start || 'top 82%',
            once: true,
            toggleActions: 'play none none none'
        };
    }

    /** Scroll-triggered from() — never hide elements before the trigger fires */
    function revealFrom(targets, fromVars, scrollTrigger) {
        if (!targets || (targets.length !== undefined && !targets.length)) return;
        gsap.from(targets, Object.assign({}, fromVars, {
            immediateRender: false,
            scrollTrigger: scrollTrigger
        }));
    }

    function refreshAfterLayout() {
        ScrollTrigger.refresh();
    }

    /* ── 1. Carousel sections ───────────────────────────────────── */
    document.querySelectorAll('.carousel-section').forEach(function (section) {
        var header = section.querySelector('.carousel-header');
        var cards = section.querySelectorAll('.carousel-card');
        var staggerCards = section.id === 'new-arrivals' ? 0.15 : 0.09;

        if (header) {
            revealFrom(header.children, {
                y: 22,
                opacity: 0,
                duration: 0.7,
                ease: ease,
                stagger: 0.08
            }, once(section, 'top 84%'));
        }

        if (cards.length) {
            revealFrom(cards, {
                y: 18,
                opacity: 0,
                duration: 0.65,
                ease: ease,
                stagger: staggerCards
            }, once(section, 'top 80%'));
        }
    });

    var newArrivals = document.getElementById('new-arrivals');
    if (newArrivals) newArrivals.classList.add('carousel-section--focus');

    /* ── 2. Crea tu estilo — video teaser (no parallax on video) ─ */
    var teaser = document.querySelector('.homepage-2nd-teaser__video-teaser');
    if (teaser) {
        var videos = teaser.querySelectorAll('video');
        gsap.set(videos, { yPercent: 0, clearProps: 'transform' });

        var textWrap = teaser.querySelector('.homepage-2nd-teaser__text-wrapper');
        if (textWrap) {
            revealFrom(textWrap, {
                scale: 0.95,
                y: 24,
                opacity: 0,
                duration: 0.85,
                ease: ease
            }, once(teaser, 'top 78%'));
        }
    }

    /* ── 3. Editorial banner — parallax + line mask ─────────────── */
    var editorial = document.querySelector('.editorial-banner');
    var editorialMedia = document.querySelector('.editorial-banner-media');

    if (editorialMedia) {
        gsap.to(editorialMedia, {
            yPercent: -8,
            ease: 'none',
            scrollTrigger: {
                trigger: editorial,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.55
            }
        });
    }

    function wrapEditorialHeadline() {
        var headline = document.querySelector('.editorial-headline');
        if (!headline) return null;

        var parts = headline.innerHTML.split(/<br\s*\/?>/gi).map(function (s) {
            return s.trim();
        }).filter(Boolean);

        headline.innerHTML = parts.map(function (part) {
            return '<span class="editorial-line-mask"><span class="editorial-line">' + part + '</span></span>';
        }).join('');

        return headline.querySelectorAll('.editorial-line');
    }

    function animateEditorialLines(lines, play) {
        if (!lines || !lines.length) return;
        if (play) {
            gsap.fromTo(lines,
                { yPercent: 100 },
                {
                    yPercent: 0,
                    duration: 0.85,
                    ease: ease,
                    stagger: 0.12,
                    immediateRender: false,
                    scrollTrigger: once(editorial, 'top 72%')
                }
            );
        } else {
            gsap.set(lines, { yPercent: 0, clearProps: 'transform' });
        }
    }

    var editorialLines = wrapEditorialHeadline();
    animateEditorialLines(editorialLines, true);

    if (editorial) {
        revealFrom('.editorial-sub, .btn-editorial', {
            y: 16,
            opacity: 0,
            duration: 0.7,
            ease: ease,
            stagger: 0.1,
            delay: 0.2
        }, once(editorial, 'top 70%'));
    }

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            requestAnimationFrame(function () {
                var lines = wrapEditorialHeadline();
                animateEditorialLines(lines, false);
            });
        });
    });

    /* ── 4. Trust badges cascade ────────────────────────────────── */
    var trustItems = document.querySelectorAll('.trust-item');
    if (trustItems.length) {
        revealFrom(trustItems, {
            x: -18,
            opacity: 0,
            duration: 0.55,
            ease: snap,
            stagger: 0.1
        }, once('.trust-section', 'top 88%'));
    }

    /* ── 5. Google reviews ──────────────────────────────────────── */
    var grevSection = document.querySelector('.grev-section');
    if (grevSection) {
        var heading = grevSection.querySelector('.grev-heading');
        if (heading) {
            revealFrom(heading, {
                y: 20,
                opacity: 0,
                duration: 0.7,
                ease: ease
            }, once(grevSection, 'top 85%'));
        }

        var track = grevSection.querySelector('.grev-track');
        if (track) {
            revealFrom(track, {
                x: 30,
                opacity: 0,
                duration: 0.8,
                ease: ease
            }, once(grevSection, 'top 82%'));
        }
    }

    /* ── 6. About — split counter-movement ──────────────────────── */
    var about = document.querySelector('.about-section');
    if (about) {
        var aboutLeft = about.querySelector('.about-left');
        var aboutRight = about.querySelector('.about-right');

        if (aboutLeft) {
            revealFrom(aboutLeft, {
                y: -20,
                opacity: 0,
                duration: 0.75,
                ease: ease
            }, once(about, 'top 80%'));
        }
        if (aboutRight) {
            revealFrom(aboutRight, {
                y: 30,
                opacity: 0,
                duration: 0.75,
                ease: ease
            }, once(about, 'top 80%'));
        }
    }

    /* ── 7. FAQ — line revealers + aside ────────────────────────── */
    var faqSection = document.querySelector('.faq-section');
    if (faqSection) {
        var faqAside = faqSection.querySelector('.faq-aside');
        if (faqAside) {
            revealFrom(faqAside.children, {
                y: 16,
                opacity: 0,
                duration: 0.65,
                ease: ease,
                stagger: 0.08
            }, once(faqSection, 'top 85%'));
        }

        faqSection.querySelectorAll('.faq-item').forEach(function (item, i) {
            var line = item.querySelector('.faq-reveal-line');
            if (!line) {
                line = document.createElement('span');
                line.className = 'faq-reveal-line';
                line.setAttribute('aria-hidden', 'true');
                item.insertBefore(line, item.firstChild);
            }

            gsap.fromTo(line,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 0.65,
                    ease: snap,
                    delay: i * 0.06,
                    immediateRender: false,
                    scrollTrigger: once(item, 'top 92%')
                }
            );
        });
    }

    /* ── CTA + footer (subtle) ──────────────────────────────────── */
    var cta = document.querySelector('.cta-section');
    if (cta) {
        revealFrom(cta.querySelectorAll('h2, p, .btn'), {
            y: 18,
            opacity: 0,
            duration: 0.65,
            ease: ease,
            stagger: 0.1
        }, once(cta, 'top 88%'));
    }

    var footer = document.querySelector('.footer');
    if (footer) {
        revealFrom(footer.querySelectorAll('.footer-section'), {
            y: 14,
            opacity: 0,
            duration: 0.55,
            ease: ease,
            stagger: 0.08
        }, once(footer, 'top 95%'));
    }

    refreshAfterLayout();
    /* Recalculate after loading screen — avoids stuck hidden elements */
    setTimeout(refreshAfterLayout, 1600);
    window.addEventListener('load', refreshAfterLayout);
});
