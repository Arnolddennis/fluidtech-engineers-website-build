(() => {
  document.querySelectorAll('.client-ribbon-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const ribbon = button.closest('.client-ribbon');
      const paused = ribbon.classList.toggle('is-paused');
      button.setAttribute('aria-pressed', String(paused));
      button.setAttribute('aria-label', paused ? 'Resume client logo scrolling' : 'Pause client logo scrolling');
      button.innerHTML = paused ? 'Resume <span aria-hidden="true">▶</span>' : 'Pause <span aria-hidden="true">Ⅱ</span>';
    });
  });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  const groups = [...document.querySelectorAll('.nav-group')];
  const closeDropdowns = () => groups.forEach(group => {
    group.classList.remove('expanded');
    group.querySelector('.nav-expand').setAttribute('aria-expanded', 'false');
  });
  const closeMenu = () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open menu');
    closeDropdowns();
  };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (!open) closeDropdowns();
  });
  groups.forEach(group => group.querySelector('.nav-expand').addEventListener('click', () => {
    const open = !group.classList.contains('expanded');
    closeDropdowns();
    group.classList.toggle('expanded', open);
    group.querySelector('.nav-expand').setAttribute('aria-expanded', String(open));
  }));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const open = menu.getAttribute('aria-expanded') === 'true';
      const expanded = groups.find(group => group.classList.contains('expanded'));
      closeMenu();
      if (open) menu.focus();
      else if (expanded) expanded.querySelector('.nav-expand').focus();
    }
  });
  const progress = document.querySelector('.scroll-progress');
  let scheduled = false;
  const updateProgress = () => {
    const distance = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? scrollY / distance : 0})`;
    scheduled = false;
  };
  addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); } }, {passive:true});
  updateProgress();

  const form = document.getElementById('inquiry-form');
  const reason = form?.elements.namedItem('reason');
  const contact = form?.elements.namedItem('contact');
  const updateReason = () => {
    if (!reason) return;
    reason.style.height = 'auto';
    reason.style.height = Math.min(Math.max(reason.scrollHeight, 78), 160) + 'px';
    document.getElementById('reason-count').textContent = reason.value.length.toLocaleString() + ' / 1,500';
  };
  const updateContact = () => {
    if (!contact) return;
    const value = contact.value.trim();
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const digits = value.replace(/\D/g, '');
    const phone = /^\+?[\d\s().-]+$/.test(value) && digits.length >= 7 && digits.length <= 15;
    contact.setCustomValidity(value && !email && !phone ? 'Please enter an email address or a phone number.' : '');
    document.getElementById('contact-hint').textContent = email ? 'Email address' : phone ? 'Phone number' : 'Email or phone number';
  };
  reason?.addEventListener('input', updateReason);
  contact?.addEventListener('input', updateContact);
  document.addEventListener('click', event => {
    const control = event.target.closest('[data-enquire]');
    if (!control) return;
    event.preventDefault();
    if (!reason) { location.href = '/contact-us/?product=' + encodeURIComponent(control.dataset.enquire); return; }
    if (!reason.value.trim()) reason.value = "I'm interested in " + control.dataset.enquire + '. ';
    updateReason();
    form.scrollIntoView({behavior: reduced ? 'instant' : 'smooth', block: 'center'});
    reason.focus({preventScroll:true});
  });
  if (form) {
    const params = new URLSearchParams(location.search);
    const subject = params.get('product') || params.get('service');
    const industry = params.get('industry');
    if (!reason.value.trim()) {
      if (subject) reason.value = "I'm interested in " + subject.slice(0,250) + '. ';
      else if (industry) reason.value = 'Enquiry for ' + industry.slice(0,250) + ': ';
    }
    updateReason();
    updateContact();
    form.addEventListener('submit', event => {
      event.preventDefault();
      updateContact();
      const name = form.elements.namedItem('name');
      name.setCustomValidity(name.value.trim() ? '' : 'Please enter your name.');
      reason.setCustomValidity(reason.value.trim() ? '' : 'Please tell us the reason for your enquiry.');
      if (!form.reportValidity()) return;
      const body = ['Name: ' + name.value.trim(), 'Contact: ' + contact.value.trim(), '', 'Reason for enquiry:', reason.value.trim()].join('\n');
      location.href = 'mailto:fluidtechindia@gmail.com?subject=' + encodeURIComponent('Fluidtech enquiry — ' + name.value.trim()) + '&body=' + encodeURIComponent(body);
      document.getElementById('form-status').textContent = 'Your email draft is ready to open. Review and send it in your email app. If it does not open, email fluidtechindia@gmail.com.';
    });
    form.addEventListener('input', event => {
      if (event.target === reason || event.target.name === 'name') event.target.setCustomValidity('');
      document.getElementById('form-status').textContent = '';
    });
  }
})();
