# Amrit’s Little World

A whimsical, interactive portfolio for Amrit Kang, rebuilt with React, Vite, and a custom Three.js shader.

## Run locally

```sh
npm install
npm run dev
```

`npm run build` produces a static site in `dist/`. `npm run preview` previews the production build.

`npm run test:e2e` runs the desktop and phone flow checks using installed Google Chrome. Screenshots are saved in the ignored `test-results/` directory. `npm run format` formats the source.

## Current preview: cover and scroll transition

The entry point displays the full-viewport Hello Kitty banner. Move the cursor to reveal Amrit's photo through a liquid trail. Scroll to melt away the whole cover while it stays pinned, then continue into a seamless pink greeting section. Scrolling back restores Kitty. On a phone, tap to peek or swipe upward to advance the story; native scrolling remains enabled. The photo button and scroll link also work with a keyboard. Reduced motion and unavailable WebGL use a simple scroll-linked image fade.

The earlier portfolio sections remain in `src/Portfolio.jsx` and `src/styles.css`, but are not displayed in this preview.

## Edit

- `src/Cover.jsx` and `src/cover.css`: the active full-screen cover.
- `src/ShaderReveal.jsx`: original two-image fluid simulation and composite, with bounded resolution, resource cleanup, and a static fallback.
- `public/images/amrit-blush-banner.png`: the active reveal portrait, edited from the user's daylight photo using the built-in image editor. Blush background, expanded framing, and natural facial detail.
- `docs/portrait-edit-prompt.txt`: the exact image-editing prompt.
- `public/images/amrit.jpg` and `public/images/amrit-profile.jpg`: earlier user-supplied portraits, retained for later portfolio sections.
- `public/images/hello-kitty.jpg`: user-provided Hello Kitty image.
- `public/Amrit-Kang-Resume.pdf`: supplied résumé.

The reference is [React Bits Pro Shader Reveal](https://pro.reactbits.dev/docs/components/shader-reveal), a two-image liquid cursor trail. Its registry requires a license key according to the [official installation guide](https://pro.reactbits.dev/docs/installation). No license is configured here. This is an original implementation of the requested interaction, not the licensed component or its source.

## Content sources

The supplied Amrit_Kang_Resume3.pdf is the source for education, CGPA, work, and events. The degree title follows the résumé (B.Sc. Computer Science), rather than the conflicting GitHub profile title. ReGit is presented as a collaborative project.

GitHub contribution records checked November 4, 2026:

- https://github.com/flisk-sh/flisk/pull/416
- https://github.com/muneer406/Sudoku-Solver-Python/pull/4
- https://github.com/Muneer320/ReGit/pull/16
- https://github.com/Muneer320/ReGit/pull/15

Wishlist photographs:

- Bubble machine: https://www.discopartylight.com/bubble-machines/180.html
- Barbie Dreamhouse: https://www.mykingdom.com.vn/en/products/ngoi-nha-trong-mo-cua-barbie-phien-ban-2023-hmx10

Decorative project artwork is illustrative, not a screenshot of the applications.
