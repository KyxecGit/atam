/* ========================================
   ATAM МЕБЕЛЬ — V4 SCRIPTS
   Custom cursor, drag scroll, magnetic,
   lightbox, reveals, counters, FAQ, form
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- LOADER ---- */
  const loader = document.getElementById('loader');
  const loaderCounter = document.getElementById('loader-counter');
  let count = 0;
  const loaderInterval = setInterval(() => {
    count += Math.floor(Math.random() * 4) + 1;
    if (count >= 100) {
      count = 100;
      clearInterval(loaderInterval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initRevealAnimations();
        initCounters();
      }, 400);
    }
    loaderCounter.textContent = count;
  }, 30);
  document.body.style.overflow = 'hidden';

  /* ---- CUSTOM CURSOR ---- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;

  if (cursor && follower && window.innerWidth > 480) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      followerX += (mouseX - followerX) * 0.08;
      followerY += (mouseY - followerY) * 0.08;

      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover state
    const hoverTargets = document.querySelectorAll('a, button, [data-magnetic], .drag-gallery__item, .masonry__item, .services__card');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ---- MAGNETIC BUTTONS ---- */
  const magnetics = document.querySelectorAll('[data-magnetic]');
  magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  /* ---- HEADER SCROLL ---- */
  const header = document.getElementById('header');
  const backTop = document.getElementById('back-top');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (sy > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (sy > 600) {
      backTop.classList.add('visible');
    } else {
      backTop.classList.remove('visible');
    }
  });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- BURGER / MOBILE MENU ---- */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* ---- DRAG SCROLL GALLERY ---- */
  const dragTrack = document.getElementById('drag-track');
  if (dragTrack) {
    let isDown = false;
    let startX;
    let scrollLeft;

    dragTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      dragTrack.classList.add('dragging');
      startX = e.pageX - dragTrack.offsetLeft;
      scrollLeft = dragTrack.scrollLeft;
    });

    dragTrack.addEventListener('mouseleave', () => {
      isDown = false;
      dragTrack.classList.remove('dragging');
    });

    dragTrack.addEventListener('mouseup', () => {
      isDown = false;
      dragTrack.classList.remove('dragging');
    });

    dragTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - dragTrack.offsetLeft;
      const walk = (x - startX) * 2;
      dragTrack.scrollLeft = scrollLeft - walk;
    });
  }

  /* ---- LIGHTBOX ---- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');

  const lightboxItems = document.querySelectorAll('[data-src]');
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const src = lightboxItems[index].getAttribute('data-src');
    lightboxImg.src = src;
    lightboxCounter.textContent = `${index + 1} / ${lightboxItems.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % lightboxItems.length;
    openLightbox(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + lightboxItems.length) % lightboxItems.length;
    openLightbox(currentIndex);
  }

  lightboxItems.forEach((item, i) => {
    item.addEventListener('click', (e) => {
      // Don't open lightbox if we were dragging
      if (dragTrack && dragTrack.classList.contains('dragging')) return;
      openLightbox(i);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevSlide);
  lightboxNext.addEventListener('click', nextSlide);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  /* ---- FAQ ACCORDION ---- */
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all
      document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('active'));
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* ---- REVEAL ANIMATIONS ---- */
  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  /* ---- COUNTER ANIMATION ---- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(eased * target);
      
      el.textContent = current + (target >= 100 ? '+' : '');
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + (target >= 100 ? '+' : '');
      }
    }

    requestAnimationFrame(update);
  }

  /* ---- TILT EFFECT ON CARDS ---- */
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -5;
      const rotateY = (x - centerX) / centerX * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- FORM SUBMIT ---- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.classList.add('success');
      setTimeout(() => {
        form.classList.remove('success');
        form.reset();
      }, 4000);
    });
  }

  /* ---- PARALLAX HERO IMAGE ---- */
  const heroMain = document.querySelector('.hero__image--main');
  if (heroMain && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      if (sy < window.innerHeight) {
        heroMain.style.transform = `scale(${1 + sy * 0.0003}) translateY(${sy * 0.1}px)`;
      }
    });
  }

});
