/* =============================================
   Yoozor Trading — Main Application
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  // --- Cookie Consent ---
  const cookieBanner = document.getElementById('cookieBanner');
  if (!localStorage.getItem('cookie-consent') && cookieBanner) {
    cookieBanner.classList.add('show');
  }
  window.acceptCookies = function () {
    localStorage.setItem('cookie-consent', 'accepted');
    cookieBanner.classList.remove('show');
  };
  window.rejectCookies = function () {
    localStorage.setItem('cookie-consent', 'rejected');
    cookieBanner.classList.remove('show');
  };

  // --- Mobile Menu Toggle ---
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    // Close menu on link click (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  // --- Scroll Reveal (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // --- Nav scroll effect ---
  const nav = document.querySelector('nav');
  let lastScroll = 0;
  if (nav) {
    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 100) {
        nav.style.boxShadow = '0 1px 4px rgba(26,26,46,0.06)';
        if (currentScroll > lastScroll && currentScroll > 200) {
          nav.style.transform = 'translateY(-100%)';
        } else {
          nav.style.transform = 'translateY(0)';
        }
      } else {
        nav.style.boxShadow = 'none';
        nav.style.transform = 'translateY(0)';
      }
      lastScroll = currentScroll;
    });
  }

  // --- Number counters (stats section) ---
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 1500;
      const start = performance.now();
      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(step);
    }

    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // --- Year in footer ---
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- Contact forms: open a pre-filled email instead of pretending to send ---
  document.querySelectorAll('form[action="#"]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const values = {};
      form.querySelectorAll('input, select, textarea').forEach(function (field) {
        if (!field.name || field.disabled) return;
        if ((field.type === 'checkbox' || field.type === 'radio') && !field.checked) return;
        values[field.name] = field.value.trim();
      });

      const fieldLabels = {
        name: 'Name',
        company: 'Company',
        email: 'Email',
        phone: 'Phone',
        product: 'Product interest',
        market: 'Target market',
        quantity: 'Estimated quantity',
        subject: 'Subject',
        message: 'Message'
      };
      const isChinese = document.documentElement.lang === 'zh-CN';

      const lines = Object.keys(values)
        .filter(function (key) { return values[key]; })
        .map(function (key) {
          return (fieldLabels[key] || key) + ': ' + values[key];
        });

      const subject = (isChinese ? 'Yoozor 询盘 - ' : 'Yoozor inquiry from ') + (values.name || values.email || 'yoozor.com');
      const body = [
        isChinese ? '来自 yoozor.com 的新询盘' : 'New inquiry from yoozor.com',
        '------------------------------',
        lines.join('\n'),
        '------------------------------',
        (isChinese ? '提交页面：' : 'Submitted from: ') + window.location.href
      ].join('\n');

      const mailtoUrl = 'mailto:evin.ho@yoozor.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      const feedback = form.querySelector('.form-feedback');
      if (feedback) {
        feedback.textContent = isChinese
          ? '系统将打开您的邮箱，请在邮件中点击发送以完成询盘。'
          : 'Your email app should open now. Press Send there to complete the inquiry.';
        feedback.classList.add('visible');
      }

      window.location.href = mailtoUrl;
    });
  });

});
