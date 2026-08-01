# 🍩 DONUTS & DEVOPS

> **est. 2005 · baked fresh daily** — the portfolio of **Amrit Kang**,
> *full-stack dev · part-time pastry chef*.

This isn't a CV in a grid. It's a donut shop. The landing page is a 3D donut with
a `click me` hint — click it and it splits open, grows toward the camera, and a
flood of cream runs down the screen to reveal the real menu. The about section
prints out like a shop receipt, and every project is served as a page in a menu
book you can flip through and add to your order.

> **ID #001 · BITS PILANI · 2ND YEAR**

---

## 🧁 The experience

Order the site like you'd order a donut:

1. **Open the donut.** Click the donut on the hero — it hinges open in two halves,
   cream-cut faces peek out, and a syrup trail follows your cursor from then on.
2. **Read the receipt.** "What's in the box" unfurls like a paper till receipt —
   photo, bullet points, and a fact sheet:

   | flavor | bake time | sprinkles | filling | freshness |
   | --- | --- | --- | --- | --- |
   | Full-Stack + AI | 2nd year @ BITS Pilani | Swift · Python · System Design | Web apps & AI products | Open to internships & collabs |

3. **Open the book.** *"Some masterpieces I've baked"* — a real 3D menu book with
   a hinged cover, one project per page. Flip with **← prev / next →** or swipe on
   touch screens.
4. **Add to cart.** Every page has a **+ add to cart** button. The order slip on
   the facing page pops up with a running total (18% tax, because everything
   costs more at checkout).
5. **Checkout.** Prints a **PAID** stamp, bursts a shower of sprinkles, and slides
   out **your order tray** — every project you ordered, now a clickable GitHub link.
6. **Follow the trail.** A syrup trail tracks your cursor. At the bottom:
   *"Let's build something."* — *Build. Break. Learn. Repeat.*

---

## 📖 What's on the menu

| Project | Tag | Flavor |
| --- | --- | --- |
| **exHacker** | Your autonomous hackathon co-founder | 🍬 pink |
| **Pocki** | Your money, simplified | 🥐 gold |
| **WearWise** | An AI stylist for your closet | 🍃 mint |
| **Gitty** | GitHub, from your pocket | 🍬 pink |
| **Study Companion** | One app, every study tool | 🥐 gold |
| **Oratio** | Say it better | 🍃 mint |
| **iffy.ai** | Think before you believe | 🍬 pink |

Each page shows the tagline, description, tech stack, and a glazed donut with the
project's icon in the hole. All seven are live in the order tray after checkout.

---

## 🥣 The recipe

| Ingredient | Brand |
| --- | --- |
| Framework | [React 19](https://react.dev) |
| 3D | [Three.js](https://threejs.org) — donut is two torus halves that split apart |
| Icons | [lucide-react](https://lucide.dev) |
| Bundler | [Vite 6](https://vitejs.dev) |
| Fonts | Fredoka, Space Grotesk, JetBrains Mono |

---

## 🏃 Bake it locally

```bash
npm install     # mix the dry ingredients
npm run dev     # preheat — serve at http://localhost:5173
npm run build   # box it up for production
npm run preview # taste the production build
```

---

## 🧑‍🍳 Change the menu

Everything lives in one file: **`src/Portfolio.jsx`**.

- **Projects** — the `PROJECTS` array: `name`, `tag`, `desc`, `stack`, `icon`, `url`, `accent`. Each entry becomes a menu-book page.
- **Prices** — `MENU_PRICES` (one price per project, in order).
- **Flavors** — `ACCENT_COLORS`: `pink #FF8FAB`, `gold #E8A93B`, `mint #8FE3C4`.
- **Facts** — the `FACTS` array on the receipt.
- **Photo** — swap the base64 `PROFILE_IMG` constant.
- **Theme** — the whole design system is the `CSS` template string at the bottom of the file.

---

## 📬 Where to find me

- **Email** — [amritkang2805@icloud.com](mailto:amritkang2805@icloud.com)
- **GitHub** — [github.com/amritkang165](https://github.com/amritkang165)
- **LinkedIn** — [linkedin.com/in/amritkang28](https://www.linkedin.com/in/amritkang28)

*thanks for stopping by — the dough is on me*
