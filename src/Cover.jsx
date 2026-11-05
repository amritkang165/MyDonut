import { useEffect, useRef, useState } from "react";
import ShaderReveal from "./ShaderReveal.jsx";
import Chapters from "./Chapters.jsx";
import "./cover.css";
import "./editorial.css";

const clamp = (value) => Math.max(0, Math.min(1, value));
const smooth = (value) => value * value * (3 - 2 * value);

export default function Cover() {
  const story = useRef(null);
  const banner = useRef(null);
  const focusIntroduction = useRef(false);
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
  const revealProgress = Math.min(1, scrollProgress / 0.48);
  const blend = Math.max(0, Math.min(1, (scrollProgress - 0.72) / 0.28));
  const controlsOpacity = Math.max(0, 1 - scrollProgress / 0.22);
  const settle = reducedMotion
    ? Number(scrollProgress >= 0.7)
    : smooth(clamp((scrollProgress - 0.52) / 0.38));
  const introduction = reducedMotion
    ? settle
    : smooth(clamp((scrollProgress - 0.73) / 0.24));
  useEffect(() => {
    if (introduction >= 0.95 && focusIntroduction.current) {
      document.getElementById("meet-heading").focus({ preventScroll: true });
      focusIntroduction.current = false;
    }
  }, [introduction]);
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
            "--settle": settle,
            "--introduction": introduction,
          }}
        >
          <div className="scrapbook-margin" aria-hidden="true">
            <span>AMRIT KANG</span>
            <span>BENGALURU, INDIA</span>
          </div>
          <figure className="portrait-frame">
            <div className="portrait-window">
              <ShaderReveal
                frontImage="/images/hello-kitty.jpg"
                backImage="/images/amrit-blush-banner.png"
                backAlt="Amrit with her hair down, smiling against a soft pink background"
                revealPhoto={revealPhoto}
                scrollReveal={revealProgress}
                reducedMotion={reducedMotion}
                onToggle={() => {
                  if (scrollProgress === 0) setRevealPhoto((value) => !value);
                }}
              />
              <div className="banner-pink-blend" aria-hidden="true" />
            </div>
          </figure>
          <div className="portrait-intro" inert={introduction < 0.95}>
            <span className="meet-eyebrow">
              DEVELOPER & COMMUNITY ORGANIZER
            </span>
            <h2 id="meet-heading" tabIndex={-1}>
              hi, I’m <em>Amrit.</em>
            </h2>
            <p className="intro-description">
              I’m studying Computer Science at BITS Pilani. I build web and iOS
              apps, and organize events in Bengaluru.
            </p>
            <a className="scrapbook-link" href="#meet-me">
              About me <span aria-hidden="true">↓</span>
            </a>
          </div>
          <header className="cover-label">
            <h1>
              amrit kang
              <svg
                className="signature-bow"
                viewBox="0 0 58 40"
                fill="none"
                aria-hidden="true"
              >
                <path d="M27 18C13-1 2 1 5 15C7 26 20 24 27 18ZM31 18C45-1 56 1 53 15C51 26 38 24 31 18ZM26 20C24 29 20 34 15 37M32 20C34 29 38 34 43 37" />
                <path d="M26 15C28 13 31 13 33 16L32 22H26Z" />
              </svg>
            </h1>
            <span>portfolio / selected work</span>
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
                focusIntroduction.current = true;
                const bounds = story.current.getBoundingClientRect();
                window.scrollTo({
                  top:
                    scrollY +
                    bounds.top +
                    bounds.height -
                    banner.current.offsetHeight,
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
        aria-labelledby="scrapbook-heading"
      >
        <span className="editorial-label">ABOUT</span>
        <h2 id="scrapbook-heading">A bit about me.</h2>
        <div className="profile-layout">
          <div className="profile-education">
            <span className="editorial-label">CURRENTLY STUDYING AT</span>
            <h3>BITS Pilani</h3>
            <p>
              B.Sc. Computer Science
              <br />
              2025 — 2029
            </p>
            <p className="profile-grade">
              <strong>9.27</strong> / 10 CGPA
            </p>
            <a
              className="editorial-link"
              href="/Amrit-Kang-Resume.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Read my résumé ↗
              <span className="sr-only"> (PDF, opens in a new tab)</span>
            </a>
          </div>
          <div className="profile-personal">
            <p>
              I like making things that people can use. I work across web apps,
              native iOS, and backend systems. Away from the keyboard, I
              organize events and bring people together.
            </p>
            <div className="profile-interests">
              <div>
                <h3>Before the code</h3>
                <p>
                  I played chess in school, learnt Kathak for two years, and
                  wanted to become an IAS officer when I was little.
                </p>
              </div>
              <div>
                <h3>What I work with</h3>
                <p>Python, React, Swift, Go, and AWS.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Chapters />
    </main>
  );
}
