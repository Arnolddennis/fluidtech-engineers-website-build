(() => {
  // One consistent state drives the walkthrough buttons, image focus and captions.
  const story = document.querySelector('[data-machine-story]');
  if (story) {
  const notes = {
    chamber: ['01 / 03', 'PROCESS / GRINDING CHAMBER', 'ACTIVE · CHAMBER', '01 / GRINDING CHAMBER'],
    drive: ['02 / 03', 'PROCESS / DRIVE CONFIGURATION', 'ACTIVE · DRIVE', '02 / DRIVE CONFIGURATION'],
    controls: ['03 / 03', 'PROCESS / OPERATING CONTROLS', 'ACTIVE · CONTROLS', '03 / OPERATING CONTROLS']
  };
  const choosePart = id => {
    if (!notes[id]) return;
    story.querySelector('[data-story-frame]').dataset.storyFrame = id;
    ['[data-story-counter]', '[data-story-caption]', '[data-hud-status]', '[data-reticle-label]'].forEach((selector,index) => {
      story.querySelector(selector).textContent = notes[id][index];
    });
    story.querySelectorAll('[data-story-step]').forEach(chapter => chapter.classList.toggle('is-active', chapter.dataset.storyStep === id));
    story.querySelectorAll('[data-story-select]').forEach(button => {
      const selected = button.dataset.storySelect === id;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  };
  story.querySelectorAll('[data-story-select]').forEach(button => button.addEventListener('click', () => choosePart(button.dataset.storySelect)));
  choosePart('chamber');
  }

  const products = window.FLUIDTECH_DATA.products;
  const showcase = document.querySelector('[data-equipment-showcase]');
  if (!showcase) return;
  const list = showcase.querySelector('[data-showcase-list]');
  const tools = list.querySelector('.showcase-tools-card');
  const preview = showcase.querySelector('.showcase-preview-card');
  let family = 'grinding';
  let selected = 'horizontal-bead-mill';
  const showProduct = slug => {
    const item = products.find(product => product.slug === slug);
    if (!item) return;
    selected = slug;
    list.querySelectorAll('[data-showcase-product]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.showcaseProduct === slug)));
    showcase.querySelector('[data-showcase-name]').textContent = item.name;
    showcase.querySelector('[data-showcase-desc]').textContent = item.intro;
    showcase.querySelector('[data-showcase-category]').textContent = item.category;
    showcase.querySelector('[data-showcase-link]').href = item.url;
    const image = showcase.querySelector('[data-showcase-image]');
    image.src = (slug === 'horizontal-bead-mill' && image.dataset.beadMillImage) || item.image;
    image.alt = item.name;
    let enquiry = preview.querySelector('[data-product-enquiry]');
    if (!enquiry) {
      enquiry = document.createElement('button');
      enquiry.type = 'button';
      enquiry.className = 'studio-plain-link';
      enquiry.dataset.productEnquiry = '';
      enquiry.textContent = 'Enquire about this equipment ↗';
      showcase.querySelector('.showcase-preview-details').append(enquiry);
    }
    enquiry.dataset.enquire = item.name;
  };
  const renderEquipment = () => {
    const matches = products.filter(item => item.family === family);
    list.querySelectorAll('[data-showcase-product]').forEach(button => button.remove());
    matches.forEach(item => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'showcase-item'; button.dataset.showcaseProduct = item.slug;
      const number = document.createElement('span'); number.textContent = item.number;
      const text = document.createElement('span'); text.className = 'showcase-item-text';
      const title = document.createElement('strong'); title.textContent = item.name;
      const category = document.createElement('small'); category.textContent = item.category;
      text.append(title, category);
      const arrow = document.createElement('span'); arrow.className = 'showcase-item-arrow'; arrow.textContent = '↗'; arrow.setAttribute('aria-hidden','true');
      button.append(number, text, arrow); list.insertBefore(button, tools);
    });
    preview.hidden = !matches.length;
    showcase.querySelectorAll('[data-family]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.family === family)));
    if (matches.length) showProduct(matches.some(item => item.slug === selected) ? selected : matches[0].slug);
  };
  const selectFamily = value => { family = value; selected = ''; renderEquipment(); };
  showcase.querySelectorAll('[data-family]').forEach(button => button.addEventListener('click', () => selectFamily(button.dataset.family)));
  list.addEventListener('click', event => {
    const button = event.target.closest('[data-showcase-product]');
    if (button) showProduct(button.dataset.showcaseProduct);
  });
  document.querySelectorAll('[data-select-family]').forEach(link => link.addEventListener('click', () => selectFamily(link.dataset.selectFamily)));
  renderEquipment();

})();
