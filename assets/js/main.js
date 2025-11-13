/* Neo Lux Portfolio Interactions */
(function () {
    const body = document.body;
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)');
    const THEME_STORAGE_KEY = 'neoLuxTheme';

    function syncThemeToggles() {
        const isLight = body.getAttribute('data-theme') === 'light';
        document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
            btn.setAttribute('aria-pressed', String(isLight));
        });
    }

    function setTheme(theme) {
        if (theme === 'light') {
            body.setAttribute('data-theme', 'light');
        } else {
            body.removeAttribute('data-theme');
        }
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        syncThemeToggles();
    }

    function initTheme() {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored) {
            setTheme(stored);
        } else if (prefersLight.matches) {
            setTheme('light');
        } else {
            syncThemeToggles();
        }

        prefersLight.addEventListener('change', (event) => {
            if (!localStorage.getItem(THEME_STORAGE_KEY)) {
                setTheme(event.matches ? 'light' : 'dark');
            }
        });

        document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const nextTheme = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
                setTheme(nextTheme);
            });
        });
    }

    function initNav() {
        const nav = document.querySelector('header');
        if (!nav) return;

        let lastScroll = window.pageYOffset;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > lastScroll && currentScroll > 120) {
                nav.classList.add('nav-hidden');
            } else {
                nav.classList.remove('nav-hidden');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    function initLightbox() {
        const lightbox = document.querySelector('.lightbox');
        if (!lightbox) return;

        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('[data-lightbox-close]');

        document.querySelectorAll('[data-lightbox-target]').forEach((item) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const src = item.getAttribute('data-lightbox-target');
                const alt = item.getAttribute('data-lightbox-alt') || '';
                lightboxImg.src = src;
                lightboxImg.alt = alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            lightboxImg.src = '';
            document.body.style.overflow = '';
        }

        closeBtn?.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    function initSlider() {
        document.querySelectorAll('[data-slider]').forEach((slider) => {
            const track = slider.querySelector('[data-slider-track]');
            const slides = Array.from(track.children);
            const prevBtn = slider.querySelector('[data-slider-prev]');
            const nextBtn = slider.querySelector('[data-slider-next]');
            let index = 0;

            function setSlide(newIndex) {
                index = (newIndex + slides.length) % slides.length;
                track.style.transform = `translateX(-${index * 100}%)`;
            }

            prevBtn?.addEventListener('click', () => setSlide(index - 1));
            nextBtn?.addEventListener('click', () => setSlide(index + 1));

            slider.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowLeft') setSlide(index - 1);
                if (event.key === 'ArrowRight') setSlide(index + 1);
            });
        });
    }

    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('[data-animate]').forEach((target) => {
            observer.observe(target);
        });
    }

    function validateField(field) {
        const container = field.closest('.input-field') || field.closest('.remember-line');
        if (!container) return true;
        const error = container.querySelector('.error');
        if (!error) return true;

        let isValid = true;

        if (field.type === 'checkbox') {
            if (field.hasAttribute('required') && !field.checked) {
                isValid = false;
                error.textContent = 'Please confirm this option.';
            }
        } else if (field.type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(field.value.trim())) {
                isValid = false;
                error.textContent = 'Enter a valid email address.';
            }
        } else if (field.name === 'confirmPassword') {
            const password = field.form?.querySelector('[name="password"]');
            if (password && field.value !== password.value) {
                isValid = false;
                error.textContent = 'Passwords do not match.';
            }
        } else if (field instanceof HTMLSelectElement) {
            if (field.hasAttribute('required') && !field.value) {
                isValid = false;
                error.textContent = 'Select an option to continue.';
            }
        } else if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            error.textContent = 'This field is required.';
        }

        if (isValid) {
            error.textContent = '';
        }

        container.classList.toggle('invalid', !isValid);
        return isValid;
    }

    function initForms() {
        document.querySelectorAll('form[data-validate="true"]').forEach((form) => {
            const successMessage = form.querySelector('.auth-success');
            const submitBtn = form.querySelector('[type="submit"]');

            form.addEventListener('input', (event) => {
                const target = event.target;
                if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
                    validateField(target);
                }
            });

            form.addEventListener('submit', (event) => {
                event.preventDefault();
                let allValid = true;
                form.querySelectorAll('input, textarea, select').forEach((field) => {
                    if (!validateField(field)) {
                        allValid = false;
                    }
                });

                if (!allValid) {
                    const firstInvalid = form.querySelector('.input-field.invalid input, .input-field.invalid textarea, .input-field.invalid select, .remember-line.invalid input');
                    firstInvalid?.focus();
                    return;
                }

                if (submitBtn) {
                    submitBtn.classList.add('pulse');
                    submitBtn.setAttribute('aria-busy', 'true');
                }

                setTimeout(() => {
                    submitBtn?.classList.remove('pulse');
                    submitBtn?.removeAttribute('aria-busy');
                    if (successMessage) {
                        successMessage.classList.add('active');
                        setTimeout(() => successMessage.classList.remove('active'), 3000);
                    }
                    form.reset();
                    form.querySelectorAll('.input-field.invalid, .remember-line.invalid').forEach((node) => {
                        node.classList.remove('invalid');
                    });
                }, 650);
            });
        });
    }

    function initShimmerOnFocus() {
        const selectors = '.input-field input:not([type="checkbox"]):not([type="radio"]), .input-field textarea, .input-field select';
        document.querySelectorAll(selectors).forEach((input) => {
            input.addEventListener('focus', () => {
                const parent = input.closest('.input-field');
                parent?.classList.add('shimmer');
            });
            input.addEventListener('blur', () => {
                const parent = input.closest('.input-field');
                parent?.classList.remove('shimmer');
            });
        });
    }

    window.addEventListener('DOMContentLoaded', () => {
        initTheme();
        initNav();
        initLightbox();
        initSlider();
        initScrollAnimations();
        initForms();
        initShimmerOnFocus();
    });
})();
