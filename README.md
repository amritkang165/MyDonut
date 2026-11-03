# Amrit’s Little World

A whimsical, interactive portfolio for Amrit Kang, rebuilt with React, Vite, and a custom Three.js shader.

## Run locally

```sh
npm install
npm run dev
```

`npm run build` produces a static site in `dist/`. `npm run preview` previews the production build.

`npm run test:e2e` runs the desktop and phone flow checks using installed Google Chrome. Screenshots are saved in the ignored `test-results/` directory. `npm run format` formats the source.

## The journey

- Hello Kitty cover with a noise-displacement shader reveal and a portrait polaroid.
- Profile, education, CGPA, skills, and experience from the supplied résumé.
- A scroll-driven road and an illustrated map with four destinations.
- Projects with category filters and repository/live links.
- Events and community roles.
- Four verified merged pull requests to other repositories.
- Personal memories and a childhood wishlist with an interactive bubble machine.
- Responsive layouts, keyboard navigation, reduced-motion support, and a manual motion switch.

## Edit

- `src/Portfolio.jsx`: profile, projects, events, contributions, map, and page sections.
- `src/ShaderReveal.jsx`: original WebGL reveal; lazy-loaded, static-image fallback, bounded pixel density, and on-demand rendering.
- `src/styles.css`: design system and responsive styles.
- `public/images/amrit.jpg`: user-supplied cheek-pointing photo for the cover Polaroid.
- `public/images/amrit-profile.jpg`: user-supplied white T-shirt portrait for the profile section.
- `public/images/hello-kitty.jpg`: user-provided Hello Kitty image.
- `public/Amrit-Kang-Resume.pdf`: supplied résumé.

The requested `@reactbits-starter/shader-reveal-tw` namespace was not recognized by the shadcn registry. The reveal is an original implementation, not an installed React Bits component.

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
