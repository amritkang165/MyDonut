import { useEffect, useRef, useState } from "react";
import ShaderReveal from "./ShaderReveal.jsx";
import "./cover.css";

export default function Cover() {
  const story = useRef(null);
  const banner = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [revealPhoto, setRevealPhoto] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    let frame;
    const update = () => {
      frame = null;
      const bounds = story.current.getBoundingClientRect();
      const distance = bounds.height - banner.current.offsetHeight;
      setScrollProgress(
        Math.max(0, Math.min(1, -bounds.top / Math.max(1, distance))),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(story.current);
    resize.observe(banner.current);
    addEventListener("scroll", schedule, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      removeEventListener("scroll", schedule);
    };
  }, []);
  const revealProgress = Math.min(1, scrollProgress / 0.72);
  const blend = Math.max(0, Math.min(1, (scrollProgress - 0.72) / 0.28));
  const controlsOpacity = Math.max(0, 1 - scrollProgress / 0.22);
  return (
    <main className="cover-page">
      <div className="scroll-story" ref={story}>
        <section
          className="full-banner"
          ref={banner}
          aria-label="Hello Kitty to Amrit interactive cover"
          style={{
            "--portrait-blend": blend * blend * (3 - 2 * blend),
            "--controls-opacity": controlsOpacity,
          }}
        >
          <ShaderReveal
            frontImage="/images/hello-kitty.jpg"
            backImage="/images/amrit-blush-banner.png"
            backAlt="Amrit with her hair down, smiling against a soft pink background"
            revealPhoto={revealPhoto}
            scrollReveal={revealProgress}
            reducedMotion={reducedMotion}
            onToggle={() => setRevealPhoto((value) => !value)}
          />
          <div className="banner-pink-blend" aria-hidden="true" />
          <header className="cover-label">
            <h1>
              amrit kang<span>♡</span>
            </h1>
            <span>a little hello.</span>
          </header>
          <div className="cover-controls" inert={controlsOpacity === 0}>
            <div className="cover-instructions" aria-hidden="true">
              <span className="desktop-hint">move your cursor. find me.</span>
              <span className="touch-hint">
                tap to peek. swipe up to meet me.
              </span>
            </div>
            <button
              className="cover-photo-toggle"
              aria-pressed={revealPhoto}
              onClick={() => setRevealPhoto((value) => !value)}
            >
              {revealPhoto ? "back to kitty ↩" : "reveal my photo ↗"}
            </button>
            <a
              className="cover-scroll"
              href="#meet-me"
              onClick={(event) => {
                event.preventDefault();
                document
                  .getElementById("meet-me")
                  .scrollIntoView({
                    behavior: reducedMotion ? "instant" : "smooth",
                  });
              }}
            >
              scroll to meet me <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>
      </div>
      <section
        className="meet-section"
        id="meet-me"
        aria-labelledby="meet-heading"
      >
        <span className="meet-eyebrow">THE GIRL BEHIND THE BOW</span>
        <h2 id="meet-heading">
          hi, I’m <em>Amrit.</em>
        </h2>
        <p>I’m glad you’re here.</p>
      </section>
    </main>
  );
}
