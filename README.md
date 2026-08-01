# Donut Portfolio 🍩

A playful, single-page portfolio for **Amrit Kang** — a 3D donut intro that splits open and spills cream, followed by an About receipt and a Projects section styled as a **menu book** you can open, flip through, add to your order, and check out.

Built with **React 19**, **Three.js** (WebGL donut intro) and **Vite**.

## ✨ Features

- **3D donut intro** — click the donut, it splits open, grows, and spills cream down the screen
- **Donut theme everywhere** — sprinkles, drips, half-donuts, floating decorations and a donut cursor
- **About receipt** — a paper receipt that unfurls with the story, tech stack and contact details
- **Projects as a menu book**
  - A real 3D book cover that flips open on **explore menu**
  - One project per page with page-turn animations (click arrows or swipe)
  - Each page shows the donut, tagline, description and tech-stack chips
  - **Add to cart** per project; the order slip pops up on the facing page
  - Checkout prints a **PAID** stamp, fires a sprinkle burst, and an **order tray** of clickable GitHub links slides out
- **Order tray** — every purchased project becomes a link straight to its repo
- **Accessibility** — respects `prefers-reduced-motion`, keyboard-friendly cover, ARIA labels

## 🚀 Run it

```bash
npm install
npm run dev
```

Open the printed URL (default `http://localhost:5173`).

## 🏗 Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

## 📦 Tech

| Layer    | Stack |
| -------- | ----- |
| Framework| React 19 |
| 3D       | Three.js |
| Icons    | lucide-react |
| Bundler  | Vite 6 |

## 🧑‍🍳 Projects featured

A selection of full-stack and AI projects are pulled in from [github.com/amritkang165](https://github.com/amritkang165) and served up as menu "flavours".

## 🧱 Structure

```
src/
  main.jsx        entry
  Portfolio.jsx   everything — components + theme CSS
index.html        HTML shell
vite.config.js    Vite config
```
