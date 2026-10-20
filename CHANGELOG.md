# [0.21.0](https://github.com/XSaitoKungX/Advanced-Portfolio/compare/v0.20.1...v0.21.0) (2026-10-20)

### Features

* redesign the skills page with a hero section, the new skills mascot and per-category stats and filters
* rebuild the navigation as a floating capsule on scroll with the avatar logo, localized user menu and full ARIA coverage
* rebuild the footer with a brand column, eyebrow headings, localized tagline and a back-to-top control

### Bug Fixes

* replace skill icons removed from react-icons (SiCss3, SiJava, SiVisualstudiocode) so all 27 icons render again
* mark the home page mascot as LCP-preload to remove the eager-loading warning
* use Next Link for internal footer links and point the Astra link at astra-bot.app


# [0.20.1](https://github.com/XSaitoKungX/Advanced-Portfolio/compare/v0.20.0...v0.20.1) (2026-09-29)

### Bug Fixes

* reject bogus `Next-Action` requests in the proxy so scanner probes no longer throw "Failed to find Server Action"


# [0.20.0](https://github.com/XSaitoKungX/Advanced-Portfolio/compare/v0.19.0...v0.20.0) (2026-09-29)

### Features

* redesign the projects page with a hero section, statistics strip and the new projects mascot
* localize project status and category labels for German and English
* filter to used categories with counts and sort featured projects first


# [0.19.0](https://github.com/XSaitoKungX/Advanced-Portfolio/compare/v0.18.0...v0.19.0) (2026-09-25)


### Features

* **ui:** redesign experience & about pages, migrate mascots to webp ([757f63a](https://github.com/XSaitoKungX/Advanced-Portfolio/commit/757f63a9eb9299483ea1992c9cfa08eb557cedd3))



# [0.18.0](https://github.com/XSaitoKungX/Advanced-Portfolio/compare/v0.17.0...v0.18.0) (2026-09-24)

### Features

* add self-service Discord account deletion and deauthorization cleanup
* load live Astra server statistics and add Advanced Modmail project information

### Bug Fixes

* bound and validate contact and guestbook requests; verify database TLS certificates
* return unavailable statistics instead of fabricated fallback values

### Maintenance

* update core dependencies, ESLint, Motion, Bun and CI checks
* remove the discontinued Smart Calendar portfolio page



# [0.17.0](https://github.com/XSaitoKungX/Advanced-Portfolio/compare/v0.16.0...v0.17.0) (2026-05-17)


### Features

* **guestbook:** add delete own entry + improve UX/UI ([270cee3](https://github.com/XSaitoKungX/Advanced-Portfolio/commit/270cee33c01a1224c8eba192339ebdff20ce752d))



# [0.16.0](https://github.com/XSaitoKungX/Advanced-Portfolio/compare/v0.15.0...v0.16.0) (2026-05-04)


### Features

* add /discgen-cli page + i18n translations ([3c69e0a](https://github.com/XSaitoKungX/Advanced-Portfolio/commit/3c69e0a62eb84702b8610477fc99c96f7c8a6be7))



# [0.15.0](https://github.com/XSaitoKungX/Advanced-Portfolio/compare/v0.14.1...v0.15.0) (2026-04-30)


### Features

* **password-generator:** full rewrite with 6 modes ([339890d](https://github.com/XSaitoKungX/Advanced-Portfolio/commit/339890da25fd54874673298908208fd2ee08bd1f))



