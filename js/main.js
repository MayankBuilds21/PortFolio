/* ================================================================
   MAIN.JS — Application Orchestrator
   Midnight Tech Portfolio | Mayank
   ================================================================ */

(function () {
  'use strict';

  // ────────────────────────────────────────────────────────
  //  DOM REFERENCES
  // ────────────────────────────────────────────────────────

  var loader         = document.getElementById('loader');
  var loaderProgress = document.getElementById('loaderProgress');
  var hamburger      = document.getElementById('hamburger');
  var mobileMenu     = document.getElementById('mobileMenu');
  var navbar         = document.getElementById('navbar');
  var navLinks       = document.querySelectorAll('.nav-link');
  var mobileLinks    = document.querySelectorAll('.mobile-link');
  var contactForm    = document.getElementById('contactForm');

  // ────────────────────────────────────────────────────────
  //  PAGE LOADER
  // ────────────────────────────────────────────────────────

  function initLoader() {
    if (!loader || !loaderProgress) {
      document.body.style.overflow = '';
      return Promise.resolve();
    }

    document.body.style.overflow = 'hidden';

    return new Promise(function (resolve) {
      var progress = 0;
      var steps = [
        { target: 30,  duration: 300 },
        { target: 60,  duration: 250 },
        { target: 80,  duration: 400 },
        { target: 95,  duration: 200 },
        { target: 100, duration: 150 },
      ];
      var stepIndex = 0;

      function nextStep() {
        if (stepIndex >= steps.length) {
          setTimeout(function () {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
            document.body.classList.add('loaded');

            setTimeout(function () {
              if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
              }
              resolve();
            }, 600);
          }, 200);
          return;
        }

        var step = steps[stepIndex];
        stepIndex++;
        animateProgress(progress, step.target, step.duration, function () {
          progress = step.target;
          nextStep();
        });
      }

      nextStep();
    });
  }

  function animateProgress(from, to, duration, callback) {
    var startTime = performance.now();

    function update(currentTime) {
      var elapsed = currentTime - startTime;
      var ratio = Math.min(elapsed / duration, 1);
      var eased = 1 - (1 - ratio) * (1 - ratio);
      var current = from + (to - from) * eased;

      if (loaderProgress) {
        loaderProgress.style.width = current + '%';
      }

      if (ratio < 1) {
        requestAnimationFrame(update);
      } else {
        if (callback) callback();
      }
    }

    requestAnimationFrame(update);
  }

  // ────────────────────────────────────────────────────────
  //  MOBILE MENU
  // ────────────────────────────────────────────────────────

  function initMobileMenu() {
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('open');
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () { closeMenu(); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
      }
    });

    mobileMenu.addEventListener('click', function (e) {
      if (e.target === mobileMenu) { closeMenu(); }
    });
  }

  function openMenu() {
    hamburger.classList.add('active');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (typeof gsap !== 'undefined') {
      gsap.from(mobileLinks, {
        opacity: 0, y: 30, duration: 0.4,
        stagger: 0.08, ease: 'power3.out', clearProps: 'all',
      });
    }
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ────────────────────────────────────────────────────────
  //  SMOOTH SCROLL
  // ────────────────────────────────────────────────────────

  function initSmoothScroll() {
    var allAnchors = document.querySelectorAll('a[href^="#"]');

    allAnchors.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (!href || href === '#') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        if (mobileMenu && mobileMenu.classList.contains('open')) {
          closeMenu();
        }

        var navHeight = navbar ? navbar.offsetHeight : 72;
        var targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({ top: targetPos, behavior: 'smooth' });

        navLinks.forEach(function (navLink) { navLink.classList.remove('active'); });
        var matching = document.querySelector('.nav-link[href="' + href + '"]');
        if (matching) matching.classList.add('active');
      });
    });
  }

  // ────────────────────────────────────────────────────────
  //  CONTACT FORM
  // ────────────────────────────────────────────────────────

  function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalHTML = submitBtn.innerHTML;

      var name    = contactForm.querySelector('#name').value.trim();
      var email   = contactForm.querySelector('#email').value.trim();
      var message = contactForm.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        shakeButton(submitBtn);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        shakeButton(submitBtn);
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
      submitBtn.style.opacity = '0.7';

      setTimeout(function () {
        submitBtn.innerHTML = '✓ Message Sent!';
        submitBtn.style.opacity = '1';
        submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #06b6d4)';
        contactForm.reset();

        setTimeout(function () {
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 3000);
      }, 1500);
    });
  }

  function shakeButton(btn) {
    if (typeof gsap !== 'undefined') {
      gsap.to(btn, { x: [-8, 8, -6, 6, -3, 3, 0], duration: 0.5, ease: 'power2.out' });
    }
  }

  // ────────────────────────────────────────────────────────
  //  LOGO CLICK
  // ─��──────────────────────────────────────────────────────

  function initLogoClick() {
    var logo = document.querySelector('.nav-logo');
    if (!logo) return;

    logo.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      var home = document.querySelector('.nav-link[href="#home"]');
      if (home) home.classList.add('active');
    });
  }

  // ────────────────────────────────────────────────────────
  //  ACCESSIBILITY
  // ────────────────────────────────────────────────────────

  function initAccessibility() {
    document.addEventListener('mousedown', function () {
      document.body.classList.add('using-mouse');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        document.body.classList.remove('using-mouse');
      }
    });

    var style = document.createElement('style');
    style.textContent =
      'body.using-mouse *:focus { outline: none !important; }' +
      '*:focus-visible { outline: 2px solid var(--purple-400) !important; outline-offset: 3px; }';
    document.head.appendChild(style);
  }

  // ────────────────────────────────────────────────────────
  //  CONSOLE EASTER EGG
  // ────────────────────────────────────────────────────────

  function consoleEasterEgg() {
    console.log(
      '%c⚡ Midnight Tech Portfolio',
      'color:#7c3aed;font-size:14px;font-weight:bold;font-family:monospace;padding:8px'
    );
    console.log(
      '%cBuilt by Mayank — HTML, CSS, JS, Three.js',
      'color:#06b6d4;font-size:12px;font-family:sans-serif;padding:4px'
    );
  }

  // ────────────────────────────────────────────────────────
  //  BOOT
  // ────────────────────────────────────────────────────────

  function boot() {
    consoleEasterEgg();
    initAccessibility();

    initLoader().then(function () {
      initMobileMenu();
      initSmoothScroll();
      initLogoClick();
      initContactForm();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();