// LIGHT SHADOW DARK STUDIO — site interactions

document.addEventListener('DOMContentLoaded', () => {
  // Header background on scroll
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  };
  onScroll();
  window.addEventListener('scroll', onScroll);

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  // Floating side nav — highlight the section in view
  const sideNavItems = document.querySelectorAll('.side-nav-item');
  if (sideNavItems.length) {
    const sections = Array.from(sideNavItems)
      .map(item => document.getElementById(item.dataset.section))
      .filter(Boolean);
    const setActive = (id) => {
      sideNavItems.forEach(item => item.classList.toggle('active', item.dataset.section === id));
    };
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: '-40% 0px -40% 0px' });
    sections.forEach(section => observer.observe(section));
  }

  // Photo pop-up modal
  const photoModal = document.getElementById('photoModal');
  const photoModalImg = document.getElementById('photoModalImg');
  const photoModalClose = document.getElementById('photoModalClose');
  const photoModalPrev = document.getElementById('photoModalPrev');
  const photoModalNext = document.getElementById('photoModalNext');
  const galleryItems = document.querySelectorAll('#gallery .gallery-item');
  let currentGalleryItem = null;

  const showImage = (img) => {
    const fullSrc = img.dataset.full;
    photoModalImg.onerror = null;
    if (fullSrc) {
      photoModalImg.onerror = () => {
        photoModalImg.onerror = null;
        photoModalImg.src = img.src;
      };
      photoModalImg.src = fullSrc;
    } else {
      photoModalImg.src = img.src;
    }
    photoModalImg.alt = img.alt;
  };
  const openPhotoModal = (item) => {
    currentGalleryItem = item;
    galleryItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    showImage(item.querySelector('img'));
    photoModal.classList.add('open');
  };
  const closePhotoModal = () => photoModal.classList.remove('open');
  const navigatePhotoModal = (dir) => {
    if (!currentGalleryItem) return;
    const visible = Array.from(galleryItems).filter(i => i.classList.contains('is-visible'));
    const idx = visible.indexOf(currentGalleryItem);
    if (idx === -1) return;
    const nextIdx = (idx + dir + visible.length) % visible.length;
    openPhotoModal(visible[nextIdx]);
  };
  if (photoModalClose) photoModalClose.addEventListener('click', closePhotoModal);
  if (photoModalPrev) photoModalPrev.addEventListener('click', () => navigatePhotoModal(-1));
  if (photoModalNext) photoModalNext.addEventListener('click', () => navigatePhotoModal(1));
  if (photoModal) {
    photoModal.addEventListener('click', (e) => {
      if (e.target === photoModal) closePhotoModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (!photoModal.classList.contains('open')) return;
    if (e.key === 'Escape') closePhotoModal();
    if (e.key === 'ArrowLeft') navigatePhotoModal(-1);
    if (e.key === 'ArrowRight') navigatePhotoModal(1);
  });

  // Portfolio gallery — click a photo to expand it in-row, others blur/shrink, then pop it up full-size
  const gallery = document.getElementById('gallery');
  if (gallery) {
    gallery.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      const wasActive = item.classList.contains('active');
      if (wasActive) {
        galleryItems.forEach(i => i.classList.remove('active'));
        closePhotoModal();
      } else {
        openPhotoModal(item);
      }
    });
  }

  // Portfolio filter tabs — swap which category shows in the gallery strip
  const filterTabs = document.getElementById('filterTabs');
  if (filterTabs) {
    filterTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      filterTabs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.cat === filter;
        item.classList.toggle('is-visible', show);
        if (!show) item.classList.remove('active');
      });
      gallery.scrollLeft = 0;
    });
  }

  // Floating orb — space-junk physics: drifts, bounces off the browser edges,
  // and tumbles on all three axes with no repeating pattern
  const floatingOrb = document.getElementById('floatingOrb');
  const floatingCard = document.getElementById('comingSoonCard');
  if (floatingOrb && floatingCard) {
    let w = floatingOrb.offsetWidth || 350;
    let h = floatingOrb.offsetHeight || 280;
    let x = Math.random() * Math.max(0, window.innerWidth - w);
    let y = Math.random() * Math.max(0, window.innerHeight - h);
    const speed = 0.5 + Math.random() * 0.4;
    const angle = Math.random() * Math.PI * 2;
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;

    let rx = Math.random() * 360;
    let ry = Math.random() * 360;
    let rz = Math.random() * 360;
    let wx = (Math.random() - 0.5) * 0.6;
    let wy = (Math.random() - 0.5) * 0.6;
    let wz = (Math.random() - 0.5) * 0.6;
    const jolt = () => (Math.random() - 0.5) * 1.2;

    const step = () => {
      w = floatingOrb.offsetWidth;
      h = floatingOrb.offsetHeight;
      x += vx;
      y += vy;
      if (x <= 0) { x = 0; vx = Math.abs(vx); wy += jolt(); wz += jolt(); }
      else if (x + w >= window.innerWidth) { x = window.innerWidth - w; vx = -Math.abs(vx); wy += jolt(); wz += jolt(); }
      if (y <= 0) { y = 0; vy = Math.abs(vy); wx += jolt(); wz += jolt(); }
      else if (y + h >= window.innerHeight) { y = window.innerHeight - h; vy = -Math.abs(vy); wx += jolt(); wz += jolt(); }
      floatingOrb.style.left = x + 'px';
      floatingOrb.style.top = y + 'px';

      // slow random drift in spin speed so the tumble never settles into a loop
      wx += (Math.random() - 0.5) * 0.015;
      wy += (Math.random() - 0.5) * 0.015;
      wz += (Math.random() - 0.5) * 0.015;
      wx = Math.max(-1.2, Math.min(1.2, wx));
      wy = Math.max(-1.2, Math.min(1.2, wy));
      wz = Math.max(-1.2, Math.min(1.2, wz));
      rx += wx;
      ry += wy;
      rz += wz;
      floatingCard.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;

      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Pip-Boy terminal overlay — opens full-screen when the floating orb is clicked
  const comingSoonCard = document.getElementById('comingSoonCard');
  const pipboyOverlay = document.getElementById('pipboyOverlay');
  const pipboyClose = document.getElementById('pipboyClose');
  const closePipboy = () => pipboyOverlay && pipboyOverlay.classList.remove('open');
  if (comingSoonCard && pipboyOverlay) {
    comingSoonCard.addEventListener('click', () => pipboyOverlay.classList.add('open'));
  }
  if (pipboyClose) pipboyClose.addEventListener('click', closePipboy);
  if (pipboyOverlay) {
    pipboyOverlay.addEventListener('click', (e) => {
      if (e.target === pipboyOverlay) closePipboy();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pipboyOverlay && pipboyOverlay.classList.contains('open')) closePipboy();
  });
});
