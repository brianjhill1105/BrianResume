/* ============================================
   Brian Hill — Resume Website
   script.js
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     1. PARTICLE CANVAS — Hero Background
     ------------------------------------------ */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, particles, animationId;
    const PARTICLE_COUNT = 60;
    const CONNECTION_DISTANCE = 140;
    const MOUSE_RADIUS = 180;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(14, 165, 233, ' + alpha + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse interaction — gentle repulsion
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < MOUSE_RADIUS && mDist > 0) {
          const force = (MOUSE_RADIUS - mDist) / MOUSE_RADIUS * 0.02;
          p.vx += (mdx / mDist) * force;
          p.vy += (mdy / mDist) * force;
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Boundaries — wrap around
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(14, 165, 233, ' + p.opacity + ')';
        ctx.fill();
      }
    }

    function animate() {
      drawParticles();
      animationId = requestAnimationFrame(animate);
    }

    // Track mouse inside hero
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.addEventListener('mousemove', function (e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      heroSection.addEventListener('mouseleave', function () {
        mouse.x = -9999;
        mouse.y = -9999;
      });
    }

    // Pause when hero is not in view to save resources
    let heroVisible = true;
    const heroObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (!heroVisible) {
              heroVisible = true;
              animate();
            }
          } else {
            heroVisible = false;
            if (animationId) {
              cancelAnimationFrame(animationId);
              animationId = null;
            }
          }
        });
      },
      { threshold: 0 }
    );
    heroObserver.observe(heroSection || canvas);

    // Init
    resize();
    createParticles();
    animate();

    // Debounced resize
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
        createParticles();
      }, 200);
    });
  }

  /* ------------------------------------------
     2. TYPED TEXT EFFECT — Hero Tagline
     ------------------------------------------ */
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    var phrases = [
      'Tech Leader.',
      'AI Expert.',
      'Web Producer.',
    ];
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var currentText = '';
    var TYPING_SPEED = 80;
    var DELETING_SPEED = 50;
    var PAUSE_AFTER_TYPED = 2000;
    var PAUSE_AFTER_DELETED = 400;

    function typeEffect() {
      var currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        currentText = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      } else {
        currentText = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      }

      typedEl.textContent = currentText;

      var delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

      if (!isDeleting && charIndex === currentPhrase.length) {
        delay = PAUSE_AFTER_TYPED;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = PAUSE_AFTER_DELETED;
      }

      setTimeout(typeEffect, delay);
    }

    // Start after a brief delay so hero animation plays first
    setTimeout(typeEffect, 1200);
  }

  /* ------------------------------------------
     3. SCROLL ANIMATIONS — IntersectionObserver
     ------------------------------------------ */
  var scrollElements = document.querySelectorAll('.animate-on-scroll');

  if (scrollElements.length > 0 && 'IntersectionObserver' in window) {
    var scrollObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    scrollElements.forEach(function (el) {
      scrollObserver.observe(el);
    });
  } else {
    // Fallback: show everything
    scrollElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ------------------------------------------
     4. NAVIGATION — Scrolled State & Active Link
     ------------------------------------------ */
  var nav = document.getElementById('nav');
  var navLinks = document.querySelectorAll('.nav__link');
  var sections = document.querySelectorAll('.section, .hero');

  // Add scrolled class on scroll
  function handleNavScroll() {
    if (window.scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Initial check

  // Active link highlighting
  if (sections.length > 0 && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + id) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-' + parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) + 'px 0px -40% 0px',
      }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ------------------------------------------
     5. MOBILE HAMBURGER MENU
     ------------------------------------------ */
  var hamburger = document.getElementById('hamburger');
  var navLinksContainer = document.getElementById('nav-links');

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('open');
      navLinksContainer.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    navLinksContainer.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navLinksContainer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinksContainer.classList.contains('open')) {
        hamburger.classList.remove('open');
        navLinksContainer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });

    // Close menu on click outside
    document.addEventListener('click', function (e) {
      if (
        navLinksContainer.classList.contains('open') &&
        !navLinksContainer.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        hamburger.classList.remove('open');
        navLinksContainer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ------------------------------------------
     6. PHILOSOPHY CARDS — Expand/Collapse
     ------------------------------------------ */
  var philosophyCards = document.querySelectorAll('.philosophy__card');

  philosophyCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var isExpanded = card.classList.contains('expanded');

      // Close all other cards
      philosophyCards.forEach(function (other) {
        if (other !== card) {
          other.classList.remove('expanded');
          other.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle this card
      card.classList.toggle('expanded');
      card.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    });

    // Keyboard support
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  /* ------------------------------------------
     7. SMOOTH SCROLL (fallback for older browsers)
     ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var navHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
          10
        ) || 72;
        var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
