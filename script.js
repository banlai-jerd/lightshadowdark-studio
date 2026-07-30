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

  // Featured strip — click a photo to expand it, others blur/shrink
  const featuredStrip = document.getElementById('featuredStrip');
  if (featuredStrip) {
    const featuredItems = featuredStrip.querySelectorAll('.featured-item');
    featuredStrip.addEventListener('click', (e) => {
      const item = e.target.closest('.featured-item');
      if (!item) return;
      const wasActive = item.classList.contains('active');
      featuredItems.forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  }

  // Portfolio filter tabs
  const filterTabs = document.getElementById('filterTabs');
  const galleryItems = document.querySelectorAll('#gallery .gallery-item');
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
      });
    });
  }

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  document.querySelectorAll('.gallery figure img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
    });
  });
  const closeLightbox = () => lightbox.classList.remove('open');
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
});
