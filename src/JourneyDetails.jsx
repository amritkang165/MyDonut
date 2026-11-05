import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Heart, Mail } from "lucide-react";
import "./journey-details.css";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function useRibbonDrawing(ribbon) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = ribbon.current;
    if (reduced) {
      element.style.setProperty("--ribbon-progress", 1);
      return;
    }
    let frame;
    const update = () => {
      frame = null;
      const bounds = element.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, (innerHeight * 0.85 - bounds.top) / bounds.height),
      );
      element.style.setProperty("--ribbon-progress", progress);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, [reduced]);
}

export function JourneyRibbon() {
  const ribbon = useRef(null);
  useRibbonDrawing(ribbon);
  return (
    <div className="journey-ribbon" ref={ribbon} aria-hidden="true">
      <svg viewBox="0 0 120 1000" preserveAspectRatio="none" fill="none">
        <path
          className="ribbon-guide"
          d="M60 0C-15 150 130 200 60 310S-5 450 60 510S140 650 60 740S10 900 60 1000"
        />
        <path
          className="ribbon-drawing"
          pathLength="1"
          d="M60 0C-15 150 130 200 60 310S-5 450 60 510S140 650 60 740S10 900 60 1000"
        />
      </svg>
    </div>
  );
}

export function useChapterEntrance(destination) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const section = document.getElementById(destination);
    if (!section || reduced) return;
    const items = Array.from(section.querySelectorAll("[data-arrival]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove("arrival-waiting");
          entry.target.classList.add("arrival-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08 },
    );
    items.forEach((item) => {
      item.classList.add("arrival-waiting");
      observer.observe(item);
    });
    return () => {
      observer.disconnect();
      items.forEach((item) =>
        item.classList.remove("arrival-waiting", "arrival-visible"),
      );
    };
  }, [destination, reduced]);
}

const email = "amritkang2805@icloud.com";

export function ContactEnvelope() {
  const [open, setOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const resetCopy = useRef(null);
  const letterHeading = useRef(null);
  useEffect(() => () => clearTimeout(resetCopy.current), []);
  useEffect(() => {
    if (open) letterHeading.current?.focus({ preventScroll: true });
  }, [open]);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopyStatus("Email copied!");
    } catch {
      setCopyStatus(
        "Select the email above to copy it, or use the email link.",
      );
    }
    clearTimeout(resetCopy.current);
    resetCopy.current = setTimeout(() => setCopyStatus(""), 4000);
  };
  return (
    <section
      className={`contact-corner ${open ? "envelope-open" : ""}`}
      aria-labelledby="contact-heading"
    >
      <span className="chapter-kicker">A LITTLE NOTE BEFORE YOU GO</span>
      <h2 id="contact-heading">
        Have something <em>in mind?</em>
      </h2>
      <p>A project, an event, or just a hello. There’s room for it here.</p>
      <div className="envelope-scene">
        <div className="envelope-back" aria-hidden="true" />
        <div className="envelope-flap" aria-hidden="true" />
        <div
          className="contact-letter"
          id="contact-letter"
          inert={!open}
          aria-hidden={!open}
        >
          <Heart size={24} strokeWidth={1.3} aria-hidden="true" />
          <h3 ref={letterHeading} tabIndex={-1}>
            let’s make something.
          </h3>
          <p>Good ideas start with a little hello.</p>
          <a className="letter-email" href={`mailto:${email}`}>
            {email}
          </a>
          <div className="letter-actions">
            <a href={`mailto:${email}`}>
              <Mail size={15} aria-hidden="true" /> say hello
            </a>
            <a
              href="https://github.com/amritkang165"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <button onClick={copyEmail} aria-label="Copy email address">
              {copyStatus === "Email copied!" ? (
                <Check size={15} aria-hidden="true" />
              ) : (
                <Copy size={15} aria-hidden="true" />
              )}{" "}
              copy email
            </button>
          </div>
          <span className="copy-status" role="status">
            {copyStatus}
          </span>
          <span className="letter-signature">with love, Amrit ♡</span>
        </div>
        <div className="envelope-pocket" aria-hidden="true" />
        <button
          className="envelope-seal"
          aria-expanded={open}
          aria-controls="contact-letter"
          onClick={() => setOpen((value) => !value)}
        >
          <Heart size={20} aria-hidden="true" />
          <span>{open ? "close the note" : "open my little note"}</span>
        </button>
      </div>
      <p className="contact-postscript">
        made of code, curiosity, and a little pink.
      </p>
    </section>
  );
}
