(() => {
  const t = text => window.FluidtechI18n?.t(text) || text;
  const enquiryText = subject => t("I'm interested in") + " " + t(subject) + ". ";
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
    // Override hover/focus-within until the visitor deliberately reopens the menu.
    group.classList.add('escape-closed');
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
  groups.forEach(group => {
    const reopen = () => group.classList.remove('escape-closed');
    group.addEventListener('pointerenter', reopen);
    group.addEventListener('focusin', event => {
      if (!group.contains(event.relatedTarget)) reopen();
    });
    group.querySelector('.nav-expand').addEventListener('click', () => {
      const open = !group.classList.contains('expanded');
      closeDropdowns();
      group.classList.toggle('expanded', open);
      if (open) reopen();
      group.querySelector('.nav-expand').setAttribute('aria-expanded', String(open));
    });
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const open = menu.getAttribute('aria-expanded') === 'true';
      const expanded = groups.find(group => group.contains(document.activeElement)) || groups.find(group => group.classList.contains('expanded'));
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
  const contact = form?.elements.namedItem('email');
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
    contact.setCustomValidity(value && !email ? t('Please enter a valid email address.') : '');
  };
  document.addEventListener('fluidtech:languagechange', () => {
    updateContact();
    const name = form?.elements.namedItem('name');
    if (name?.validity.customError) name.setCustomValidity(t('Please enter your name.'));
    if (reason?.validity.customError) reason.setCustomValidity(t('Please tell us the reason for your enquiry.'));
  });
  reason?.addEventListener('input', updateReason);
  contact?.addEventListener('input', updateContact);
  document.addEventListener('click', event => {
    const control = event.target.closest('[data-enquire]');
    if (!control) return;
    event.preventDefault();
    if (!reason) { location.href = '/contact-us/?product=' + encodeURIComponent(control.dataset.enquire) + '&lang=' + (window.FluidtechI18n?.language || 'en'); return; }
    if (!reason.value.trim()) reason.value = enquiryText(control.dataset.enquire);
    updateReason();
    form.scrollIntoView({behavior: reduced ? 'instant' : 'smooth', block: 'center'});
    reason.focus({preventScroll:true});
  });
  if (form) {
    const params = new URLSearchParams(location.search);
    const status = document.getElementById('form-status');
    const submitButton = form.querySelector('button[type="submit"]');
    let submitting = false;
    let pending;
    try { pending = sessionStorage.getItem('fluidtech-enquiry-pending'); sessionStorage.removeItem('fluidtech-enquiry-pending'); } catch (_) {}
    if (window.FluidtechEnquiry.isReturn(location.search, pending, Date.now())) {
      status.textContent = 'You have returned from the enquiry service. Please check your inbox and spam folder for an acknowledgement, or contact us directly if it does not arrive.';
      const cleanUrl = new URL(location.href);
      cleanUrl.searchParams.delete('submitted');
      history.replaceState(null, '', cleanUrl);
    }
    const subject = params.get('product') || params.get('service');
    const industry = params.get('industry');
    if (!reason.value.trim()) {
      if (subject) reason.value = enquiryText(subject.slice(0,250));
      else if (industry) reason.value = t('Enquiry for') + ' ' + t(industry.slice(0,250)) + ': ';
    }
    updateReason();
    updateContact();
    form.addEventListener('submit', event => {
      if (submitting) { event.preventDefault(); return; }
      updateContact();
      const name = form.elements.namedItem('name');
      const checked = window.FluidtechEnquiry.validate({name:name.value,email:contact.value,reason:reason.value});
      for (const [key, field] of Object.entries({name, email:contact, reason})) field.setCustomValidity(t(checked.errors[key] || ''));
      if (!checked.valid || !form.reportValidity()) { event.preventDefault(); form.reportValidity(); return; }
      name.value = checked.values.name; contact.value = checked.values.email; reason.value = checked.values.reason;
      const language = window.FluidtechI18n?.language || 'en';
      form.elements.namedItem('_next').value = window.FluidtechEnquiry.returnUrl(location.origin, language);
      try { sessionStorage.setItem('fluidtech-enquiry-pending', String(Date.now())); } catch (_) {}
      form.elements.namedItem('_autoresponse').value = t('Thank you for contacting Fluidtech Engineers India Private Limited. We have received your enquiry. Our team will review your requirements and reply to you. For urgent enquiries, email fluidtechindia@gmail.com or WhatsApp +91 75400 40091.');
      form.elements.namedItem('page').value = location.origin + location.pathname;
      form.elements.namedItem('language').value = language;
      submitting = true;
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
      status.textContent = 'Complete the spam check on the next screen to send your enquiry.';
      // Use a normal POST: FormSubmit customer acknowledgements require its spam check
      // and are not supported by AJAX submissions. Never report delivery before its return.
    });
    window.addEventListener('pageshow', () => {
      submitting = false;
      submitButton.disabled = false;
      submitButton.textContent = 'Send enquiry ↗';
      if (!params.has('submitted')) status.textContent = '';
    });
    form.addEventListener('input', event => {
      if (event.target === reason || event.target.name === 'name') event.target.setCustomValidity('');
      document.getElementById('form-status').textContent = '';
    });
  }
})();
