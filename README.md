# Fluidtech Engineers India Private Limited

A complete static website with 40 pages in the latest supplied reference style. All pages share the original supplied metallic logo, locally hosted Roboto for headings, company lettering and body text, and the supplied reference’s deep blue (#004670), orange (#F29222), bright blue and white palette. Uppercase heavy headings, rounded outline buttons and subtle textured backgrounds follow the reference while preserving the existing template and page layouts.

## Run locally

From this folder run `python3 -m http.server 5173 --directory dist`, then open `http://localhost:5173/`. Use a static web server; opening an individual HTML file directly does not resolve root-relative assets.

## Included pages

Homepage; product catalogue; three product family pages; all nine product detail pages; industry directory and thirteen industry pages; About; Gallery; Clients; Contact; Service and four service pages; Flow Chemistry; Equipment Finder; Compare Equipment.

All product, industry, company, gallery and service links stay within the redesigned website. The catalogue contains locally hosted equipment images and fonts. Finder, gallery filters, comparison selectors, mobile menus and the homepage walkthrough work without a build step.

## Editing

Page content: `dist/**/index.html`. Shared navigation and form behaviour: `dist/common.js`. Homepage interactions: `dist/app.js`. Inner-page interactions: `dist/pages.js`. Catalogue data: `dist/data.js`. Shared layout styles: `dist/identity.css` and `dist/pages.css`. The final visual layer is `dist/brand-theme.css`; edit it to change typography, palette and component finishes without changing the template.

Product specifications are transcribed from the supplied reference catalogue where provided. Confirm configuration, application suitability and final specifications with Fluidtech. No unconfirmed certification claims were added. The Basket Mill model table is retained; its conflicting summary metrics were omitted.

The enquiry form prepares an email draft in the visitor's email application. The visitor reviews and sends the draft; this website does not send enquiries directly. Product, industry and service enquiry links prefill the relevant context.

The homepage footer includes all 29 unique supplied client logos in a seamless scrolling strip, with pause/resume, hover pause and reduced-motion support. The Clients page displays the complete roster in a static responsive grid. Other inner pages do not include the carousel.

Contact forms now contain only Name, Contact (email or phone) and Reason, with validation, expanding reason text and automatic product/service context. The earlier client category tabs were removed; all client logos appear together in the Clients page grid and the homepage footer train.

Client roster: `dist/assets/clients/roster.json` records the 29 original logo assets and source URLs. The 29 identified names are alphabetised (ignoring “The”). The scrolling strip is exclusive to the homepage.

Contact phone numbers open WhatsApp chats using the matching international phone number.

The concise homepage retains the hero, equipment browser, six industry highlights, company/service summary, quick enquiry and client strip. Detailed content remains on the linked inner pages. Home-only spacing is in `dist/home-concise.css`.

The homepage anniversary reads **33 years of manufacturing excellence, since 1993**. The latest supplied Basket Mill and Three Roll Mill images are shared by their catalogue entries, product pages, galleries and related-product cards. Three Roll Mill specifications cover models 75, 93, 150 and 300.

Background gradients and engineering patterns are defined in `dist/surfaces.css`. Homepage equipment images use a light neutral background and image blending to avoid contrasting side bands.

## Hosting

The deployable website is the complete `dist/` folder. There is no build step or package installation. Serve it at the domain root because links and assets use root-relative paths. `.openai/hosting.json` records the existing Sites hosting configuration; it contains no credentials. Pushing this repository does not by itself deploy the website or enable GitHub Pages.

## Languages

English is the primary language and the fallback without JavaScript. The header selector offers English, Deutsch, Español and Français on every page. A visitor's choice is remembered in local storage and carried in internal links as `?lang=de`, `?lang=es` or `?lang=fr`. An explicit URL language takes priority over the saved preference. Browser language does not change the English default.

Translations are local, with no third-party translation service or API key. Edit `dist/locales/de.json`, `es.json` and `fr.json`; keys are the original English text. Then run `node scripts/build-translations.mjs` to rebuild `dist/translations.js`. New or changed English copy needs a corresponding entry in all three dictionaries; unknown text safely falls back to English. Keep model identifiers, measurements, client names, contact details and the legal company name unchanged. Text embedded in photographs and logos remains part of the original image.

`dist/i18n.js` translates page text, titles, descriptions, accessible labels, placeholders and dynamically rendered equipment. User-entered form values are never translated or overwritten. The existing contact form still prepares an email draft for the visitor to send.

Run `python3 scripts/check-translations.py` to check translation coverage and selector presence across the site. Keep `scripts/translation-preserved.json` limited to proper names and identifiers that intentionally remain unchanged. Browser checks cover dynamic product changes, translated search, comparison, URL persistence, English restoration, validation messages, unchanged enquiry input and responsive navigation.
