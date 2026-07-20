(function () {
  'use strict';

  const PHONE_NUMBER = '+917045292099';
  const PHONE_DISPLAY = '+91 70452 92099';
  const WHATSAPP_URL = 'https://wa.me/917045292099?text=';

  /* Resolve against this script's URL so GitHub Pages project paths work */
  var ASSET_BASE = (function () {
    var current = document.currentScript;
    var src = current && current.src ? current.src : window.location.href;
    return src.replace(/[?#].*$/, '').replace(/[^/]+$/, '');
  })();

  function assetUrl(file) {
    return ASSET_BASE + file;
  }

  /* Edit image filenames here — files live in Assets/ */
  const GYM_IMAGES = [
    { src: assetUrl('Assets/img1.png'), alt: 'HM Fitness gym — training area' },
    { src: assetUrl('Assets/img2.png'), alt: 'HM Fitness gym — equipment zone' },
    { src: assetUrl('Assets/img3.png'), alt: 'HM Fitness gym — workout space' },
    { src: assetUrl('Assets/img4.png'), alt: 'HM Fitness gym — fitness floor' },
    { src: assetUrl('Assets/img5.png'), alt: 'HM Fitness gym — member area' }
  ];

  /* ── Mobile detection ── */
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      || (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);
  }

  /* ── Reusable slider ── */
  function initSlider(config) {
    var track = document.getElementById(config.trackId);
    var prevBtn = document.getElementById(config.prevId);
    var nextBtn = document.getElementById(config.nextId);
    var dotsContainer = document.getElementById(config.dotsId);
    var sliderEl = document.getElementById(config.sliderId);

    if (!track || !sliderEl || !GYM_IMAGES.length) return null;

    GYM_IMAGES.forEach(function (image, i) {
      var slide = document.createElement('div');
      slide.className = 'slider__slide';
      slide.setAttribute('aria-hidden', i !== 0);

      var img = document.createElement('img');
      img.src = image.src;
      img.alt = image.alt;
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';
      slide.appendChild(img);
      track.appendChild(slide);
    });

    var slides = track.querySelectorAll('.slider__slide');
    var currentSlide = 0;
    var autoplayInterval;
    var AUTOPLAY_DELAY = config.delay || 4000;
    var dots = [];

    if (dotsContainer) {
      GYM_IMAGES.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider__dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.setAttribute('role', 'tab');
        dot.addEventListener('click', function () {
          goToSlide(i);
          resetAutoplay();
        });
        dotsContainer.appendChild(dot);
      });
      dots = dotsContainer.querySelectorAll('.slider__dot');
    }

    function goToSlide(index) {
      currentSlide = (index + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';

      slides.forEach(function (slide, i) {
        slide.setAttribute('aria-hidden', i !== currentSlide);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentSlide);
      });

      if (config.onSlideChange) config.onSlideChange(currentSlide);
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); resetAutoplay(); });

    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    if (config.autoplay !== false) {
      sliderEl.addEventListener('mouseenter', function () { clearInterval(autoplayInterval); });
      sliderEl.addEventListener('mouseleave', startAutoplay);
      sliderEl.addEventListener('touchstart', function () { clearInterval(autoplayInterval); }, { passive: true });
      sliderEl.addEventListener('touchend', function () { resetAutoplay(); });
      startAutoplay();
    }

    return { goToSlide: goToSlide };
  }

  /* ── Gallery grid ── */
  function buildGalleryGrid(gallerySlider) {
    var grid = document.getElementById('galleryGrid');
    if (!grid) return;

    GYM_IMAGES.forEach(function (image, i) {
      var item = document.createElement('button');
      item.type = 'button';
      item.className = 'gallery-grid__item';
      item.setAttribute('aria-label', 'View ' + image.alt);

      var img = document.createElement('img');
      img.src = image.src;
      img.alt = image.alt;
      img.loading = 'lazy';
      img.decoding = 'async';
      item.appendChild(img);

      item.addEventListener('click', function () {
        if (gallerySlider) gallerySlider.goToSlide(i);
        document.getElementById('gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      grid.appendChild(item);
    });
  }

  /* ── Sliders & gallery (init first so a later error cannot block images) ── */
  initSlider({
    trackId: 'heroSliderTrack',
    prevId: 'heroSliderPrev',
    nextId: 'heroSliderNext',
    dotsId: 'heroSliderDots',
    sliderId: 'heroSlider',
    delay: 4500
  });

  var gallerySlider = initSlider({
    trackId: 'gallerySliderTrack',
    prevId: 'gallerySliderPrev',
    nextId: 'gallerySliderNext',
    dotsId: 'gallerySliderDots',
    sliderId: 'gallerySlider',
    delay: 5000
  });

  buildGalleryGrid(gallerySlider);

  /* ── Navbar ── */
  var navbar = document.getElementById('navbar');
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('navbar--scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Call Us button ── */
  var callModal = document.getElementById('callModal');
  var callModalBackdrop = document.getElementById('callModalBackdrop');
  var callModalClose = document.getElementById('callModalClose');
  var copyPhoneBtn = document.getElementById('copyPhoneBtn');
  var copyFeedback = document.getElementById('copyFeedback');

  function openCallModal() {
    if (!callModal) return;
    callModal.classList.add('active');
    callModal.setAttribute('aria-hidden', 'false');
    if (copyFeedback) copyFeedback.textContent = '';
  }

  function closeCallModal() {
    if (!callModal) return;
    callModal.classList.remove('active');
    callModal.setAttribute('aria-hidden', 'true');
  }

  function handleCallClick() {
    if (isMobileDevice()) {
      window.location.href = 'tel:' + PHONE_NUMBER;
    } else {
      openCallModal();
    }
  }

  ['callBtnNav', 'callBtnHero', 'callBtnContact'].forEach(function (id) {
    var btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', handleCallClick);
  });

  if (callModalClose) callModalClose.addEventListener('click', closeCallModal);
  if (callModalBackdrop) callModalBackdrop.addEventListener('click', closeCallModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && callModal && callModal.classList.contains('active')) {
      closeCallModal();
    }
  });

  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(PHONE_DISPLAY).then(function () {
        if (copyFeedback) copyFeedback.textContent = 'Number copied to clipboard!';
        setTimeout(function () { if (copyFeedback) copyFeedback.textContent = ''; }, 2500);
      }).catch(function () {
        if (copyFeedback) copyFeedback.textContent = PHONE_DISPLAY;
      });
    });
  }

  /* ── Jump nav active state ── */
  var jumpLinks = document.querySelectorAll('.jump-nav__link');
  var sections = ['about', 'plans', 'gallery', 'contact'];

  function updateActiveNav() {
    if (!navbar) return;
    var scrollPos = window.scrollY + navbar.offsetHeight + 80;
    var current = sections[0];

    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= scrollPos) {
        current = id;
      }
    });

    jumpLinks.forEach(function (link) {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ── Scroll animations ── */
  var fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Contact form → WhatsApp ── */
  var contactForm = document.getElementById('contactForm');

  function validateField(id, errorId, message) {
    var field = document.getElementById(id);
    var error = document.getElementById(errorId);
    var valid = field.value.trim() !== '';

    if (id === 'email') {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      message = 'Please enter a valid email address.';
    }

    if (id === 'phone') {
      valid = /^[\d\s+\-()]{7,15}$/.test(field.value.trim());
      message = 'Please enter a valid phone number.';
    }

    field.classList.toggle('invalid', !valid);
    error.textContent = valid ? '' : message;
    return valid;
  }

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameValid = validateField('name', 'nameError', 'Name is required.');
    var phoneValid = validateField('phone', 'phoneError', 'Phone is required.');
    var emailValid = validateField('email', 'emailError', 'Email is required.');

    if (!nameValid || !phoneValid || !emailValid) return;

    var name = document.getElementById('name').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var email = document.getElementById('email').value.trim();
    var goal = document.getElementById('goal').value;
    var message = document.getElementById('message').value.trim();

    var text = 'Hi HM Fitness! I would like to inquire about membership.\n\n';
    text += '*Name:* ' + name + '\n';
    text += '*Phone:* ' + phone + '\n';
    text += '*Email:* ' + email + '\n';
    if (goal) text += '*Fitness Goal:* ' + goal + '\n';
    if (message) text += '*Message:* ' + message + '\n';

    window.open(WHATSAPP_URL + encodeURIComponent(text), '_blank');
  });

  ['name', 'phone', 'email'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', function () {
      this.classList.remove('invalid');
      document.getElementById(id + 'Error').textContent = '';
    });
  });

})();
