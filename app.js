/* ================================================
   DecodeLabs Interactive Sandbox
   Three independent, self-contained features.
   Each one only touches its own DOM nodes and its
   own localStorage key, so they can't interfere
   with each other.
   ================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------
     1. THEME TOGGLE
     The actual theme is already applied by the
     inline script in <head> (before paint, to avoid
     a flash of the wrong theme). This module just
     handles the button click and keeps localStorage
     in sync.
     ---------------------------------------------- */
  function initThemeToggle() {
    const btn = document.querySelector('.js-theme-toggle');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('decodelabs-theme', next);
      btn.setAttribute('aria-pressed', String(next === 'dark'));
    });

    // Reflect the theme set by the head script on first paint
    const current = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.setAttribute('aria-pressed', String(current));
  }

  /* ----------------------------------------------
     2. STATE TRACKER (counter)
     Persists across reloads via localStorage.
     A single render() function keeps the DOM and
     stored value from ever drifting out of sync.
     ---------------------------------------------- */
  function initCounter() {
    const display = document.querySelector('.js-score-display');
    const incrementBtn = document.querySelector('.js-increment-btn');
    const resetBtn = document.querySelector('.js-reset-btn');
    if (!display) return;

    let score = parseInt(localStorage.getItem('decodelabs-score'), 10) || 0;

    function render() {
      display.textContent = score;
      localStorage.setItem('decodelabs-score', String(score));

      // Quick visual "bump" feedback on every change
      display.classList.remove('bump');
      // Forces the browser to register the class removal
      // before re-adding it, so the animation can replay
      void display.offsetWidth;
      display.classList.add('bump');
    }

    incrementBtn?.addEventListener('click', () => {
      score += 1;
      render();
    });

    resetBtn?.addEventListener('click', () => {
      score = 0;
      render();
    });

    render();
  }

  /* ----------------------------------------------
     3. SLIDING MENU
     Toggles a class for the CSS slide animation and
     keeps aria-expanded in sync for screen readers.
     ---------------------------------------------- */
  function initSlidingMenu() {
    const toggle = document.querySelector('.js-menu-toggle');
    const menu = document.querySelector('.js-sliding-menu');
    if (!toggle || !menu) return;

    toggle.setAttribute('aria-expanded', 'false');

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  /* ----------------------------------------------
     4. SUBMISSION FORM
     Validates on submit (not on every keystroke, to
     avoid nagging the user while they're still
     typing), shows inline success/error feedback,
     and clears the field on a valid submit.
     ---------------------------------------------- */
  function initSubmitForm() {
    const form = document.querySelector('.js-submit-form');
    const input = document.querySelector('.js-payload-input');
    const feedback = document.querySelector('.js-form-feedback');
    if (!form || !input || !feedback) return;

    function setFeedback(message, state) {
      feedback.textContent = message;
      feedback.classList.remove('success', 'error');
      if (state) feedback.classList.add(state);
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const value = input.value.trim();

      if (!value) {
        input.classList.add('invalid');
        setFeedback('Payload cannot be empty.', 'error');
        input.focus();
        return;
      }

      input.classList.remove('invalid');
      setFeedback(`Payload "${value}" submitted successfully.`, 'success');
      form.reset();
    });

    // Clear the error state as soon as the user starts
    // correcting it, rather than waiting for the next submit
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid') && input.value.trim()) {
        input.classList.remove('invalid');
        setFeedback('', null);
      }
    });
  }

  /* ----------------------------------------------
     Boot
     ---------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initCounter();
    initSlidingMenu();
    initSubmitForm();
  });
})();
