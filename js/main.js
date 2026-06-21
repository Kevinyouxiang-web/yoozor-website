/* ========================================
   Yoozor Trading — Main Script
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Nav scroll ---
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));

  // --- Mobile menu ---
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => links.classList.toggle('open'));
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  // --- Scroll reveal ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // --- Animated counters ---
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;
      let current = 0;
      const inc = Math.ceil(target / 60);
      const t = setInterval(() => {
        current += inc;
        if (current >= target) { current = target; clearInterval(t); }
        el.textContent = current.toLocaleString();
      }, 25);
      this.unobserve(el);
    });
  }, { threshold: 0.5 }).observe(document.querySelectorAll('.count-up'));

  // --- Smooth scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // --- Current year ---
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Inquiry Form ---
  const form = document.getElementById('inquiryForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = {
        name: form.querySelector('#name')?.value || '',
        company: form.querySelector('#company')?.value || '',
        email: form.querySelector('#email')?.value || '',
        phone: form.querySelector('#phone')?.value || '',
        product: form.querySelector('#product')?.value || '',
        message: form.querySelector('#message')?.value || ''
      };

      const mailto = 'evin.ho@yoozor.com';
      const subject = encodeURIComponent(`Inquiry from ${fields.name} — yoozor.com`);
      const body = encodeURIComponent(
        `Name: ${fields.name}\n` +
        `Company: ${fields.company}\n` +
        `Email: ${fields.email}\n` +
        `Phone: ${fields.phone}\n` +
        `Product Interest: ${fields.product}\n\n` +
        `Message:\n${fields.message}`
      );

      // Try mailto as primary method
      window.location.href = `mailto:${mailto}?subject=${subject}&body=${body}`;

      // Show success
      form.style.display = 'none';
      const success = document.getElementById('formSuccess');
      if (success) {
        success.classList.add('show');
        success.querySelector('p').textContent =
          'Your inquiry form has been opened in your email client. Just click send!';
      }
    });
  }

  // --- PDF Catalog Print ---
  const printBtn = document.getElementById('printCatalog');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

});


// --- Cookie Consent Banner ---
function getCookieConsent() {
  return localStorage.getItem('yoozor_cookie_consent');
}

window.acceptCookies = function() {
  localStorage.setItem('yoozor_cookie_consent', 'accepted');
  document.getElementById('cookieBanner').classList.remove('show');
  // Enable Google Analytics
  if (typeof gtag === 'function') {
    gtag('consent', 'update', { 'analytics_storage': 'granted' });
  }
};

window.rejectCookies = function() {
  localStorage.setItem('yoozor_cookie_consent', 'rejected');
  document.getElementById('cookieBanner').classList.remove('show');
  // Disable Google Analytics
  if (typeof gtag === 'function') {
    gtag('consent', 'update', { 'analytics_storage': 'denied' });
  }
};

// Show banner if no decision made yet
document.addEventListener('DOMContentLoaded', function() {
  const consent = getCookieConsent();
  if (!consent) {
    setTimeout(() => {
      const banner = document.getElementById('cookieBanner');
      if (banner) banner.classList.add('show');
    }, 500);
  }
});
