(() => {
  const items = Array.from(document.querySelectorAll('.projects > .project'));
  if (!('IntersectionObserver' in window) || !items.length) {
    // Fallback: just show everything
    items.forEach(el => el.classList.add('in-view'));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Unobserve after revealing to keep it snappy
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px', // start a bit before fully centered
    threshold: 0.15
  });

  items.forEach(el => obs.observe(el));
})();