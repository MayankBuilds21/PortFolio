/* ================================================================
   ANIMATIONS.JS — Scroll Animations & Reveals
   Midnight Tech Portfolio | Mayank
   ================================================================ */

(function () {
  'use strict';

  // ────────────────────────────────────────────────────────
  //  CHECK: Is GSAP available?
  // ────────────────────────────────────────────────────────

  var gsapLoaded = (typeof gsap !== 'undefined') && (typeof ScrollTrigger !== 'undefined');

  if (!gsapLoaded) {
    console.warn('GSAP not loaded — showing all content without animations.');
    // Everything stays visible (no .gsap-ready class added)
    initNavbarScrollFallback();
    initStatCountersImmediate();
    return;
  }

  // ── GSAP is ready — hide elements, then animate them in ──
  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add('gsap-ready');

  // ────────────────────────────────────────────────────────
  //  REDUCED MOTION CHECK
  // ────────────────────────────────────────────────────────

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.body.classList.remove('gsap-ready');
    initNavbarScroll();
    initActiveNav();
    initStatCountersImmediate();
    return;
  }

  // ── Initialize everything ──
  // Small delay to ensure DOM has applied the gsap-ready class
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      initReveals();
      initStatCounters();
      initNavbarScroll();
      initActiveNav();
      initParallax();
      initStaggerGrids();
      initTitleLines();
      initFormAnimations();
    });
  });

  // ───���────────────────────────────────────────────────────
  //  ELEMENT REVEAL ANIMATIONS
  // ────────────────────────────────────────────────────────

  function initReveals() {
    var animElements = document.querySelectorAll('.anim');

    animElements.forEach(function (el) {
      var animType = el.getAttribute('data-anim') || 'fade-up';
      var delay    = parseFloat(el.getAttribute('data-delay')) || 0;

      var fromVars = {
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'all',
        onComplete: function () {
          el.classList.add('revealed');
          el.style.opacity = '1';
          el.style.transform = 'none';
        },
      };

      switch (animType) {
        case 'fade-up':
          fromVars.y = 50;
          break;
        case 'fade-left':
          fromVars.x = 80;
          break;
        case 'fade-right':
          fromVars.x = -80;
          break;
        default:
          fromVars.y = 50;
      }

      var isHero = el.closest('#home') !== null;

      if (isHero) {
        // Hero: animate on page load with delay
        fromVars.delay = delay;
        gsap.from(el, fromVars);
      } else {
        // Other sections: animate on scroll
        fromVars.delay = delay;
        fromVars.scrollTrigger = {
          trigger: el,
          start: 'top 88%',
          end: 'top 50%',
          toggleActions: 'play none none none',
          once: true,
        };
        gsap.from(el, fromVars);
      }
    });
  }

  // ────────────────────────────────────────────────────────
  //  STAT COUNTERS (Animated)
  // ────────────────────────────────────────────────────────

  function initStatCounters() {
    var statNums = document.querySelectorAll('.stat-num');

    statNums.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: function () {
          animateCounter(el, target);
        },
      });
    });
  }

  function animateCounter(el, target) {
    var obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      onUpdate: function () {
        el.textContent = Math.round(obj.val);
      },
    });
  }

  // ────────────────────────────────────────────────────────
  //  STAT COUNTERS (Immediate — no animation)
  // ────────────────────────────────────────────────────────

  function initStatCountersImmediate() {
    var statNums = document.querySelectorAll('.stat-num');
    statNums.forEach(function (el) {
      var target = el.getAttribute('data-target');
      if (target) el.textContent = target;
    });
  }

  // ────────────────────────────────────────────────────────
  //  NAVBAR SCROLL STATE
  // ────────────────────────────────────────────────────────

  function initNavbarScroll() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      onUpdate: function (self) {
        if (self.scroll() > 80) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      },
    });
  }

  // Fallback if no GSAP
  function initNavbarScrollFallback() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ────────────────────────────────────────────────────────
  //  ACTIVE NAV LINK TRACKING
  // ────────────────────────────────────────────────────────

  function initActiveNav() {
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('.section');

    if (navLinks.length === 0 || sections.length === 0) return;

    sections.forEach(function (section) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 40%',
        end: 'bottom 40%',
        onEnter: function () { setActiveLink(section.id); },
        onEnterBack: function () { setActiveLink(section.id); },
      });
    });

    function setActiveLink(sectionId) {
      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
          link.classList.add('active');
        }
      });
    }
  }

  // ────────────────────────────────────────────────────────
  //  PARALLAX ON HERO CARD
  // ────────────────────────────────────────────────────────

  function initParallax() {
    var heroCard = document.querySelector('.hero-card');
    var heroSection = document.getElementById('home');
    if (!heroCard || !heroSection) return;

    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(heroCard, {
        rotateY: x * 8,
        rotateX: -y * 6,
        duration: 0.6,
        ease: 'power2.out',
        transformPerspective: 800,
      });
    });

    heroSection.addEventListener('mouseleave', function () {
      gsap.to(heroCard, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    });
  }

  // ────────────────────────────────────────────────────────
  //  STAGGER GRIDS
  // ────────────────────────────────────────────────────────

  function initStaggerGrids() {
    // Skill tags
    var skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(function (card) {
      var tags = card.querySelectorAll('.skill-tag');
      if (tags.length === 0) return;

      ScrollTrigger.create({
        trigger: card,
        start: 'top 82%',
        once: true,
        onEnter: function () {
          gsap.from(tags, {
            opacity: 0,
            y: 15,
            scale: 0.9,
            duration: 0.4,
            stagger: 0.05,
            ease: 'back.out(1.7)',
            clearProps: 'all',
          });
        },
      });
    });

    // Contact links
    var contactLinks = document.querySelectorAll('.contact-item');
    if (contactLinks.length > 0) {
      ScrollTrigger.create({
        trigger: contactLinks[0],
        start: 'top 88%',
        once: true,
        onEnter: function () {
          gsap.from(contactLinks, {
            opacity: 0,
            x: -30,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'all',
          });
        },
      });
    }
  }

  // ────────────────────────────────────────────────────────
  //  TITLE LINES
  // ────────────────────────────────────────────────────────

  function initTitleLines() {
    var lines = document.querySelectorAll('.title-line');
    lines.forEach(function (line) {
      gsap.from(line, {
        scaleX: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: line,
          start: 'top 88%',
          once: true,
        },
      });
    });
  }

  // ────────────────────────────────────────────────────────
  //  FORM FOCUS ANIMATIONS
  // ────────────────────────────────────────────────────────

  function initFormAnimations() {
    var inputs = document.querySelectorAll('.form-group input, .form-group textarea');

    inputs.forEach(function (input) {
      var label = input.previousElementSibling;

      input.addEventListener('focus', function () {
        if (label && label.tagName === 'LABEL') {
          gsap.to(label, { color: '#a78bfa', y: -2, duration: 0.3, ease: 'power2.out' });
        }
      });

      input.addEventListener('blur', function () {
        if (label && label.tagName === 'LABEL') {
          gsap.to(label, { color: '', y: 0, duration: 0.3, ease: 'power2.out', clearProps: 'color,y' });
        }
      });
    });
  }

})();