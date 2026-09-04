

        (function() {
            'use strict';

            // Scroll Progress Bar
            const scrollProgress = document.getElementById('scrollProgress');
            window.addEventListener('scroll', () => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                scrollProgress.style.width = scrollPercent + '%';
            });

            // Mobile Navigation Toggle
            const navToggle = document.getElementById('navToggle');
            const mainNav = document.getElementById('mainNav');
            navToggle.addEventListener('click', () => {
                mainNav.classList.toggle('open');
                navToggle.classList.toggle('active');
                const expanded = mainNav.classList.contains('open');
                navToggle.setAttribute('aria-expanded', expanded);
            });

            // Close mobile nav on link click
            mainNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mainNav.classList.remove('open');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                });
            });

            // Active nav link on scroll
            const sections = document.querySelectorAll('section[id]');
            const navLinks = mainNav.querySelectorAll('a');
            function updateActiveLink() {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 100;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                        current = section.getAttribute('id');
                    }
                });
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + current) {
                        link.classList.add('active');
                    }
                });
            }
            window.addEventListener('scroll', updateActiveLink);
            updateActiveLink();

            // Back to Top Button
            const backToTop = document.getElementById('backToTop');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            });
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // Scroll Reveal (IntersectionObserver)
            const revealElements = document.querySelectorAll('.reveal');
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
            revealElements.forEach(el => revealObserver.observe(el));

            // Animated Counters
            const statNumbers = document.querySelectorAll('.stat-number');
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const target = parseInt(el.getAttribute('data-target'));
                        let current = 0;
                        const increment = target / 60;
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                el.textContent = target.toLocaleString();
                                clearInterval(timer);
                            } else {
                                el.textContent = Math.floor(current).toLocaleString();
                            }
                        }, 20);
                        counterObserver.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });
            statNumbers.forEach(el => counterObserver.observe(el));

            // Admissions Form Validation
            const form = document.getElementById('applyForm');
            const formSuccess = document.getElementById('formSuccess');

            function validateField(input) {
                const group = input.closest('.form-group');
                const errorEl = group.querySelector('.form-error');
                let isValid = true;

                group.classList.remove('error');

                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                }

                if (input.type === 'email' && input.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(input.value.trim())) {
                        isValid = false;
                    }
                }

                if (input.type === 'tel' && input.value.trim()) {
                    const phonePattern = /^[\d\s\-+()]{7,20}$/;
                    if (!phonePattern.test(input.value.trim())) {
                        isValid = false;
                    }
                }

                if (!isValid) {
                    group.classList.add('error');
                }
                return isValid;
            }

            form.querySelectorAll('input, select, textarea').forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('focus', () => input.closest('.form-group').classList.remove('error'));
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                let allValid = true;
                const required = form.querySelectorAll('[required]');
                required.forEach(field => {
                    if (!validateField(field)) allValid = false;
                });
                const phone = document.getElementById('phone');
                if (phone.value.trim() && !validateField(phone)) allValid = false;

                if (allValid) {
                    formSuccess.style.display = 'block';
                    form.reset();
                    setTimeout(() => formSuccess.style.display = 'none', 5000);
                } else {
                    const firstError = form.querySelector('.form-group.error');
                    if (firstError) firstError.querySelector('input, select, textarea').focus();
                }
            });
        })();
