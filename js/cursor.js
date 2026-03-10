/* ================================================================
   CURSOR.JS — Custom Neon Cursor System
   Midnight Tech Portfolio | Mayank
   
   Dual-element cursor:
   • Inner dot  — follows mouse instantly, emits glow
   • Outer ring — lerps behind with spring easing, expands on hover
   ================================================================ */

(function () {
  'use strict';

  // ── Skip on touch devices ──
  if (window.matchMedia('(pointer: coarse)').matches) return;

  // ── DOM Elements ──
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (!dot || !ring) return;

  // ── State ──
  const pos = {
    dotX: -100,
    dotY: -100,
    ringX: -100,
    ringY: -100,
    targetX: -100,
    targetY: -100,
  };

  let isHovering = false;
  let isClicking = false;
  let isVisible  = false;
  let rafId      = null;

  // ── Lerp smoothing factor (0 = no movement, 1 = instant) ──
  const RING_SMOOTH = 0.15;

  // ── Selectors for hover targets ──
  const HOVER_TARGETS = [
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


  // ────────────────────────────────────────────────────────
  //  MOUSE EVENTS
  // ────────────────────────────────────────────────────────

  document.addEventListener('mousemove', function (e) {
    pos.targetX = e.clientX;
    pos.targetY = e.clientY;

    // Show cursor on first move
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

  // ── Hide when mouse leaves window ──
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


  // ────────────────────────────────────────────────────────
  //  HOVER DETECTION (Event Delegation)
  // ──────────────────────────────────────────────────���─────

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(HOVER_TARGETS)) {
      enterHover();
    }
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(HOVER_TARGETS)) {
      // Make sure we're actually leaving the element
      const related = e.relatedTarget;
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


  // ────────────────────────────────────────────────────────
  //  RENDER LOOP
  // ────────────────────────────────────────────────────────

  function render() {
    rafId = requestAnimationFrame(render);

    // Dot follows instantly
    pos.dotX = pos.targetX;
    pos.dotY = pos.targetY;

    // Ring lerps behind
    pos.ringX += (pos.targetX - pos.ringX) * RING_SMOOTH;
    pos.ringY += (pos.targetY - pos.ringY) * RING_SMOOTH;

    // Apply transforms (using left/top for sub-pixel precision)
    dot.style.left  = pos.dotX + 'px';
    dot.style.top   = pos.dotY + 'px';
    ring.style.left = pos.ringX + 'px';
    ring.style.top  = pos.ringY + 'px';
  }

  // ── Start hidden, show on first mousemove ──
  dot.style.opacity  = '0';
  ring.style.opacity = '0';

  // ── Kick off ──
  render();


  // ────────────────────────────────────────────────────────
  //  CLEANUP ON PAGE HIDE (performance)
  // ────────────────────────────────────────────────────────

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      render();
    }
  });


  // ────────────────────────────────────────────────────────
  //  REDUCED MOTION
  // ─��──────────────────────────────────────────────────────

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function handleMotion() {
    if (motionQuery.matches) {
      cancelAnimationFrame(rafId);
      dot.style.display  = 'none';
      ring.style.display = 'none';
      document.body.style.cursor = 'auto';

      // Re-enable native cursor on all elements
      const allEls = document.querySelectorAll('*');
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