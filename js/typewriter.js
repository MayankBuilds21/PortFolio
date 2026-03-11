/* ================================================================
   TYPEWRITER.JS — Cycling Typewriter Effect
   Midnight Tech Portfolio | Mayank
   ================================================================ */

(function () {
  'use strict';

  var el = document.getElementById('typewriter');
  if (!el) return;

  var words = [
    'web.',
    'future.',
    'world.',
    'cloud.',
    'users.',
    'internet.',
  ];

  var TYPE_SPEED     = 100;
  var DELETE_SPEED   = 60;
  var PAUSE_AFTER    = 2000;
  var PAUSE_BEFORE   = 500;
  var TYPE_VARIANCE  = 40;

  var wordIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var timeoutId = null;

  function tick() {
    var currentWord = words[wordIndex];

    if (!isDeleting) {
      charIndex++;
      el.textContent = currentWord.substring(0, charIndex);

      if (charIndex === currentWord.length) {
        isDeleting = true;
        timeoutId = setTimeout(tick, PAUSE_AFTER);
        return;
      }

      var variance = Math.random() * TYPE_VARIANCE - TYPE_VARIANCE / 2;
      timeoutId = setTimeout(tick, TYPE_SPEED + variance);

    } else {
      charIndex--;
      el.textContent = currentWord.substring(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        timeoutId = setTimeout(tick, PAUSE_BEFORE);
        return;
      }

      var variance = Math.random() * 20;
      timeoutId = setTimeout(tick, DELETE_SPEED + variance);
    }
  }

  function init() {
    timeoutId = setTimeout(tick, 1200);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      clearTimeout(timeoutId);
    } else {
      timeoutId = setTimeout(tick, 300);
    }
  });

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function handleMotion() {
    if (motionQuery.matches) {
      clearTimeout(timeoutId);
      el.textContent = words[0];
    } else {
      init();
    }
  }

  motionQuery.addEventListener('change', handleMotion);
  handleMotion();

})();