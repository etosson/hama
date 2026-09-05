document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Update Footer Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Sticky Header & Active Navigation Links on Scroll
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // Sticky class
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Match main section links (handle home differently)
            const href = link.getAttribute('href');
            if (href === '#' && currentSectionId === 'home') {
                link.classList.add('active');
            } else if (href === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // 3. Mobile Hamburger Menu Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const open = navToggle.classList.toggle('active');
            navMenu.classList.toggle('active', open);
            navToggle.setAttribute('aria-expanded', String(open));
        });

        // Close mobile menu when nav links are clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 4. Smooth Scroll & Dropdown Auto-select for Services / Catalog Items
    const serviceButtons = document.querySelectorAll('.select-service');
    const catalogButtons = document.querySelectorAll('.select-catalog-item');
    const serviceSelect = document.getElementById('service-select');

    function handleSelectionAndScroll(element, attributeName) {
        element.addEventListener('click', (e) => {
            const selectionVal = element.getAttribute(attributeName);
            if (serviceSelect && selectionVal) {
                serviceSelect.value = selectionVal;
            }
        });
    }

    serviceButtons.forEach(btn => handleSelectionAndScroll(btn, 'data-service'));
    catalogButtons.forEach(btn => handleSelectionAndScroll(btn, 'data-item'));


    // 5. Catalog Filter System
    const filterButtons = document.querySelectorAll('.filter-btn');
    const catalogItems = document.querySelectorAll('.catalog-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            catalogItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                // Show/hide logic with visual fading
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'flex';
                    // Trigger reflow to run CSS transitions
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });


    // 6. Statistics Counter Animation
    const statsSection = document.getElementById('about');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function startCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds animation
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let current = 0;

            const timer = setInterval(() => {
                current += Math.ceil(target / (duration / stepTime));
                if (current >= target) {
                    stat.textContent = target + (target === 5 ? '+' : target === 150 ? '+' : '+');
                    clearInterval(timer);
                } else {
                    stat.textContent = current;
                }
            }, stepTime);
        });
    }

    // Observer for statistics section
    if ('IntersectionObserver' in window && statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    startCounters();
                    countersStarted = true;
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    } else {
        // Fallback for older browsers
        setTimeout(startCounters, 1000);
    }


    // 7. Testimonials Slider Carousel
    const slider = document.getElementById('testimonials-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.getElementById('testimonials-dots');
    
    if (slider && slides.length > 0) {
        let currentSlide = 0;
        const slideCount = slides.length;
        let slideTimer;

        // Generate Dots
        slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(idx);
                resetSlideTimer();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function goToSlide(n) {
            currentSlide = (n + slideCount) % slideCount;
            // Shift translation based on direction (since RTL, translate + instead of -)
            slider.style.transform = `translateX(${currentSlide * 100}%)`;
            
            // Update dots
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentSlide]) {
                dots[currentSlide].classList.add('active');
            }
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function startSlideTimer() {
            slideTimer = setInterval(nextSlide, 5000); // Change testimonial every 5 seconds
        }

        function resetSlideTimer() {
            clearInterval(slideTimer);
            startSlideTimer();
        }

        // Initialize Carousel
        startSlideTimer();
    }


    // 8. FAQ Accordion Interactivity
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other active items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                    }
                });

                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });


    // 9. Intersection Observer for Scroll Animations
    const animatedElements = document.querySelectorAll('.scroll-animation');

    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        animatedElements.forEach(elem => {
            animationObserver.observe(elem);
        });
    } else {
        // Fallback
        animatedElements.forEach(elem => elem.classList.add('active'));
    }


    // 10. Contact Form Submission Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple visual response
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            submitBtn.textContent = 'جاري إرسال طلبك...';
            submitBtn.disabled = true;

            // Mock network latency
            setTimeout(() => {
                // Show success notice
                const successDiv = document.createElement('div');
                successDiv.style.backgroundColor = '#d4edda';
                successDiv.style.color = '#155724';
                successDiv.style.padding = '15px';
                successDiv.style.borderRadius = '8px';
                successDiv.style.marginTop = '20px';
                successDiv.style.border = '1px solid #c3e6cb';
                successDiv.style.fontWeight = '500';
                successDiv.style.textAlign = 'center';
                successDiv.textContent = 'شكرًا لك! تم إرسال طلبك بنجاح. سيتواصل معك فريق شركة حاما قريبًا.';

                contactForm.appendChild(successDiv);
                
                // Reset fields
                contactForm.reset();

                // Restore button
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;

                // Remove success notice after 5 seconds
                setTimeout(() => {
                    successDiv.remove();
                }, 5000);
            }, 1500);
        });
    }
});


