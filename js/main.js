/* ========================================
   Yoozor Trading — Main Script
   Scroll animations, mobile nav, counters, form
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Nav scroll effect ---
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // --- Mobile menu toggle ---
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => links.classList.toggle('open'));
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });

  // --- Scroll reveal ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // --- Animated counters ---
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;
      let current = 0;
      const increment = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current.toLocaleString();
      }, 25);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.count-up').forEach(el => counterObserver.observe(el));

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

  // --- Inquiry Form Handler ---
  const form = document.getElementById('inquiryForm');
  if (form) {
    // Replace with your actual Formspree endpoint
    const formspreeId = form.getAttribute('action').replace('https://formspree.io/f/', '');
    if (formspreeId && formspreeId !== 'your-form-id') {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;

        try {
          const data = new FormData(form);
          const response = await fetch(form.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
          });
          if (response.ok) {
            form.style.display = 'none';
            document.getElementById('formSuccess').classList.add('show');
          } else {
            alert('Something went wrong. Please email us directly at evin.ho@yoozor.com');
          }
        } catch (err) {
          alert('Network error. Please email us directly at evin.ho@yoozor.com');
        }
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
    } else {
      // No valid Formspree ID — show a friendly message on submit
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const mailto = 'evin.ho@yoozor.com';
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const company = document.getElementById('company').value;
        const product = document.getElementById('product').value;
        const message = document.getElementById('message').value;
        const subject = encodeURIComponent(`Inquiry from ${name} — Yoozor.com`);
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nProduct Interest: ${product}\n\nMessage:\n${message}`
        );
        // Open email client as fallback
        window.open(`mailto:${mailto}?subject=${subject}&body=${body}`);
        form.style.display = 'none';
        document.getElementById('formSuccess').classList.add('show');
        document.getElementById('formSuccess').querySelector('p').textContent =
          'Your inquiry has been prepared. Please send the email from your mail client.';
      });
    }
  }

});
