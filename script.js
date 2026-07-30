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
  const openPhotoModal = (img) => {
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
    photoModal.classList.add('open');
  };
  const closePhotoModal = () => photoModal.classList.remove('open');
  if (photoModalClose) photoModalClose.addEventListener('click', closePhotoModal);
  if (photoModal) {
    photoModal.addEventListener('click', (e) => {
      if (e.target === photoModal) closePhotoModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePhotoModal();
  });

  // Portfolio gallery — click a photo to expand it in-row, others blur/shrink, then pop it up full-size
  const gallery = document.getElementById('gallery');
  const galleryItems = document.querySelectorAll('#gallery .gallery-item');
  if (gallery) {
    gallery.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      const wasActive = item.classList.contains('active');
      galleryItems.forEach(i => i.classList.remove('active'));
      if (!wasActive) {
        item.classList.add('active');
        const img = item.querySelector('img');
        if (img) openPhotoModal(img);
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
