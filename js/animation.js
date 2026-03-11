/* ================================================================
   ANIMATIONS.JS — Scroll Animations & Reveals (Fixed)
   Midnight Tech Portfolio | Mayank

   Waits for 'portfolioReady' event from main.js
   so animations start AFTER the loader is gone.
   ================================================================ */

(function () {
  'use strict';

  // ────────────────────────────────────────────────────────
  //  WAIT FOR LOADER TO FINISH
  //  main.js dispatches 'portfolioReady' after loader hides
  // ────────────────────────────────────────────────────────

  document.addEventListener('portfolioReady', function () {
    initAllAnimations();
  });

  // Fallback: if event never fires (e.g. no loader), start after 4s
  setTimeout(function () {
    if (!document.body.classList.contains('gsap-ready')) {
      initAllAnimations();
    }
  }, 4000);

  function initAllAnimations() {
    var gsapLoaded = (typeof gsap !== 'undefined') && (typeof ScrollTrigger !== 'undefined');

    if (!gsapLoaded) {
      console.warn('GSAP not loaded — showing all content without animations.');
      showAllContent();
      initNavbarScrollFallback();
      initStatCountersImmediate();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      showAllContent();
      initNavbarScroll();
      initActiveNav();
      initStatCountersImmediate();
      return;
    }

    // Add gsap-ready class THEN immediately run animations
    document.body.classList.add('gsap-ready');

    // Use rAF to ensure the class is applied before animating
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        initReveals();
        initHeroStatCounters();
        initScrollStatCounters();
        initNavbarScroll();
        initActiveNav();
        initParallax();
        initStaggerGrids();
        initTitleLines();
        initFormAnimations();
        initTextSplitReveals();
        initSectionTransitions();
        initHeroEntrance();
        initAboutAnimations();
      });
    });
  }

  // ────────────────────────────────────────────────────────
  //  SHOW ALL CONTENT (fallback)
  // ───────────────────────────────────���────────────────────

  function showAllContent() {
    var anims = document.querySelectorAll('.anim');
    anims.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.classList.add('revealed');
    });
  }

  // ────────────────────────────────────────────────────────
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
          fromVars.filter = 'blur(4px)';
          break;
        case 'fade-left':
          fromVars.x = 80;
          fromVars.filter = 'blur(3px)';
          break;
        case 'fade-right':
          fromVars.x = -80;
          fromVars.filter = 'blur(3px)';
          break;
        default:
          fromVars.y = 50;
          fromVars.filter = 'blur(4px)';
      }

      var isHero = el.closest('#home') !== null;

      if (isHero) {
        // Hero elements: animate immediately with delay
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
  //  HERO STAT COUNTERS (animate immediately after reveal)
  // ────────────────────────────────────────────────────────

  function initHeroStatCounters() {
    var heroSection = document.getElementById('home');
    if (!heroSection) return;

    var statNums = heroSection.querySelectorAll('.stat-num');

    statNums.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      // Animate after hero content has faded in (1.2s delay)
      var obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        delay: 1.2,
        ease: 'power2.out',
        onUpdate: function () {
          el.textContent = Math.round(obj.val);
        },
      });
    });
  }

  // ────────────────────────────────────────────────────────
  //  SCROLL STAT COUNTERS (for any stats outside hero)
  // ────────────────────────────────────────────────────────

  function initScrollStatCounters() {
    var allStatNums = document.querySelectorAll('.stat-num');

    allStatNums.forEach(function (el) {
      // Skip hero stats (already handled)
      if (el.closest('#home')) return;

      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: function () {
          var obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = Math.round(obj.val);
            },
          });
        },
      });
    });
  }

  // ────────────────────────────────────────────────────────
  //  STAT COUNTERS (Immediate — no animation fallback)
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
        rotateY: x * 10,
        rotateX: -y * 8,
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
        ease: 'elastic.out(1, 0.5)',
      });
    });
  }

  // ────────────────────────────────────────────────────────
  //  STAGGER GRIDS
  // ────────────────────────────────────────────────────────

  function initStaggerGrids() {
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
            scale: 0.85,
            duration: 0.4,
            stagger: 0.05,
            ease: 'back.out(1.7)',
            clearProps: 'all',
          });
        },
      });
    });

    var contactLinks = document.querySelectorAll('.contact-item');
    if (contactLinks.length > 0) {
      ScrollTrigger.create({
        trigger: contactLinks[0],
        start: 'top 88%',
        once: true,
        onEnter: function () {
          gsap.from(contactLinks, {
            opacity: 0,
            x: -40,
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

  // ────────────────────────────────────────────────────────
  //  ENHANCED SECTION TITLE REVEALS
  // ────────────────────────────────────────────────────────

  function initTextSplitReveals() {
    var sectionTitles = document.querySelectorAll('.section-title');

    sectionTitles.forEach(function (title) {
      ScrollTrigger.create({
        trigger: title,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.from(title, {
            opacity: 0,
            y: 30,
            scale: 0.95,
            filter: 'blur(6px)',
            duration: 1,
            ease: 'power4.out',
            clearProps: 'all',
          });

          var sectionNum = title.previousElementSibling;
          if (sectionNum && sectionNum.classList.contains('section-num')) {
            gsap.from(sectionNum, {
              opacity: 0,
              y: 15,
              letterSpacing: '0.5em',
              duration: 0.8,
              ease: 'power3.out',
              clearProps: 'all',
            });
          }
        },
      });
    });
  }

  // ────────────────────────────────────────────────────────
  //  SMOOTH SECTION TRANSITIONS
  // ────────────────────────────────────────────────────────

  function initSectionTransitions() {
    var sections = document.querySelectorAll('.section');

    sections.forEach(function (section) {
      if (section.id === 'home') return;

      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 95%',
          end: 'top 30%',
          scrub: 0.5,
        },
        opacity: 0.7,
      });
    });
  }

  // ────────────────────────────────────────────────────────
  //  HERO ENHANCED ENTRANCE
  // ────────────────────────────────────────────────────────

  function initHeroEntrance() {
    var heroSection = document.getElementById('home');
    if (!heroSection) return;

    var stats = heroSection.querySelectorAll('.stat');
    if (stats.length > 0) {
      gsap.from(stats, {
        opacity: 0,
        y: 30,
        scale: 0.8,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.8,
        ease: 'back.out(1.7)',
        clearProps: 'all',
      });
    }

    var statSeps = heroSection.querySelectorAll('.stat-sep');
    if (statSeps.length > 0) {
      gsap.from(statSeps, {
        opacity: 0,
        scaleY: 0,
        duration: 0.4,
        stagger: 0.1,
        delay: 1.1,
        ease: 'power2.out',
        clearProps: 'all',
      });
    }

    var heroCard = heroSection.querySelector('.hero-card');
    if (heroCard) {
      gsap.from(heroCard, {
        opacity: 0,
        rotateY: 15,
        rotateX: -10,
        scale: 0.9,
        filter: 'blur(8px)',
        duration: 1.2,
        delay: 0.5,
        ease: 'power3.out',
        clearProps: 'all',
        transformPerspective: 800,
      });
    }

    var scrollHint = heroSection.querySelector('.scroll-hint');
    if (scrollHint) {
      gsap.from(scrollHint, {
        opacity: 0,
        y: -15,
        duration: 0.8,
        delay: 2,
        ease: 'power2.out',
        clearProps: 'all',
      });
    }
  }

  // ────────────────────────────────────────────────────────
  //  ABOUT SECTION SPECIAL ANIMATIONS
  // ────────────────────────────────────────────────────────

  function initAboutAnimations() {
    var aboutCard = document.querySelector('.about-card');
    if (!aboutCard) return;

    ScrollTrigger.create({
      trigger: aboutCard,
      start: 'top 80%',
      once: true,
      onEnter: function () {
        var avatar = aboutCard.querySelector('.about-avatar');
        if (avatar) {
          gsap.from(avatar, {
            scale: 0,
            rotation: -180,
            opacity: 0,
            duration: 1,
            ease: 'back.out(1.7)',
            clearProps: 'all',
          });
        }

        var chips = aboutCard.querySelectorAll('.chip');
        if (chips.length > 0) {
          gsap.from(chips, {
            opacity: 0,
            y: 10,
            scale: 0.8,
            duration: 0.4,
            stagger: 0.1,
            delay: 0.5,
            ease: 'back.out(1.7)',
            clearProps: 'all',
          });
        }
      },
    });

    var highlights = document.querySelectorAll('.highlight');
    if (highlights.length > 0) {
      ScrollTrigger.create({
        trigger: highlights[0],
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.from(highlights, {
            opacity: 0,
            x: -40,
            filter: 'blur(3px)',
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
            clearProps: 'all',
          });
        },
      });
    }
  }

})();