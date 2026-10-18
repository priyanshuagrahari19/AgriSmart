/**
 * AgriSmart - Mobile 3-Line Hamburger Navigation Handler
 * Toggles responsive menu on small screens across all website pages.
 */
(function () {
  'use strict';

  function initResponsiveNav() {
    var headers = document.querySelectorAll('.header');
    if (!headers || headers.length === 0) return;

    headers.forEach(function (header) {
      var navbar = header.querySelector('.navbar');
      if (!navbar) return;

      // Check if hamburger button already exists, create if missing
      var hamburger = header.querySelector('.hamburger-btn');
      if (!hamburger) {
        hamburger = document.createElement('button');
        hamburger.className = 'hamburger-btn';
        hamburger.id = 'hamburgerBtn';
        hamburger.setAttribute('aria-label', 'Toggle Navigation Menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
        header.appendChild(hamburger);
      }

      // Avoid double-binding
      if (hamburger.dataset.navInitialized === 'true') return;
      hamburger.dataset.navInitialized = 'true';

      function toggleMenu(e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        var isOpen = navbar.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }

      function closeMenu() {
        if (navbar.classList.contains('active')) {
          navbar.classList.remove('active');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }

      // Toggle click
      hamburger.addEventListener('click', toggleMenu);

      // Close when clicking outside header
      document.addEventListener('click', function (e) {
        if (!header.contains(e.target)) {
          closeMenu();
        }
      });

      // Close on Escape key press
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
          closeMenu();
        }
      });

      // Close when clicking any nav link
      var navLinks = navbar.querySelectorAll('a');
      navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          closeMenu();
        });
      });

      // Auto-close if screen is resized back to desktop
      window.addEventListener('resize', function () {
        if (window.innerWidth > 850) {
          closeMenu();
        }
      });
    });
  }

  // Initialize on DOM ready or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initResponsiveNav);
  } else {
    initResponsiveNav();
  }
})();
