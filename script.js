(function () {
  'use strict';

  const PHONE_NUMBER = '+917597978719';
  const PHONE_DISPLAY = '+91 75979 78719';
  const WHATSAPP_URL = 'https://wa.me/917597978719?text=';
  const WHATSAPP_ENQUIRY_MESSAGE = 'Hi HM Fitness! I would like to enquire about the gym and membership options.';

  /* Resolve against this script's URL so GitHub Pages project paths work */
  var ASSET_BASE = (function () {
    var current = document.currentScript;
    var src = current && current.src ? current.src : window.location.href;
    return src.replace(/[?#].*$/, '').replace(/[^/]+$/, '');
  })();

  function assetUrl(file) {
    return ASSET_BASE + file;
  }

  /* Gym premises photos shared by the hero slider and gallery */
  const GYM_IMAGES = [
    { src: assetUrl('Assets/Images/gym-premises/img_1.jpeg'), alt: 'HM Fitness gym premises photo 1' },
    { src: assetUrl('Assets/Images/gym-premises/img_2.jpeg'), alt: 'HM Fitness gym premises photo 2' },
    { src: assetUrl('Assets/Images/gym-premises/img_3.jpeg'), alt: 'HM Fitness gym premises photo 3' },
    { src: assetUrl('Assets/Images/gym-premises/img_4.jpeg'), alt: 'HM Fitness gym premises photo 4' },
    { src: assetUrl('Assets/Images/gym-premises/img_5.jpeg'), alt: 'HM Fitness gym premises photo 5' },
    { src: assetUrl('Assets/Images/gym-premises/img_6.jpeg'), alt: 'HM Fitness gym premises photo 6' },
    { src: assetUrl('Assets/Images/gym-premises/img_7.jpeg'), alt: 'HM Fitness gym premises photo 7' },
    { src: assetUrl('Assets/Images/gym-premises/img_8.jpeg'), alt: 'HM Fitness gym premises photo 8' },
    { src: assetUrl('Assets/Images/gym-premises/img_9.jpeg'), alt: 'HM Fitness gym premises photo 9' },
    { src: assetUrl('Assets/Images/gym-premises/img_10.jpeg'), alt: 'HM Fitness gym premises photo 10' },
    { src: assetUrl('Assets/Images/gym-premises/img_11.jpeg'), alt: 'HM Fitness gym premises photo 11' },
    { src: assetUrl('Assets/Images/gym-premises/img_12.jpeg'), alt: 'HM Fitness gym premises photo 12' }
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
    var images = config.images || GYM_IMAGES;

    if (!track || !sliderEl) return null;

    if (!track.children.length) {
      if (!images.length) return null;
      images.forEach(function (image, i) {
        var slide = document.createElement('div');
        slide.className = 'slider__slide';
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute('aria-label', 'Slide ' + (i + 1) + ' of ' + images.length);
        slide.setAttribute('aria-hidden', i !== 0);

        var img = document.createElement('img');
        img.src = image.src;
        img.alt = image.alt;
        img.loading = i === 0 ? 'eager' : 'lazy';
        img.decoding = 'async';
        slide.appendChild(img);
        track.appendChild(slide);
      });
    }

    var slides = track.querySelectorAll('.slider__slide');
    if (!slides.length) return null;

    var slideCount = slides.length;
    var currentSlide = 0;
    var autoplayTimer = null;
    var AUTOPLAY_DELAY = config.delay || 5000;
    var dots = [];
    var isPaused = false;
    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (dotsContainer) {
      for (var d = 0; d < slideCount; d++) {
        (function (index) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'slider__dot' + (index === 0 ? ' active' : '');
          dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
          dot.setAttribute('role', 'tab');
          if (index === 0) dot.setAttribute('aria-current', 'true');
          dot.addEventListener('click', function () {
            goToSlide(index);
            resetAutoplay();
          });
          dotsContainer.appendChild(dot);
        })(d);
      }
      dots = dotsContainer.querySelectorAll('.slider__dot');
    }

    function goToSlide(index) {
      currentSlide = ((index % slideCount) + slideCount) % slideCount;
      track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';

      for (var i = 0; i < slideCount; i++) {
        slides[i].setAttribute('aria-hidden', i !== currentSlide);
      }

      for (var j = 0; j < dots.length; j++) {
        var isActive = j === currentSlide;
        dots[j].classList.toggle('active', isActive);
        if (isActive) {
          dots[j].setAttribute('aria-current', 'true');
        } else {
          dots[j].removeAttribute('aria-current');
        }
      }

      if (config.onSlideChange) config.onSlideChange(currentSlide);
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function stopAutoplay() {
      if (autoplayTimer !== null) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function startAutoplay() {
      stopAutoplay();
      if (prefersReducedMotion || isPaused) return;
      autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); resetAutoplay(); });

    if (config.autoplay !== false) {
      sliderEl.addEventListener('pointerenter', function () {
        isPaused = true;
        stopAutoplay();
      });
      sliderEl.addEventListener('pointerleave', function () {
        isPaused = false;
        startAutoplay();
      });
      startAutoplay();
    }

    if (config.keyboard) {
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        var active = document.activeElement;
        if (active && /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)) return;
        var focusedInside = sliderEl === active || sliderEl.contains(active);
        if (!focusedInside && !isPaused) return;
        e.preventDefault();
        if (e.key === 'ArrowLeft') prevSlide();
        else nextSlide();
        resetAutoplay();
      });
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
    trackId: 'bannerSliderTrack',
    prevId: 'bannerSliderPrev',
    nextId: 'bannerSliderNext',
    dotsId: 'bannerSliderDots',
    sliderId: 'bannerSlider',
    delay: 6000,
    keyboard: true
  });

  initSlider({
    trackId: 'heroSliderTrack',
    prevId: 'heroSliderPrev',
    nextId: 'heroSliderNext',
    dotsId: 'heroSliderDots',
    sliderId: 'heroSlider',
    delay: 6000
  });

  var gallerySlider = initSlider({
    trackId: 'gallerySliderTrack',
    prevId: 'gallerySliderPrev',
    nextId: 'gallerySliderNext',
    dotsId: 'gallerySliderDots',
    sliderId: 'gallerySlider',
    delay: 6000
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

  /* ── WhatsApp chat widget ── */
  var whatsappWidgetButton = document.getElementById('whatsappWidgetButton');
  var whatsappWidgetMessage = document.getElementById('whatsappWidgetMessage');

  if (whatsappWidgetButton) {
    var whatsappPhone = PHONE_NUMBER.replace(/\D/g, '');
    var whatsappText = encodeURIComponent(WHATSAPP_ENQUIRY_MESSAGE);

    if (isMobileDevice()) {
      whatsappWidgetButton.href = 'whatsapp://send?phone=' + whatsappPhone + '&text=' + whatsappText;
    } else {
      whatsappWidgetButton.href = 'https://web.whatsapp.com/send?phone=' + whatsappPhone + '&text=' + whatsappText;
      whatsappWidgetButton.target = '_blank';
      whatsappWidgetButton.rel = 'noopener noreferrer';
    }
  }

  if (whatsappWidgetMessage) {
    setTimeout(function () {
      whatsappWidgetMessage.classList.add('whatsapp-widget__message--hidden');
      whatsappWidgetMessage.setAttribute('aria-hidden', 'true');
    }, 5000);
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

  /* ── Floating WhatsApp Button (Mobile vs Desktop) ── */
  var whatsappBtn = document.getElementById('whatsapp-btn');
  if (whatsappBtn) {
    var WA_NUMBER = '917597978719';
    var WA_MSG = 'Hi HM Fitness! I would like to inquire about membership and training programs.';
    var encodedMsg = encodeURIComponent(WA_MSG);

    var mobileUrl = 'whatsapp://send?phone=' + WA_NUMBER + '&text=' + encodedMsg;
    var webUrl = 'https://web.whatsapp.com/send?phone=' + WA_NUMBER + '&text=' + encodedMsg;
    var fallbackUrl = 'https://wa.me/' + WA_NUMBER + '?text=' + encodedMsg;

    // Set initial href for crawlers/direct clicks
    if (isMobileDevice()) {
      whatsappBtn.href = mobileUrl;
    } else {
      whatsappBtn.href = webUrl;
    }

    whatsappBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (isMobileDevice()) {
        // Try opening native WhatsApp app with fallback to web/wa.me
        window.location.href = mobileUrl;
        setTimeout(function () {
          window.location.href = fallbackUrl;
        }, 1200);
      } else {
        window.open(webUrl, '_blank', 'noopener,noreferrer');
      }
    });
  }

})();
