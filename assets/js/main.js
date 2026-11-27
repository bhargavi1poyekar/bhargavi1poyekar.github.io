// Small, dependency-free behaviour: mobile menu, theme toggle, active nav link.
(() => {
  const root = document.documentElement;

  /* ----- Mobile menu ----- */
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');

  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ----- Theme (initial value is set inline in <head> to avoid a flash) ----- */
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    if (dark) root.dataset.theme = 'dark'; else delete root.dataset.theme;
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) { /* private mode */ }
  });

  /* ----- Highlight the nav link of the section in view ----- */
  const links = new Map(
    [...document.querySelectorAll('.nav__link')].map((a) => [a.getAttribute('href').slice(1), a])
  );
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = links.get(entry.target.id);
      if (link && entry.isIntersecting) {
        links.forEach((l) => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => observer.observe(s));

  /* ----- Footer year ----- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
