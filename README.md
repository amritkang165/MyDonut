# Amrit’s Little World

A whimsical, interactive portfolio for Amrit Kang, rebuilt with React, Vite, and a custom Three.js shader.

## Run locally

```sh
npm install
npm run dev
```

`npm run build` produces a static site in `dist/`. `npm run preview` previews the production build.

`npm run test:e2e` runs the desktop and phone flow checks using installed Google Chrome. Screenshots are saved in the ignored `test-results/` directory. `npm run format` formats the source.

## Current preview: one connected pink journey

The entry point displays the full-viewport Hello Kitty banner, with a small bow beside Amrit’s name. Move the cursor to reveal Amrit's photo through a liquid trail. Scroll to reveal the portrait, which settles beside the introduction against a continuous blush background. After the profile, a fork leads to Projects or Events I hosted. The chosen road continues from its sign to the section entrance; both sections retain the same blush and cherry palette. Scrolling back restores Kitty. Phone tap/swipe, keyboard controls, reduced motion, and the unavailable-WebGL fallback are retained.

The earlier portfolio sections remain in `src/Portfolio.jsx` and `src/styles.css`, but are not displayed in this preview.

## Edit

- `src/Cover.jsx`, `src/cover.css`, and `src/editorial.css`: the active cover, portrait transition, and simplified profile.
- `src/Chapters.jsx` and `src/chapters.css`: the two-road choice, screenshot-led projects, event photo journal, gallery, and direct contact footer.
- `src/ProjectWorkspace.jsx`: a fan of five keyboard-accessible project preview cards, full-size image gallery, contributions, and repository links. Counts and fan positions follow the project list.
- `src/SunbeamMoment.jsx`: reversible portrait-to-community scroll story, explicit Reveal/Replay/Skip controls, and a static reduced-motion layout.
- `src/ConnectedRoad.jsx`: SVG roads measured from the actual choice signs and destination marker, recalculated on layout changes and resize.
- `src/worlds.css`: the connected roads, pink project workspace, and Sunbeam story styling.
- `src/JourneyDetails.jsx`, `src/journey-details.css`, and `src/ProjectDemo.jsx`: previous decorative components retained as inactive source. They are not imported into the current site.
- `src/ShaderReveal.jsx`: original two-image fluid simulation and composite, with bounded resolution, resource cleanup, and a static fallback.
- `public/images/amrit-blush-banner.png`: the active reveal portrait, edited from the user's daylight photo using the built-in image editor. Blush background, expanded framing, and natural facial detail.
- `docs/portrait-edit-prompt.txt`: the exact image-editing prompt.
- `public/images/amrit.jpg` and `public/images/amrit-profile.jpg`: earlier user-supplied portraits, retained for later portfolio sections.
- `public/images/hello-kitty.jpg`: user-provided Hello Kitty image.
- `public/Amrit-Kang-Resume.pdf`: supplied résumé.

