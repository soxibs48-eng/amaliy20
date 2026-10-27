/**
 * Coursely - Interactive Script
 * Masterclass Landing Page
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navigation on Scroll
    const header = document.querySelector('.header');
    const backToTopBtn = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 2. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        // Close on link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('open');
            });
        });
    }

    // 3. Curriculum Accordion
    const curriculumItems = document.querySelectorAll('.curriculum-wrap .accordion-item');
    curriculumItems.forEach((item, index) => {
        const headerBtn = item.querySelector('.accordion-header');
        const body = item.querySelector('.accordion-body');

        // Open first item by default
        if (index === 0) {
            item.classList.add('active');
            body.style.maxHeight = body.scrollHeight + 'px';
        }

        headerBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            curriculumItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherBody = otherItem.querySelector('.accordion-body');
                if (otherBody) otherBody.style.maxHeight = null;
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });

    // 4. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-wrap .faq-item');
    faqItems.forEach((item, index) => {
        const headerBtn = item.querySelector('.faq-header');
        const body = item.querySelector('.faq-body');

        if (index === 0) {
            item.classList.add('active');
            body.style.maxHeight = body.scrollHeight + 'px';
        }

        headerBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherBody = otherItem.querySelector('.faq-body');
                if (otherBody) otherBody.style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });

    // 5. Stat Counter Animation on Scroll
    const statItems = document.querySelectorAll('.stat-number');
    let animated = false;

    const runStatCounter = () => {
        statItems.forEach(stat => {
            const target = stat.getAttribute('data-target');
            if (!target) return;

            const isPlus = target.includes('+');
            const isK = target.includes('k');
            const num = parseInt(target.replace(/[^0-9]/g, ''), 10);
            
            let current = 0;
            const duration = 1500;
            const increment = num / (duration / 25);

            const timer = setInterval(() => {
                current += increment;
                if (current >= num) {
                    current = num;
                    clearInterval(timer);
                    stat.innerText = current + (isPlus ? '+' : '') + (isK ? 'k' : (stat.getAttribute('data-suffix') || ''));
                } else {
                    stat.innerText = Math.floor(current) + (isPlus ? '+' : '') + (isK ? 'k' : '');
                }
            }, 25);
        });
    };

    const statsBanner = document.querySelector('.stats-banner');
    if (statsBanner) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    runStatCounter();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsBanner);
    }

    // 6. Modals (Enrollment & Video Trailer)
    const enrollModal = document.getElementById('enrollModal');
    const trailerModal = document.getElementById('trailerModal');
    const enrollTriggers = document.querySelectorAll('[data-open-modal="enroll"]');
    const trailerTriggers = document.querySelectorAll('[data-open-modal="trailer"]');
    const closeButtons = document.querySelectorAll('.modal-close-btn, .modal-overlay');

    const openModal = (modal, tier = null) => {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (tier && modal.querySelector('#planTierSelect')) {
            modal.querySelector('#planTierSelect').value = tier;
        }
    };

    const closeModal = () => {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('active');
            // If trailer iframe exists, pause it
            const iframe = modal.querySelector('iframe');
            if (iframe) {
                const src = iframe.src;
                iframe.src = src;
            }
        });
        document.body.style.overflow = '';
    };

    enrollTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tier = btn.getAttribute('data-tier') || 'self-paced';
            openModal(enrollModal, tier);
        });
    });

    trailerTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(trailerModal);
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target === btn || btn.classList.contains('modal-close-btn')) {
                closeModal();
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // 7. Toast Notifications
    const showToast = (message) => {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `<span class="toast-icon">✓</span> <span class="toast-msg"></span>`;
            document.body.appendChild(toast);
        }

        toast.querySelector('.toast-msg').innerText = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    };

    // 8. Form Submissions
    const enrollForm = document.getElementById('enrollForm');
    if (enrollForm) {
        enrollForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = enrollForm.querySelector('input[name="fullname"]').value;
            closeModal();
            enrollForm.reset();
            showToast(`Thank you, ${name}! Your enrollment request has been confirmed.`);
        });
    }

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            newsletterForm.reset();
            showToast(`Awesome! ${email} has been subscribed to podcasting tips.`);
        });
    }
});
