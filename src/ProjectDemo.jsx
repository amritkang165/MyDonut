import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw } from "lucide-react";
import { useReducedMotion } from "./JourneyDetails.jsx";

const walkthroughs = {
  meraward: [
    {
      title: "Start with what happened.",
      text: "A sample report: a pothole near a crossing in Delhi. Choose a written report and describe the issue.",
      label: "01 / DESCRIBE",
      heading: "A pothole near the crossing",
      detail: "Written report · Sample location: Delhi",
      badge: "Draft report",
    },
    {
      title: "Review before submitting.",
      text: "Confirm the issue and location. The demo prepares English and Hindi letter drafts from the report.",
      label: "02 / REVIEW",
      heading: "Check. Confirm. Submit.",
      detail: "Issue: pothole · Letter drafts: English / Hindi",
      badge: "Ready for review",
    },
    {
      title: "Keep a trail to follow.",
      text: "The demo queues a draft and creates a tracking record. No message is sent to a real official.",
      label: "03 / TRACK",
      heading: "Your report has a story now.",
      detail: "Demo outbox · Tracking record created",
      badge: "Demo record",
    },
  ],
  Pocki: [
    {
      title: "Start with a payment screenshot.",
      text: "A fictional ₹120 café payment stands in for a screenshot from a UPI app.",
      label: "01 / IMPORT",
      heading: "₹120",
      detail: "Paid to Sample Café · UPI payment",
      badge: "Sample screenshot",
    },
    {
      title: "Turn the screenshot into fields.",
      text: "The parser extracts payment details. This illustration shows the amount and merchant from our sample.",
      label: "02 / EXTRACT",
      heading: "Amount ₹120 · Merchant Sample Café",
      detail: "Payment details extracted on device",
      badge: "Parsed details",
    },
    {
      title: "See it in your expenses.",
      text: "The payment becomes a local expense entry. This example adds ₹120 to an illustrated spending list.",
      label: "03 / SAVE",
      heading: "Sample Café — ₹120",
      detail: "Expense entry · Stored on the phone",
      badge: "Expense saved",
    },
  ],
  ReGit: [
    {
      title: "Start with two research revisions.",
      text: "Two collaborators edit the same sentence in a research note.",
      label: "01 / REVISE",
      heading: "A research note, two branches.",
      detail: "Original: The trial lasted 7 days.",
      badge: "Shared starting point",
    },
    {
      title: "See where the ideas diverge.",
      text: "One branch says 10 days; the other says 14. A conflict makes the difference explicit instead of silently dropping an edit.",
      label: "02 / COMPARE",
      heading: "10 days ↔ 14 days",
      detail: "Two edits to the same sentence",
      badge: "Conflict to review",
    },
    {
      title: "Resolve it and preserve the history.",
      text: "In this example, the reviewer chooses 14 days. The merge retains both parent histories.",
      label: "03 / MERGE",
      heading: "The trial lasted 14 days.",
      detail: "Resolved revision · Two-parent merge",
      badge: "History preserved",
    },
  ],
  "placement-week-scheduler": [
    {
      title: "A small scheduling clash.",
      text: "Our illustrative example has two interviews for the same student at 10:00.",
      label: "01 / THE CLASH",
      heading: "One student. Two rooms. Same time.",
      detail: "Interview A: 10:00 · Interview B: 10:00",
      badge: "Conflict",
    },
    {
      title: "Replan the affected appointment.",
      text: "With an available 10:30 slot in this example, the second interview can move. Other appointments stay fixed.",
      label: "02 / REPLAN",
      heading: "Move the smallest possible piece.",
      detail: "Interview A stays · Interview B → 10:30",
      badge: "One change",
    },
    {
      title: "A schedule that fits.",
      text: "The student can attend both interviews. The actual repository contains the constraint solver and larger benchmark dataset.",
      label: "03 / RESOLVED",
      heading: "Both interviews. No overlap.",
      detail: "Interview A: 10:00 · Interview B: 10:30",
      badge: "Clash resolved",
    },
  ],
};

export default function ProjectDemo({ project }) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const container = useRef(null);
  const steps = walkthroughs[project.id];
  const current = steps[step];
  useEffect(() => {
    if (reduced) setPlaying(false);
  }, [reduced]);
  useEffect(() => {
    if (!playing || !open) return;
    const timer = setTimeout(() => {
      if (step === steps.length - 1) setPlaying(false);
      else setStep((value) => value + 1);
    }, 3200);
    return () => clearTimeout(timer);
  }, [playing, open, step, steps.length]);
  useEffect(() => {
    if (!open) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setPlaying(false);
    });
    observer.observe(container.current);
    const onVisibility = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [open]);
  const start = () => {
    if (open) {
      setOpen(false);
      setPlaying(false);
      return;
    }
    setStep(0);
    setOpen(true);
    setPlaying(!reduced);
  };
  const advance = (direction) => {
    setPlaying(false);
    setStep((value) => value + direction);
  };
  const togglePlaying = () => {
    if (step === steps.length - 1 && !playing) setStep(0);
    setPlaying((value) => !value);
  };
  return (
    <div className="project-demo" ref={container}>
      <button
        className="demo-trigger"
        aria-expanded={open}
        aria-controls={`demo-${project.id}`}
        onClick={start}
      >
        <Play size={14} aria-hidden="true" />
        {open ? "close walkthrough" : "see how it works"}
        <span>3 little steps</span>
      </button>
      {open && (
        <section
          className={`demo-panel ${playing ? "is-playing" : ""}`}
          id={`demo-${project.id}`}
          aria-label={`${project.name} illustrated walkthrough`}
        >
          <p className="demo-disclosure">
            Illustrated walkthrough · sample data
          </p>
          <div className={`demo-scene scene-${project.id}`} key={step}>
            <span className="demo-stage-label">{current.label}</span>
            <div className="demo-stage-icon" aria-hidden="true">
              {project.id === "Pocki"
                ? "₹"
                : project.id === "ReGit"
                  ? "⑂"
                  : project.id === "meraward"
                    ? "⌖"
                    : "▦"}
            </div>
            <strong>{current.heading}</strong>
            <p>{current.detail}</p>
            <span className={`demo-badge ${step === 2 ? "demo-complete" : ""}`}>
              {current.badge}
            </span>
          </div>
          <div className="demo-narration" aria-live="polite">
            <h4>{current.title}</h4>
            <p>{current.text}</p>
          </div>
          <div
            className="demo-progress"
            aria-label={`Step ${step + 1} of ${steps.length}`}
          >
            {steps.map((_, index) => (
              <span
                key={index}
                className={index <= step ? "step-complete" : ""}
              />
            ))}
          </div>
          <div className="demo-controls">
            <button
              onClick={() => advance(-1)}
              disabled={step === 0}
              aria-label="Previous step"
            >
              <ArrowLeft size={16} />
            </button>
            {!reduced && (
              <button
                onClick={togglePlaying}
                aria-label={
                  playing
                    ? "Pause walkthrough"
                    : step === 2
                      ? "Replay walkthrough"
                      : "Play walkthrough"
                }
              >
                {playing ? (
                  <Pause size={15} />
                ) : step === 2 ? (
                  <RotateCcw size={15} />
                ) : (
                  <Play size={15} />
                )}
              </button>
            )}
            {reduced && step === 2 && (
              <button
                onClick={() => setStep(0)}
                aria-label="Replay walkthrough"
              >
                <RotateCcw size={15} />
              </button>
            )}
            <span>
              {step + 1} / {steps.length}
            </span>
            <button
              onClick={() => advance(1)}
              disabled={step === steps.length - 1}
              aria-label="Next step"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