The reference is [React Bits Pro Shader Reveal](https://pro.reactbits.dev/docs/components/shader-reveal), a two-image liquid cursor trail. Its registry requires a license key according to the [official installation guide](https://pro.reactbits.dev/docs/installation). No license is configured here. This is an original implementation of the requested interaction, not the licensed component or its source.

## Content sources

### Projects and hosted-event journal

Initially neither chapter is rendered: visitors choose Projects or Events I hosted, and only that chapter opens. Return links restore the crossroads. URL hashes preserve direct links and browser Back/Forward, with focus moved to the selected heading. The gallery supports previous/next controls, arrow keys, Escape, modal focus containment, and focus restoration. Photographs retain their full framing; the layout stacks on phones and respects reduced motion.

The first four projects show actual application screenshots. MERAWARD and Pocki use repository images (`docs/images/home.png` and `docs/assets/home.png`). ReGit and Khata Ledger were captured from locally running apps on November 5, 2026:

- [ReGit](https://github.com/amritkang165/ReGit), commit `cfa83e73d3949b1888f337801c5d48a17e65ed44`: built-in demo data, semantic diff in Split view, captured at 1120 × 760 with 2× pixel density. Its public preview returned an API error, so the screenshot comes from the working local demo.
- [Khata Ledger](https://github.com/amritkang165/khata-ledger), commit `6f17afdb1a10a7becc6bdae3ed7eafbd5eded17d`: voice-entry interface captured at 1440 × 1000 in an isolated SQLite database with a synthetic demo shop account. No existing shop or customer records were used. Khata replaces Placement Week Scheduler.

Clippit is the fifth project. Its preview is copied from `Design/Previews/history-light-window.png` in the local `clippit` repository at commit `c7bb0a93958516597375e23ca06d1d4f4c170129`. The README identifies this as a render of actual SwiftUI views using sample data, not personal clipboard history; the portfolio labels it accordingly. Its description follows that README. GitHub visibility was rechecked after Amrit’s correction: `amritkang165/clippit` is public, and the portfolio links to its public source. No signed download is advertised.

The preview cards lift on selection; the main preview subtly tilts with the pointer. Click it to open the full-size gallery with previous/next, arrow keys, Escape, and focus restoration. Arrow keys, Home, and End switch the project tabs. Reduced motion disables tilt and animated transitions. Descriptions follow the repository READMEs and supplied résumé, with team attribution and demo scope retained. Project links lead to GitHub; no live-demo availability is assumed.

A small bow follows the selected road to the section entrance. It uses the same measured path as the connected road and is hidden for reduced motion.

The curved road fork highlights the corresponding branch on hover, keyboard focus, or selection. Selection adds a connected road from the chosen sign to the matching section entrance and scrolls smoothly there. Direct links, browser history, and reduced-motion navigation remain instant. Only the chosen chapter opens. The drawer and contrasting dark/cream section backgrounds were removed following user feedback. Event photos have a cursor-following camera viewfinder on fine-pointer devices; reduced motion disables that tracking display and route animation. Keyboard focus shows a stationary finder, and tap/click opens the full photograph in the gallery. Sunbeam’s story pairs the organizer portrait with Amrit’s memory of anticipation, then expands the participant photograph as scrolling reveals the concluding sentence. Hidden story scenes are inert; Reveal/Replay/Skip controls provide keyboard access, and reduced motion presents both scenes in normal document flow. Email, GitHub, and copy-email controls remain available in the footer.

The profile retains the supplied personal stories about school chess, two years of Kathak, and wanting to become an IAS officer as a child. Wishlist product images remain in the asset directory with the sources below.

No video recordings were found in the four project repositories on November 5, 2026. The current site uses actual screenshots and repository links only. Copying email has a fallback message; sending remains a user action through their email client.

Event facts and photographs were supplied by Amrit on November 5, 2026:

- Sunbeam: an all-girls hackathon across 40 cities globally; Amrit was the main organizer for Bengaluru, hosted at Scaler. The first three supplied images are the organizer portrait, team, and community photographs.
- TinyFish: three back-to-back Bengaluru hackathons; Amrit was Event Lead from Ignite Room. The supplied photos document Quad AI and Scaler. The third venue and event dates have not been supplied, so neither is invented.
- Original photos are copied into `public/images/events/`; they are not AI-edited. Only hosted/organized events appear in this chapter, not hackathon participation or awards.
- Handwritten event memories are lightly edited from Amrit’s November 5 message: anxiety when Sunbeam attendees arrived after 1.5 months of work, and answering people’s questions while keeping TinyFish events running smoothly. No additional anecdotes were invented.

The supplied Amrit_Kang_Resume3.pdf is the source for education, CGPA, work, and events. The degree title follows the résumé (B.Sc. Computer Science), rather than the conflicting GitHub profile title. ReGit is presented as a collaborative project.

GitHub contribution records checked November 4, 2026:

- https://github.com/flisk-sh/flisk/pull/416
- https://github.com/muneer406/Sudoku-Solver-Python/pull/4
- https://github.com/Muneer320/ReGit/pull/16
- https://github.com/Muneer320/ReGit/pull/15

Wishlist photographs:

- Bubble machine: https://www.discopartylight.com/bubble-machines/180.html
- Barbie Dreamhouse: https://www.mykingdom.com.vn/en/products/ngoi-nha-trong-mo-cua-barbie-phien-ban-2023-hmx10

Earlier simulated demos remain only in inactive source.
