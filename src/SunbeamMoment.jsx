import { useEffect, useRef, useState } from "react";
import "./worlds.css";

const clamp = (value) => Math.max(0, Math.min(1, value));

export default function SunbeamMoment({ portrait, community }) {
  const scene = useRef(null);
  const stage = useRef(null);
  const [progress, setProgress] = useState(0);
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
    if (reducedMotion) return;
    let frame;
    const update = () => {
      frame = null;
      const bounds = scene.current.getBoundingClientRect();
      setProgress(
        clamp(
          -bounds.top / Math.max(1, bounds.height - stage.current.offsetHeight),
        ),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(scene.current);
    resize.observe(stage.current);
    window.addEventListener("scroll", schedule, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
    };
  }, [reducedMotion]);
  const reveal = clamp((progress - 0.28) / 0.55);
  const skip = () => {
    const next = document.getElementById("sunbeam-after-moment");
    next?.scrollIntoView({ behavior: "instant", block: "start" });
    next?.focus({ preventScroll: true });
  };
  const turnPage = () => {
    const start = scrollY + scene.current.getBoundingClientRect().top;
    window.scrollTo({
      top:
        progress > 0.7
          ? start
          : start + scene.current.offsetHeight - stage.current.offsetHeight,
      behavior: "instant",
    });
  };
  return (
    <div
      ref={scene}
      className={`sunbeam-moment${reducedMotion ? " moment-static" : ""}`}
      style={{
        "--moment-before": reducedMotion ? 1 : clamp(1 - progress / 0.38),
        "--moment-reveal": reducedMotion ? 1 : reveal,
        "--moment-after": reducedMotion ? 1 : clamp((progress - 0.3) / 0.2),
        "--moment-line": reducedMotion ? 1 : clamp((progress - 0.64) / 0.22),
      }}
    >
      <div className="moment-stage" ref={stage}>
        <div className="moment-controls">
          {!reducedMotion && (
            <button className="moment-advance" onClick={turnPage}>
              {progress > 0.7 ? "Replay the moment ↑" : "Reveal the room ↓"}
            </button>
          )}
          <button className="moment-skip" onClick={skip}>
            Skip to the team ↓
          </button>
        </div>
        <div
          className="moment-before"
          inert={!reducedMotion && progress >= 0.38}
          aria-hidden={!reducedMotion && progress >= 0.38}
        >
          <aside className="sunbeam-memory">
            <span className="editorial-label">01 / THE MOMENT I REMEMBER</span>
            <blockquote>
              A month and a half
              <br />
              of hard work…
            </blockquote>
            <p>
              “When people started coming, the anxiety and everything hit all at
              once. A month and a half of hard work was finally happening.”
            </p>
            <span className="moment-scroll">
              Scroll to let the day unfold <span aria-hidden="true">↓</span>
            </span>
          </aside>
          <figure className="moment-portrait">
            {portrait}
            <figcaption>Me, on hosting duty. Sunbeam, Bengaluru.</figcaption>
          </figure>
        </div>
        <div
          className="moment-after"
          inert={!reducedMotion && progress < 0.4}
          aria-hidden={!reducedMotion && progress < 0.4}
        >
          <figure className="moment-community">
            {community}
            <figcaption>
              <span>SUNBEAM / BENGALURU</span>
              <span>HOSTED AT SCALER</span>
            </figcaption>
          </figure>
          <p className="moment-resolution">…was finally happening.</p>
        </div>
      </div>
    </div>
  );
}
