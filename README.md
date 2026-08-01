# My donut 🍩🤎

A playful single-page portfolio for **Amrit Kang** — built around a bakery theme where a 3D donut splits open, the about section is a printed receipt, and every project is served up in a **menu book** you can flip through and add to your order.

> Built with **React 19**, **Three.js** and **Vite**.

---

## ✨ Highlights

| | |
| --- | --- |
| 🍩 **3D donut intro** | Click the donut — it splits open, grows, and spills cream down the screen |
| 🧾 **About receipt** | A paper receipt unfurls with the story, roles and contact details |
| 📖 **Projects as a menu book** | A real 3D book — cover flips open, one project per page, real page-turn animations |
| 🛒 **Add to cart** | Order slips pop onto the facing page as you add projects |
| 🎁 **Order tray** | Checkout fires a sprinkle burst and every project becomes a clickable GitHub link |
| ♿ **Accessible** | Respects `prefers-reduced-motion`, keyboard-navigable, ARIA-labelled |

---

## 📖 The menu book

The projects section is the centrepiece:

1. **Open** — click the book cover or the **explore menu** button; the cover hinges open in 3D.
2. **Browse** — each page shows one project with its tagline, description and tech stack. Flip pages with **← prev / next →**, or **swipe** on touch devices.
3. **Order** — hit **+ add to cart**; the order slip on the facing page pops up with a running total.
4. **Checkout** — prints a **PAID** stamp, bursts sprinkles, and slides out an **order tray** with a link to every repo you ordered.

Prices are in USD and an 18% tax is added at checkout for fun.

---

## 🚀 Getting started

```bash
# install dependencies
npm install

# start the dev server (default http://localhost:5173)
npm run dev
```

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Build a production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## 🛠 Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [React 19](https://react.dev) |
| 3D | [Three.js](https://threejs.org) |
| Icons | [lucide-react](https://lucide.dev) |
| Bundler | [Vite 6](https://vitejs.dev) |

---

## 🧑‍🍳 Customising

Everything lives in a single file: **`src/Portfolio.jsx`**.

- **Projects** — edit the `PROJECTS` array (`key`, `name`, `tag`, `desc`, `stack`, `icon`, `url`, `accent`). Each entry becomes a menu-book page.
- **Accent colours** — tweak `ACCENT_COLORS` (pink / gold / mint).
- **Prices** — adjust `MENU_PRICES` (one price per project, in order).
- **Profile photo** — replace the base64 `PROFILE_IMG` constant.
- **Contact email / socials** — update the links in the contact section.
- **Theme CSS** — the entire design system is the `CSS` template string at the bottom of the file.

---

## 🧱 Structure

```
.
├── index.html          HTML shell
├── vite.config.js      Vite configuration
├── package.json
└── src
    ├── main.jsx        React entry point
    └── Portfolio.jsx   All components + theme CSS
```

---

## 📫 Contact

- **GitHub** — [amritkang165](https://github.com/amritkang165)
- **Email** — [amritkang2805@icloud.com](mailto:amritkang2805@icloud.com)
- Open to internships, freelance work and collaborations.

---

## 📄 License

No license specified — see the author for usage permissions.
