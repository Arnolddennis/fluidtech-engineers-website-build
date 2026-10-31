# Fluidtech refinement — 31 October 2026

## Library evaluation before implementation
- Radix UI / shadcn-style primitives: preferred accessible foundation if React islands become necessary. https://www.radix-ui.com/primitives/docs/overview/introduction
- Motion for React: preferred React animation option; reduced-motion policy and layout/exit transitions. https://motion.dev/docs/react-use-reduced-motion
- Magic UI: selective components only; its shadcn/Tailwind installation adds a stack the current site does not use. https://magicui.design/docs/installation
- React Bits: useful isolated visual effects, but animated text/backgrounds offer little benefit to technical product selection. https://reactbits.dev/
- GSAP ScrollTrigger: useful for a future engineering walkthrough, unnecessary for present fades. https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Lenis: smooth-scroll option, deferred to retain native touch, anchor, keyboard and browser-history behaviour. https://github.com/darkroomengineering/lenis

Decision: retain the static multi-page architecture, use native controls, CSS transitions and Web Animations with reduced-motion support. No React migration or new runtime dependency for this scope. AI/API explicitly deferred.

## Test-first milestones
Write acceptance cases first, observe the missing behaviour, implement, then pass the focused tests before advancing. Run the full suite before deployment/setup changes.
1. Enquiries: reject invalid/blank/oversized fields, preserve language and product context, prevent duplicate submits, never treat a forged return URL as delivery proof. Mock transport during tests. Live mail test requires a confirmed test customer address and provider spam check/activation.
2. Technical content: rectangular model tables, nine unique products, current uploaded image mapping, source comparison for Basket/Three Roll tables. Record conflicting or missing specifications; do not invent values.
3. Comparison: unique product selections, model-level values, aligned rows retaining units, missing values explicit, differences filter, shareable URL, combined enquiry context.
4. Datasheets: nine searchable, legible PDFs generated from the same catalogue data; complete model tables; honest missing-data notices; product-page download links.
5. Styling/images: responsive image candidates, original aspect ratios and identity, bounded payloads, retained alt text, hero priority, dynamic product image consistency, restrained transitions and reduced-motion fallback.
6. Integration: desktop/tablet/mobile, keyboard navigation, DE/ES/FR, link/asset audit; all passing before publication.

## Verification limits
Source agreement is not engineering certification. Email destination ownership, actual inbox delivery, photo/mechanical accuracy and final specifications need owner confirmation. Existing model values remain unchanged.
