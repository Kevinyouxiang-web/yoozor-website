/* ========================================
   Yoozor.com — Main JavaScript (2026)
   Premium interactions & scroll animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Navigation: transparent → solid on scroll ---
  const nav = document.querySelector('nav');
  let lastScroll = 0;

  const updateNav = () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // Initial state

  // --- Mobile menu toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      menuToggle.classList.toggle('open');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
      });
    });
  }

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve to allow re-animation if needed
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Count-up animation for stats ---
  const countElements = document.querySelectorAll('.count-up');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target) || 0;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const startValue = 0;

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(startValue + (target - startValue) * eased);
          el.textContent = current.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = target.toLocaleString();
          }
        };

        requestAnimationFrame(animate);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  countElements.forEach(el => countObserver.observe(el));

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(i => i.classList.remove('open'));
        // Toggle current
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookieBanner');
  if (cookieBanner) {
    if (!localStorage.getItem('cookiesAccepted') && !localStorage.getItem('cookiesRejected')) {
      setTimeout(() => cookieBanner.classList.add('show'), 500);
    }

    window.acceptCookies = function() {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.classList.remove('show');
      // Enable analytics
      if (typeof gtag === 'function') {
        gtag('consent', 'update', { 'analytics_storage': 'granted' });
      }
    };

    window.rejectCookies = function() {
      localStorage.setItem('cookiesRejected', 'true');
      cookieBanner.classList.remove('show');
      if (typeof gtag === 'function') {
        gtag('consent', 'update', { 'analytics_storage': 'denied' });
      }
    };
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Update current year in footer ---
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  // --- Product card hover parallax effect ---
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const img = this.querySelector('.product-img-wrapper img');
      if (img) {
        img.style.transform = 'scale(1.08)';
      }
    });
    card.addEventListener('mouseleave', function() {
      const img = this.querySelector('.product-img-wrapper img');
      if (img) {
        img.style.transform = 'scale(1)';
      }
    });
  });

  console.log('✨ Yoozor.com — Premium experience loaded');
});
