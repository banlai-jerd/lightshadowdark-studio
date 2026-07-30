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

  // Portfolio gallery — click a photo to expand it, others blur/shrink
  const gallery = document.getElementById('gallery');
  const galleryItems = document.querySelectorAll('#gallery .gallery-item');
  if (gallery) {
    gallery.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      const wasActive = item.classList.contains('active');
      galleryItems.forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
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
