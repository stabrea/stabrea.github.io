/* ============================================
   Taofik Bishi — Portfolio Scripts
   ============================================ */

(function () {
  'use strict';

  // ---- Matrix Rain Background ----
  function initMatrix() {
    var canvas = document.getElementById('matrix-bg');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var chars = '01ABCDEF{}[]<>/\\$#@&%';
    var fontSize = 14;
    var columns = Math.floor(canvas.width / fontSize);
    var drops = [];
    for (var i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    function draw() {
      ctx.fillStyle = 'rgba(10, 14, 23, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff88';
      ctx.font = fontSize + 'px monospace';

      for (var i = 0; i < drops.length; i++) {
        var char = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5;
      }
    }

    var matrixInterval = setInterval(draw, 60);

    // Pause matrix animation when tab is hidden to save resources
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        clearInterval(matrixInterval);
        matrixInterval = null;
      } else {
        if (!matrixInterval) {
          matrixInterval = setInterval(draw, 60);
        }
      }
    });
  }

  // ---- Typing Effect ----
  function initTypingEffect() {
    var el = document.getElementById('typed-tagline');
    if (!el) return;

    var phrases = [
      'Securing financial systems with code.',
      'Building at the intersection of finance & security.',
      'From risk models to game engines.',
      'Data-driven. Security-minded. Code-fluent.'
    ];
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typingSpeed = 50;
    var pauseAfterType = 2000;
    var pauseAfterDelete = 500;

    // Add cursor span
    var cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '';
    el.appendChild(cursor);

    function type() {
      var current = phrases[phraseIndex];
      var displayed;

      if (isDeleting) {
        charIndex--;
        displayed = current.substring(0, charIndex);
      } else {
        charIndex++;
        displayed = current.substring(0, charIndex);
      }

      // Set text content before cursor
      el.textContent = displayed;
      el.appendChild(cursor);

      var delay = typingSpeed;

      if (!isDeleting && charIndex === current.length) {
        delay = pauseAfterType;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = pauseAfterDelete;
      } else if (isDeleting) {
        delay = 30;
      }

      setTimeout(type, delay);
    }

    // Start after a short initial delay
    setTimeout(type, 800);
  }

  // ---- Scroll-triggered Fade-in Animations ----
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    // Immediately reveal hero elements (above the fold)
    var heroElements = document.querySelectorAll('.hero .fade-in');
    heroElements.forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('visible');
      }, 200 + i * 150);
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px'
        }
      );

      elements.forEach(function (el) {
        // Skip hero elements (already animated)
        if (!el.closest('.hero')) {
          observer.observe(el);
        }
      });
    } else {
      // Fallback: show everything
      elements.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  // ---- Skill Bar Animation ----
  function initSkillBars() {
    var bars = document.querySelectorAll('.skill-fill');
    if (!bars.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var width = entry.target.getAttribute('data-width');
              entry.target.style.width = width + '%';
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      bars.forEach(function (bar) {
        observer.observe(bar);
      });
    } else {
      bars.forEach(function (bar) {
        bar.style.width = bar.getAttribute('data-width') + '%';
      });
    }
  }

  // ---- Mobile Hamburger Menu ----
  function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Active Nav Link Highlighting ----
  function initActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a');
    if (!sections.length || !navLinks.length) return;

    function highlightNav() {
      var scrollY = window.scrollY + 100;

      sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();
  }

  // ---- Navbar Scroll Effect ----
  function initNavbarScroll() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    function onScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Smooth Scroll for Anchor Links ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var offset = 72; // navbar height + padding
          var top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  // ---- Initialize Everything ----
  function init() {
    initMatrix();
    initTypingEffect();
    initScrollAnimations();
    initSkillBars();
    initMobileMenu();
    initActiveNav();
    initNavbarScroll();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