/* =========================================================
   11. Activities Carousel (hero)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const viewport = document.getElementById('hc-viewport');
    if (!viewport) return;

    const carousel = viewport.closest('.hero-carousel');
    const slides = Array.from(viewport.querySelectorAll('.hc-slide'));
    const dotsBox = document.getElementById('hc-dots');
    const prevBtn = document.getElementById('hc-prev');
    const nextBtn = document.getElementById('hc-next');
    if (slides.length < 2) return;

    const DURATION = 7000;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    carousel.style.setProperty('--hc-duration', DURATION + 'ms');

    let index = 0;
    let elapsed = 0;
    let lastFrame = 0;
    let hovering = false;
    let onScreen = true;

    // Build the progress dots from the slides themselves.
    const dots = slides.map((slide, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'hc-dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', slide.getAttribute('aria-label') || 'شريحة ' + (i + 1));
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => goTo(i));
        dotsBox.appendChild(dot);
        return dot;
    });

    function goTo(next) {
        index = (next + slides.length) % slides.length;
        elapsed = 0;
        slides.forEach((slide, i) => {
            slide.classList.toggle('is-active', i === index);
            slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === index);
            dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
        });
    }

    const isPaused = () => hovering || !onScreen || document.hidden || reducedMotion;

    function frame(timestamp) {
        if (!lastFrame) lastFrame = timestamp;
        const delta = timestamp - lastFrame;
        lastFrame = timestamp;

        const paused = isPaused();
        document.body.classList.toggle('hc-paused', paused);

        if (!paused) {
            elapsed += delta;
            if (elapsed >= DURATION) goTo(index + 1);
        }
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1));

    // Hovering or focusing the carousel holds the current slide.
    ['mouseenter', 'focusin'].forEach(evt =>
        carousel.addEventListener(evt, () => { hovering = true; }));
    ['mouseleave', 'focusout'].forEach(evt =>
        carousel.addEventListener(evt, () => { hovering = false; }));

    // Do not burn cycles while the carousel is scrolled out of sight.
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(entries => {
            onScreen = entries[0].isIntersecting;
        }, { threshold: 0.15 }).observe(carousel);
    }

    // Keyboard: in RTL the right arrow walks backwards through the deck.
    carousel.setAttribute('tabindex', '-1');
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { goTo(index + 1); }
        else if (e.key === 'ArrowRight') { goTo(index - 1); }
    });

    // Touch swipe.
    let touchStartX = 0;
    let touchStartY = 0;
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
        hovering = true;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        hovering = false;
        if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
            goTo(dx < 0 ? index + 1 : index - 1);
        }
    }, { passive: true });

    goTo(0);
});


/* =========================================================
   12. Brand ticker retracts once the visitor starts reading
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const onScroll = () => {
        document.body.classList.toggle('ticker-hidden', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
});


/* =========================================================
   13. Install as an app (desktop + home screen)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const installBtn = document.getElementById('install-cta');
    let deferredPrompt = null;

    // Hold the prompt until the visitor is past the hero, so the pill never
    // lands on top of the carousel controls or its call-to-action buttons.
    const revealWhenScrolled = () => {
        if (!deferredPrompt || !installBtn) return;
        const past = window.scrollY > (window.innerHeight * 0.75);
        installBtn.hidden = !past;
        installBtn.classList.toggle('is-visible', past);
    };

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        revealWhenScrolled();
    });

    window.addEventListener('scroll', revealWhenScrolled, { passive: true });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            deferredPrompt = null;
            installBtn.classList.remove('is-visible');
            installBtn.hidden = true;
        });
    }

    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        if (installBtn) {
            installBtn.classList.remove('is-visible');
            installBtn.hidden = true;
        }
    });

    // The service worker is what makes the site installable and offline-capable.
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').catch(() => { /* non-fatal */ });
        });
    }
});
