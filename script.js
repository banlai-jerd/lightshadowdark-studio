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
});
