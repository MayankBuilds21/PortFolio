/* ================================================================
   TYPEWRITER.JS — Cycling Typewriter Effect
   Midnight Tech Portfolio | Mayank
   
   Types → pauses → deletes → types next word.
   Runs in the hero section #typewriter element.
   ================================================================ */

(function () {
  'use strict';

  // ── DOM ──
  const el = document.getElementById('typewriter');
  if (!el) return;

  // ── Words to cycle through ──
  const words = [
    'web.',
    'future.',
    'world.',
    'cloud.',
    'users.',
    'internet.',
  ];

  // ── Timing (ms) ──
  const TYPE_SPEED     = 100;   // Base speed per character typed
  const DELETE_SPEED   = 60;    // Speed per character deleted
  const PAUSE_AFTER    = 2000;  // Pause after full word is typed
  const PAUSE_BEFORE   = 500;   // Pause before typing next word
  const TYPE_VARIANCE  = 40;    // Random variance for natural feel

  // ── State ──
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeoutId = null;

  // ────────────────────────────────────────────────────────
  //  CORE LOOP
  // ────────────────────────────────────────────────────────

  function tick() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      // ── TYPING ──
      charIndex++;
      el.textContent = currentWord.substring(0, charIndex);

      if (charIndex === currentWord.length) {
        // Full word typed — pause, then start deleting
        isDeleting = true;
        timeoutId = setTimeout(tick, PAUSE_AFTER);
        return;
      }

      // Random variance for natural typing feel
      const variance = Math.random() * TYPE_VARIANCE - TYPE_VARIANCE / 2;
      timeoutId = setTimeout(tick, TYPE_SPEED + variance);

    } else {
      // ── DELETING ──
      charIndex--;
      el.textContent = currentWord.substring(0, charIndex);

      if (charIndex === 0) {
        // Fully deleted — move to next word
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        timeoutId = setTimeout(tick, PAUSE_BEFORE);
        return;
      }

      // Deleting is faster and more uniform
      const variance = Math.random() * 20;
      timeoutId = setTimeout(tick, DELETE_SPEED + variance);
    }
  }

  // ────────────────────────────────────────────────────────
  //  INIT — Start after a short delay for page load
  // ────────────────────────────────────────────────────────

  function init() {
    // Small initial delay so the hero animations play first
    timeoutId = setTimeout(tick, 1200);
  }

  // ────────────────────────────────────────────────────────
  //  VISIBILITY — Pause when tab is hidden
  // ────────────────────────────────────────────────────────

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      clearTimeout(timeoutId);
    } else {
      // Resume after a small delay
      timeoutId = setTimeout(tick, 300);
    }
  });

  // ────────────────────────────────────────────────────────
  //  REDUCED MOTION — Show static text instead
  // ────────────────────────────────────────────────────────

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function handleMotion() {
    if (motionQuery.matches) {
      clearTimeout(timeoutId);
      el.textContent = words[0];
    } else {
      init();
    }
  }

  motionQuery.addEventListener('change', handleMotion);

  // ── Start ──
  handleMotion();

})();