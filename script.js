/**
 * SiteCraft - Landing Page JavaScript
 * Handles interactivity, animations, and dynamic content.
 */

(function() {
    'use strict';

    // ---------- DOM References ----------
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const scrollTop = document.querySelector('.scroll-top');
    const statsNumbers = document.querySelectorAll('.stat-number');
    const hero = document.querySelector('.hero');

    // ---------- Navbar Scroll Effect ----------
    function handleNavScroll() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ---------- Mobile Menu Toggle ----------
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // ---------- Scroll-to-Top Button ----------
    function handleScrollTop() {
        if (window.scrollY > 500) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    }

    scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', handleScrollTop, { passive: true });

    // ---------- Animated Counter ----------
    function animateCounter(el) {
        const target = parseFloat(el.dataset.target);
        const duration = 2000;
        const start = window.scrollY;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing: easeOutExpo
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            const current = ease * target;
            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString();
            }
        }

        function observerCallback(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const observer = new IntersectionObserver((entries, obs) => {
                        entries.forEach(e => {
                            if (e.isIntersecting) {
                                animateCounter(e.target);
                                obs.unobserve(e.target);
                            }
                        });
                    }, { threshold: 0.5 });

                    observer.observe(entry.target);
                }
            });
        }

        observerCallback([{ isIntersecting: true, target: el }]);
    }

    // Observe all stat numbers
    statsNumbers.forEach(el => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(el);
    });

    // ---------- Preview Card Tab Switching ----------
    const tabs = document.querySelectorAll('.preview-tab');
    const tabBodies = document.querySelector('.preview-card-body');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Animate body content (for demo purposes, we just show an alert or nothing)
            const tabName = tab.textContent;
            // In a real app, you'd swap content here
        });
    });

    // ---------- Smooth Scroll for Anchor Links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------- Navbar Background on Scroll ----------
    // (already handled by handleNavScroll above)

    // ---------- Intersection Observer for Reveal Animations ----------
    const revealElements = document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card, .cta-section, .preview-card');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // ---------- Billing Toggle (Monthly / Yearly) ----------
    const billingSwitch = document.querySelector('.billing-switch');
    const billingOptions = document.querySelectorAll('.billing-option');
    const priceAmounts = document.querySelectorAll('.pricing-card-price .amount[data-monthly]');

    function setBillingPeriod(period) {
        if (!billingSwitch) return;

        billingSwitch.classList.toggle('yearly', period === 'yearly');
        billingSwitch.setAttribute('aria-pressed', String(period === 'yearly'));

        billingOptions.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.period === period);
        });

        priceAmounts.forEach(el => {
            const value = el.dataset[period];
            if (value === undefined) return;

            el.classList.add('price-changing');
            setTimeout(() => {
                el.textContent = value;
                el.classList.remove('price-changing');
            }, 150);
        });
    }

    if (billingSwitch) {
        billingSwitch.addEventListener('click', () => {
            const isYearly = billingSwitch.classList.contains('yearly');
            setBillingPeriod(isYearly ? 'monthly' : 'yearly');
        });
    }

    billingOptions.forEach(opt => {
        opt.addEventListener('click', () => setBillingPeriod(opt.dataset.period));
    });

    // ---------- Init ----------
    console.log('SiteCraft loaded successfully!');

})();