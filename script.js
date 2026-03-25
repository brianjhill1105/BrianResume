/* ============================================
   Brian Hill -- Resume Website
   script.js
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     0. UTILITIES & SHARED STATE
     ------------------------------------------ */
  const TWO_PI = Math.PI * 2;

  /**
   * Detect user preference for reduced motion.
   * Checked once at load; also listened to for live changes.
   */
  let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    prefersReducedMotion = e.matches;
  });

  /**
   * Read the --nav-height CSS custom property once and cache it.
   * Falls back to 72 if not defined.
   */
  const NAV_HEIGHT = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
    10
  ) || 72;

  /**
   * Shared helper: close the mobile menu.
   * Extracted to eliminate the four duplicate blocks.
   */
  function closeMobileMenu(hamburger, navLinksContainer) {
    hamburger.classList.remove('open');
    navLinksContainer.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* ------------------------------------------
     1. PARTICLE CANVAS -- Hero Background
     ------------------------------------------ */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let animationId = null;
    const PARTICLE_COUNT = 60;
    const CONNECTION_DISTANCE = 140;
    const CONNECTION_DISTANCE_SQ = CONNECTION_DISTANCE * CONNECTION_DISTANCE;
    const MOUSE_RADIUS = 180;
    const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = (width * dpr) | 0;
      canvas.height = (height * dpr) | 0;
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

      const len = particles.length;

      // --- Connections (batched by alpha bucket to reduce style changes) ---
      // Group lines into discrete alpha buckets to batch draw calls.
      // Using 8 buckets gives a good visual approximation with far fewer
      // beginPath/stroke cycles than one per line pair.
      const ALPHA_BUCKETS = 8;
      const buckets = new Array(ALPHA_BUCKETS);
      for (let b = 0; b < ALPHA_BUCKETS; b++) {
        buckets[b] = [];
      }

      for (let i = 0; i < len; i++) {
        const pi = particles[i];
        const pix = pi.x;
        const piy = pi.y;
        for (let j = i + 1; j < len; j++) {
          const pj = particles[j];
          const dx = pix - pj.x;
          const dy = piy - pj.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < CONNECTION_DISTANCE_SQ) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15;
            const bucketIdx = Math.min((alpha / 0.15 * ALPHA_BUCKETS) | 0, ALPHA_BUCKETS - 1);
            buckets[bucketIdx].push(pix, piy, pj.x, pj.y);
          }
        }
      }

      ctx.lineWidth = 0.8;
      for (let b = 0; b < ALPHA_BUCKETS; b++) {
        const bucket = buckets[b];
        if (bucket.length === 0) continue;
        const alphaVal = ((b + 0.5) / ALPHA_BUCKETS * 0.15).toFixed(4);
        ctx.strokeStyle = 'rgba(14,165,233,' + alphaVal + ')';
        ctx.beginPath();
        for (let k = 0; k < bucket.length; k += 4) {
          ctx.moveTo(bucket[k], bucket[k + 1]);
          ctx.lineTo(bucket[k + 2], bucket[k + 3]);
        }
        ctx.stroke();
      }

      // --- Update & draw particles ---
      for (let i = 0; i < len; i++) {
        const p = particles[i];

        // Mouse interaction -- gentle repulsion (skip sqrt when outside radius)
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDistSq = mdx * mdx + mdy * mdy;
        if (mDistSq < MOUSE_RADIUS_SQ && mDistSq > 0) {
          const mDist = Math.sqrt(mDistSq);
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

        // Boundaries -- wrap around
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }

      // Batch all particle circles into a single path per unique opacity.
      // Most particles have unique opacities, so batch them all with one
      // beginPath per particle (unavoidable with arc), but at least avoid
      // setting fillStyle redundantly for particles with the same opacity.
      // Alternative: draw all with a single average opacity for max perf.
      // Keeping per-particle opacity for visual fidelity.
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc((p.x + 0.5) | 0, (p.y + 0.5) | 0, p.radius, 0, TWO_PI);
        ctx.fillStyle = 'rgba(14,165,233,' + p.opacity + ')';
        ctx.fill();
      }
    }

    function animate() {
      drawParticles();
      animationId = requestAnimationFrame(animate);
    }

    // Track mouse inside hero (passive since we don't call preventDefault)
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      // Cache bounding rect; update on resize instead of every mousemove
      let canvasRect = canvas.getBoundingClientRect();
      const updateCanvasRect = () => {
        canvasRect = canvas.getBoundingClientRect();
      };

      heroSection.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX - canvasRect.left;
        mouse.y = e.clientY - canvasRect.top;
      }, { passive: true });

      heroSection.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
      }, { passive: true });

      // Pause when hero is not in view to save resources
      let heroVisible = true;
      const heroObserver = new IntersectionObserver(
        (entries) => {
          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (entry.isIntersecting) {
              if (!heroVisible) {
                heroVisible = true;
                if (!prefersReducedMotion) {
                  animate();
                }
              }
            } else {
              heroVisible = false;
              if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
              }
            }
          }
        },
        { threshold: 0 }
      );
      heroObserver.observe(heroSection);

      // Init
      resize();
      createParticles();

      if (prefersReducedMotion) {
        // Draw a single static frame so the canvas is not blank
        drawParticles();
      } else {
        animate();
      }

      // Debounced resize
      let resizeTimer = 0;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          resize();
          createParticles();
          updateCanvasRect();
          if (prefersReducedMotion && heroVisible) {
            drawParticles();
          }
        }, 200);
      }, { passive: true });
    }
  }

  /* ------------------------------------------
     2. TYPED TEXT EFFECT -- Hero Tagline
     ------------------------------------------ */
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    // If user prefers reduced motion, show the first phrase statically
    // and skip the typing animation entirely.
    if (prefersReducedMotion) {
      typedEl.textContent = 'Web Producer.';
    } else {
      const phrases = [
        'Web Producer.',
        'AI Expert.',
        'Tech Leader.',
      ];
      let phraseIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      const TYPING_SPEED = 80;
      const DELETING_SPEED = 50;
      const PAUSE_AFTER_TYPED = 2000;
      const PAUSE_AFTER_DELETED = 400;
      let typeTimerId = 0;

      function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (!isDeleting) {
          charIndex++;
        } else {
          charIndex--;
        }

        typedEl.textContent = currentPhrase.substring(0, charIndex);

        let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

        if (!isDeleting && charIndex === currentPhrase.length) {
          delay = PAUSE_AFTER_TYPED;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          delay = PAUSE_AFTER_DELETED;
        }

        typeTimerId = setTimeout(typeEffect, delay);
      }

      // Start after a brief delay so hero animation plays first
      typeTimerId = setTimeout(typeEffect, 1200);

      // Listen for reduced-motion preference change mid-session
      window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        if (e.matches && typeTimerId) {
          clearTimeout(typeTimerId);
          typeTimerId = 0;
          typedEl.textContent = phrases[phraseIndex];
        }
      });
    }
  }

  /* ------------------------------------------
     3. SCROLL ANIMATIONS -- IntersectionObserver
     ------------------------------------------ */
  const scrollElements = document.querySelectorAll('.animate-on-scroll');

  if (scrollElements.length > 0 && 'IntersectionObserver' in window) {
    // If user prefers reduced motion, show everything immediately
    if (prefersReducedMotion) {
      scrollElements.forEach((el) => {
        el.classList.add('visible');
      });
    } else {
      const scrollObserver = new IntersectionObserver(
        (entries) => {
          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              scrollObserver.unobserve(entry.target);
            }
          }
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px',
        }
      );

      scrollElements.forEach((el) => {
        scrollObserver.observe(el);
      });
    }
  } else {
    // Fallback: show everything
    scrollElements.forEach((el) => {
      el.classList.add('visible');
    });
  }

  /* ------------------------------------------
     4. NAVIGATION -- Scrolled State & Active Link
     ------------------------------------------ */
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('.section, .hero');

  // Add scrolled class on scroll (guard against missing nav element)
  if (nav) {
    function handleNavScroll() {
      if (window.scrollY > 50) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // Initial check
  }

  // Active link highlighting
  if (sections.length > 0 && navLinks.length > 0 && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            const hrefMatch = '#' + id;
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === hrefMatch);
            });
          }
        }
      },
      {
        threshold: 0.3,
        rootMargin: '-' + NAV_HEIGHT + 'px 0px -40% 0px',
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* ------------------------------------------
     5. MOBILE HAMBURGER MENU
     ------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('nav-links');

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      navLinksContainer.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click (event delegation on the container)
    navLinksContainer.addEventListener('click', (e) => {
      const link = e.target.closest('.nav__link');
      if (link) {
        closeMobileMenu(hamburger, navLinksContainer);
      }
    });

    // Close menu on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinksContainer.classList.contains('open')) {
        closeMobileMenu(hamburger, navLinksContainer);
        hamburger.focus();
      }
    });

    // Close menu on click outside
    document.addEventListener('click', (e) => {
      if (
        navLinksContainer.classList.contains('open') &&
        !navLinksContainer.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMobileMenu(hamburger, navLinksContainer);
      }
    });
  }

  /* ------------------------------------------
     6. PHILOSOPHY CARDS -- Expand/Collapse
     (Uses event delegation on the grid container)
     ------------------------------------------ */
  const philosophyGrid = document.querySelector('.philosophy__grid');

  if (philosophyGrid) {
    const philosophyCards = philosophyGrid.querySelectorAll('.philosophy__card');

    function togglePhilosophyCard(card) {
      const isExpanded = card.classList.contains('expanded');

      // Close all other cards
      philosophyCards.forEach((other) => {
        if (other !== card) {
          other.classList.remove('expanded');
          other.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle this card
      card.classList.toggle('expanded');
      card.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    }

    // Delegated click handler
    philosophyGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.philosophy__card');
      if (card) {
        togglePhilosophyCard(card);
      }
    });

    // Delegated keyboard handler
    philosophyGrid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.philosophy__card');
        if (card) {
          e.preventDefault();
          togglePhilosophyCard(card);
        }
      }
    });
  }

  /* ------------------------------------------
     7. SMOOTH SCROLL (fallback for older browsers)
     ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      let target = null;
      try {
        target = document.querySelector(targetId);
      } catch (_) {
        // Invalid selector (e.g., href="#123") -- ignore gracefully
        return;
      }

      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
