/* ================================================================
   MAIN.JS — Application Orchestrator (Fixed)
   Midnight Tech Portfolio | Mayank
   ================================================================ */

(function () {
  'use strict';

  // ────────────────────────────────────────────────────────
  //  DOM REFERENCES
  // ────────────────────────────────────────────────────────

  var loader         = document.getElementById('loader');
  var loaderProgress = document.getElementById('loaderProgress');
  var loaderPercent  = document.getElementById('loaderPercent');
  var loaderBoot     = document.getElementById('loaderBoot');
  var loaderCanvas   = document.getElementById('loaderCanvas');
  var hamburger      = document.getElementById('hamburger');
  var mobileMenu     = document.getElementById('mobileMenu');
  var navbar         = document.getElementById('navbar');
  var navLinks       = document.querySelectorAll('.nav-link');
  var mobileLinks    = document.querySelectorAll('.mobile-link');
  var contactForm    = document.getElementById('contactForm');

  // ─────────────────────────────────────────────��──────────
  //  MATRIX RAIN (Loader Background)
  // ────────────────────────────────────────────────────────

  function initMatrixRain() {
    if (!loaderCanvas) return null;

    var ctx = loaderCanvas.getContext('2d');
    loaderCanvas.width = window.innerWidth;
    loaderCanvas.height = window.innerHeight;

    var chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>/{}[]();=+*&^%$#@!';
    chars = chars.split('');

    var fontSize = 14;
    var columns = Math.floor(loaderCanvas.width / fontSize);
    var drops = [];

    for (var i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100);
    }

    var matrixInterval = setInterval(function () {
      ctx.fillStyle = 'rgba(3, 0, 20, 0.06)';
      ctx.fillRect(0, 0, loaderCanvas.width, loaderCanvas.height);

      ctx.font = fontSize + 'px JetBrains Mono, monospace';

      for (var i = 0; i < drops.length; i++) {
        var text = chars[Math.floor(Math.random() * chars.length)];
        var x = i * fontSize;
        var y = drops[i] * fontSize;

        if (Math.random() > 0.92) {
          ctx.fillStyle = 'rgba(6, 182, 212, 0.5)';
        } else if (Math.random() > 0.85) {
          ctx.fillStyle = 'rgba(236, 72, 153, 0.4)';
        } else {
          ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
        }

        ctx.fillText(text, x, y);

        if (y > loaderCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 45);

    return matrixInterval;
  }

  // ────────────────────────────────────────────────────────
  //  BOOT SEQUENCE
  // ────────────────────────────────────────────────────────

  var bootMessages = [
    { text: '> Booting system...',           type: 'info',    delay: 0 },
    { text: '✓ Core modules loaded',         type: 'success', delay: 300 },
    { text: '✓ Shaders compiled',            type: 'success', delay: 550 },
    { text: '⚡ GPU acceleration: ON',       type: 'warning', delay: 800 },
    { text: '✓ Three.js initialized',        type: 'success', delay: 1050 },
    { text: '✓ GSAP ScrollTrigger ready',    type: 'success', delay: 1250 },
    { text: '> Rendering portfolio...',      type: 'info',    delay: 1500 },
    { text: '✓ All systems nominal',         type: 'success', delay: 1800 },
  ];

  function runBootSequence() {
    if (!loaderBoot) return;

    bootMessages.forEach(function (msg) {
      setTimeout(function () {
        var line = document.createElement('div');
        line.className = 'boot-line ' + msg.type;
        line.textContent = msg.text;
        line.style.animationDelay = '0s';
        loaderBoot.appendChild(line);

        var lines = loaderBoot.querySelectorAll('.boot-line');
        if (lines.length > 5) {
          lines[0].style.opacity = '0';
          lines[0].style.transition = 'opacity 0.2s ease';
          setTimeout(function () {
            if (lines[0] && lines[0].parentNode) lines[0].parentNode.removeChild(lines[0]);
          }, 200);
        }
      }, msg.delay);
    });
  }

  // ────────────────────────────────────────────────────────
  //  PAGE LOADER
  // ────────────────────────────────────────────────────────

  function initLoader() {
    if (!loader || !loaderProgress) {
      document.body.style.overflow = '';
      return Promise.resolve();
    }

    document.body.style.overflow = 'hidden';

    var matrixInterval = initMatrixRain();
    runBootSequence();

    return new Promise(function (resolve) {
      var progress = 0;
      var steps = [
        { target: 15,  duration: 250 },
        { target: 35,  duration: 300 },
        { target: 55,  duration: 350 },
        { target: 75,  duration: 300 },
        { target: 90,  duration: 250 },
        { target: 100, duration: 200 },
      ];
      var stepIndex = 0;

      function nextStep() {
        if (stepIndex >= steps.length) {
          setTimeout(function () {
            if (matrixInterval) clearInterval(matrixInterval);

            loader.classList.add('hidden');
            document.body.style.overflow = '';
            document.body.classList.add('loaded');

            setTimeout(function () {
              if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
              }
              resolve();
            }, 800);
          }, 400);
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
      var eased = ratio < 0.5
        ? 4 * ratio * ratio * ratio
        : 1 - Math.pow(-2 * ratio + 2, 3) / 2;
      var current = from + (to - from) * eased;

      if (loaderProgress) {
        loaderProgress.style.width = current + '%';
      }
      if (loaderPercent) {
        loaderPercent.textContent = Math.round(current) + '%';
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
        opacity: 0, y: 40, scale: 0.95, duration: 0.5,
        stagger: 0.08, ease: 'back.out(1.7)', clearProps: 'all',
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
  //  MAGNETIC BUTTONS
  // ────────────────────────────────────────────────────────

  function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    var buttons = document.querySelectorAll('.btn-glow, .btn-outline, .proj-link');

    buttons.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(function () { btn.style.transition = ''; }, 400);
      });
    });
  }

  // ────────────────────────────────────────────────────────
  //  TILT EFFECT ON CARDS
  // ────────────────────────────────────────────────────────

  function initCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var cards = document.querySelectorAll('.project-card, .skill-card');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;

        var rotateX = (y - 0.5) * -8;
        var rotateY = (x - 0.5) * 8;

        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(function () { card.style.transition = ''; }, 600);
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

        createSuccessParticles(submitBtn);

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
      gsap.to(btn, {
        x: [-10, 10, -8, 8, -4, 4, 0],
        duration: 0.5,
        ease: 'power2.out',
      });
      btn.style.boxShadow = '0 0 20px rgba(248, 113, 113, 0.4)';
      setTimeout(function () { btn.style.boxShadow = ''; }, 500);
    }
  }

  function createSuccessParticles(btn) {
    var rect = btn.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;

    for (var i = 0; i < 12; i++) {
      var particle = document.createElement('div');
      particle.style.cssText = 'position:fixed;width:6px;height:6px;border-radius:50%;pointer-events:none;z-index:10000;';
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      particle.style.background = i % 3 === 0 ? '#4ade80' : i % 3 === 1 ? '#22d3ee' : '#a78bfa';
      document.body.appendChild(particle);

      var angle = (i / 12) * Math.PI * 2;
      var distance = 60 + Math.random() * 40;

      if (typeof gsap !== 'undefined') {
        gsap.to(particle, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          scale: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: function () {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
          },
        });
      } else {
        setTimeout(function () {
          if (particle.parentNode) particle.parentNode.removeChild(particle);
        }, 800);
      }
    }
  }

  // ────────────────────────────────────────────────────────
  //  LOGO CLICK
  // ────────────────────────────────────────────────────────

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
      '%c ⚡ Midnight Tech Portfolio ',
      'background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;font-size:16px;font-weight:bold;font-family:monospace;padding:12px 20px;border-radius:8px'
    );
    console.log(
      '%c Built by Mayank — HTML • CSS • JS • Three.js • GSAP ',
      'color:#06b6d4;font-size:12px;font-family:monospace;padding:6px'
    );
  }

  // ────────────────────────────────────────────────────────
  //  START ANIMATIONS (called after loader finishes)
  // ────────────────────────────────────────────────────────

  function startAnimations() {
    // This function is called AFTER the loader is gone
    // It dispatches a custom event that animations.js listens for
    var event;
    try {
      event = new CustomEvent('portfolioReady');
    } catch (e) {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent('portfolioReady', true, true, null);
    }
    document.dispatchEvent(event);
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
      initMagneticButtons();
      initCardTilt();

      // Tell animations.js the page is ready
      startAnimations();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();