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
  document.querySelectorAll('[data-compare-select]').forEach((select, index) => {
    select.value = products[index].slug;
    const update = () => {
      const product = products.find(p => p.slug === select.value);
      const view = select.closest('.comparison-panel').querySelector('[data-compare-view]');
      view.replaceChildren();
      const img = document.createElement('img'); img.src = product.image; img.alt = product.name; img.width = 1448; img.height = 1086;
      const type = document.createElement('p'); type.className = 'studio-eyebrow'; type.textContent = product.category;
      const title = document.createElement('h3'); title.textContent = product.name;
      const intro = document.createElement('p'); intro.textContent = product.intro;
      const specs = document.createElement('dl'); specs.className = 'technical-list';
      const metrics = product.metrics.length ? product.metrics : [['Specifications', product.models ? 'View the model table on the product page' : 'Available on application review']];
      metrics.forEach(([key, value]) => { const row = document.createElement('div'); const dt = document.createElement('dt'); dt.textContent = key; const dd = document.createElement('dd'); dd.textContent = value; row.append(dt,dd); specs.append(row); });
      const link = document.createElement('a'); link.className = 'text-link'; link.href = product.url; link.textContent = 'View product details ↗';
      view.append(img,type,title,intro,specs,link);
    };
    select.addEventListener('change', update); update();
  });
})();
