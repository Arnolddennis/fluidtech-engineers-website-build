(() => {
  const products = window.FLUIDTECH_DATA.products;
  const finder = document.getElementById('finder-results');
  if (finder) {
    const family = document.getElementById('finder-family');
    const query = document.getElementById('finder-query');
    const update = () => {
      let count = 0;
      const search = query.value.trim().toLowerCase();
      finder.querySelectorAll('.product-card').forEach(card => {
        const match = (family.value === 'all' || card.dataset.family === family.value) && (card.dataset.name + ' ' + card.textContent).toLowerCase().includes(search);
        card.hidden = !match;
        if (match) count++;
      });
      document.getElementById('finder-status').textContent = `${count} ${count === 1 ? 'machine' : 'machines'} matching your selection`;
      document.getElementById('finder-empty').hidden = count !== 0;
    };
    family.addEventListener('change', update);
    query.addEventListener('input', update);
    update();
  }
  document.querySelectorAll('[data-gallery-filter]').forEach(button => button.addEventListener('click', () => {
    let count = 0;
    document.querySelectorAll('[data-gallery-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    document.querySelectorAll('[data-gallery-family]').forEach(card => { card.hidden = button.dataset.galleryFilter !== 'all' && card.dataset.galleryFamily !== button.dataset.galleryFilter; if (!card.hidden) count++; });
    document.querySelector('[data-gallery-count]').textContent = `${count} ${count === 1 ? 'machine' : 'machines'}`;
  }));

})();
