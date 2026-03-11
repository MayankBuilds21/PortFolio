/* ================================================================
   CURSOR.JS — Custom Neon Cursor System
   Midnight Tech Portfolio | Mayank
   ================================================================ */

(function () {
  'use strict';

  if (window.matchMedia('(pointer: coarse)').matches) return;

  var dot  = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');

  if (!dot || !ring) return;

  var pos = {
    dotX: -100,
    dotY: -100,
    ringX: -100,
    ringY: -100,
    targetX: -100,
    targetY: -100,
  };

  var isHovering = false;
  var isClicking = false;
  var isVisible  = false;
  var rafId      = null;

  var RING_SMOOTH = 0.15;

  var HOVER_TARGETS = [
    'a',
    'button',
    '.btn-glow',
    '.btn-outline',
    '.nav-link',
    '.nav-logo',
    '.mobile-link',
    '.proj-link',
    '.project-card',
    '.skill-tag',
    '.contact-item',
    '.highlight',
    '.hamburger',
    'input',
    'textarea',
    '[role="button"]',
    '[tabindex]',
  ].join(', ');

  document.addEventListener('mousemove', function (e) {
    pos.targetX = e.clientX;
    pos.targetY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    }
  });

  document.addEventListener('mousedown', function () {
    isClicking = true;
    dot.style.transform  = 'translate(-50%, -50%) scale(0.6)';
    ring.style.transform = 'translate(-50%, -50%) scale(0.85)';
  });

  document.addEventListener('mouseup', function () {
    isClicking = false;
    dot.style.transform  = 'translate(-50%, -50%) scale(1)';
    ring.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  document.addEventListener('mouseleave', function () {
    isVisible = false;
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', function () {
    isVisible = true;
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(HOVER_TARGETS)) {
      enterHover();
    }
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(HOVER_TARGETS)) {
      var related = e.relatedTarget;
      if (!related || !related.closest(HOVER_TARGETS)) {
        leaveHover();
      }
    }
  });

  function enterHover() {
    if (isHovering) return;
    isHovering = true;
    ring.classList.add('hover');
    dot.style.background  = 'var(--cyan-400)';
    dot.style.boxShadow   = '0 0 14px var(--cyan-400), 0 0 35px rgba(6,182,212,0.3)';
  }

  function leaveHover() {
    if (!isHovering) return;
    isHovering = false;
    ring.classList.remove('hover');
    dot.style.background  = 'var(--purple-400)';
    dot.style.boxShadow   = '0 0 12px var(--purple-500), 0 0 30px rgba(124,58,237,0.3)';
  }

  function render() {
    rafId = requestAnimationFrame(render);

    pos.dotX = pos.targetX;
    pos.dotY = pos.targetY;

    pos.ringX += (pos.targetX - pos.ringX) * RING_SMOOTH;
    pos.ringY += (pos.targetY - pos.ringY) * RING_SMOOTH;

    dot.style.left  = pos.dotX + 'px';
    dot.style.top   = pos.dotY + 'px';
    ring.style.left = pos.ringX + 'px';
    ring.style.top  = pos.ringY + 'px';
  }

  dot.style.opacity  = '0';
  ring.style.opacity = '0';

  render();

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      render();
    }
  });

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function handleMotion() {
    if (motionQuery.matches) {
      cancelAnimationFrame(rafId);
      dot.style.display  = 'none';
      ring.style.display = 'none';
      document.body.style.cursor = 'auto';

      var allEls = document.querySelectorAll('*');
      allEls.forEach(function (el) {
        el.style.cursor = '';
      });
    } else {
      dot.style.display  = '';
      ring.style.display = '';
      render();
    }
  }

  motionQuery.addEventListener('change', handleMotion);
  handleMotion();

})();