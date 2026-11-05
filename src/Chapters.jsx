import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  X,
  Check,
  Copy,
} from "lucide-react";
import "./chapters.css";
import ProjectWorkspace from "./ProjectWorkspace.jsx";
import SunbeamMoment from "./SunbeamMoment.jsx";
import "./worlds.css";
import ConnectedRoad from "./ConnectedRoad.jsx";

const github = "https://github.com/amritkang165";
const projects = [
  {
    id: "meraward",
    name: "MERAWARD",
    image: "meraward.png",
    imageAlt: "MERAWARD demo showing voice, photo and written civic reporting",
    previewLabel: "LOCAL DEMO",
    kind: "CIVIC TECH · TEAM PROJECT",
    color: "mint",
    line: "A little more power to the people.",
    description:
      "Find your ward, prepare a complaint, and follow its story. A civic-reporting demo built around the people using it.",
    stack: ["React", "Python", "AWS"],
    role: "Team lead · frontend · ward data",
    problem:
      "Finding where to report a local issue can be harder than reporting it.",
    contribution:
      "I led the team, built the frontend, worked on ward data, and handled the submission for First Commit · Bharat Builds Tour.",
    detail:
      "Voice, photo, and text intake lead to a reviewed complaint and English/Hindi drafts. The current demo uses historical ward boundaries and a demo outbox; it does not send complaints to officials.",
  },
  {
    id: "Pocki",
    name: "Pocki",
    image: "pocki.png",
    imageAlt: "Pocki iOS app showing a monthly budget and spending summary",
    previewLabel: "NATIVE iOS",
    kind: "NATIVE iOS · PERSONAL PROJECT",
    color: "peach",
    line: "Your money, a little less complicated.",
    description:
      "An on-device finance companion, built for everyday UPI payments and a clearer picture of your spending.",
    stack: ["Swift", "SwiftUI", "SwiftData"],
    role: "iOS app development",
    problem:
      "Keeping up with everyday payments shouldn’t mean another spreadsheet to maintain.",
    contribution:
      "I built a native iOS finance tracker with a screenshot-to-expense parser for UPI payments, local storage, and a SwiftUI interface.",
    detail:
      "Offline-first and designed to keep financial data on the phone. The repository includes the app source and setup instructions; this is not an App Store download.",
  },
  {
    id: "ReGit",
    name: "ReGit",
    image: "regit.png",
    imageWidth: 2240,
    imageHeight: 1520,
    imageAlt:
      "ReGit local demo showing a split semantic diff between two research document versions",
    previewLabel: "LOCAL RESEARCH DEMO",
    kind: "RESEARCH TOOLS · TEAM PROJECT",
    color: "lilac",
    line: "Every good idea has a history.",
    description:
      "Version control for research: documents, PDFs, chats, and code, with semantic changes and live collaboration.",
    stack: ["Python", "FastAPI", "React"],
    role: "Co-built with Muneer Alam",
    problem:
      "Research is more than lines of code. Its history needs to understand the artifacts being changed.",
    contribution:
      "I co-built ReGit with Muneer Alam for Gradient Rush, where our team placed in the Top 6.",
    detail:
      "The project combines content-addressed history, semantic diffs, three-way prose merging, CRDT collaboration, and version-aware search. Explore the repository for the architecture and local demo.",
  },
  {
    id: "khata-ledger",
    name: "Khata Ledger",
    image: "khata-ledger.png",
    imageAlt:
      "Khata Ledger voice-entry screen in an isolated demo shop account",
    previewLabel: "LOCAL DEMO SHOP",
    kind: "VOICE AI · PERSONAL PROJECT",
    description:
      "A voice-first credit ledger for small shops. Speak a note, keep track of balances, and review uncertain entries before they become records.",
    stack: ["Python", "FastAPI", "Gemma 3", "SQLite"],
    role: "Full-stack development · voice & AI pipeline",
    contribution:
      "I built the voice-to-ledger flow, private shop accounts, customer matching, review queue, and passbook. Duplicate protection prevents a retried request from recording the same transaction twice.",
    detail:
      "ElevenLabs transcribes speech; Gemma 3 through local Ollama extracts ledger fields. Financial records stay in SQLite, with low-confidence notes held for correction. The screenshot uses an isolated demo account, not real customer records.",
  },

];

const photos = [
  {
    src: "sunbeam-community.jpeg",
    caption: "Sunbeam · Bengaluru, Scaler",
    alt: "Sunbeam participants gathered together at Scaler in Bengaluru",
  },
  {
    src: "sunbeam-amrit.jpeg",
    caption: "Sunbeam · behind the mic",
    alt: "Amrit holding a microphone at Sunbeam",
  },
  {
    src: "sunbeam-team.jpeg",
    caption: "Sunbeam · the people behind the day",
    alt: "Amrit with the Sunbeam team at Scaler",
  },
  {
    src: "tinyfish-quad.jpeg",
    caption: "TinyFish · Quad AI, Bengaluru",
    alt: "Amrit and the event team in front of Quad AI banners",
  },
  {
    src: "tinyfish-scaler.jpeg",
    caption: "TinyFish · Scaler, Bengaluru",
    alt: "Amrit with the TinyFish and Ignite Room event team at Scaler",
  },
  {
    src: "tinyfish-amrit.jpeg",
    caption: "TinyFish · Event Lead, Ignite Room",
    alt: "Amrit wearing a TinyFish and Ignite Room event T-shirt at Scaler",
  },
];

function EventPhoto({ index, onOpen }) {
  const photo = photos[index];
  const followPointer = (event) => {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const frame = event.currentTarget;
    const bounds = frame.getBoundingClientRect();
    // Percentages also keep the finder aligned on the slightly rotated photos.
    frame.style.setProperty(
      "--finder-x",
      `${Math.max(18, Math.min(82, ((event.clientX - bounds.left) / bounds.width) * 100))}%`,
    );
    frame.style.setProperty(
      "--finder-y",
      `${Math.max(25, Math.min(75, ((event.clientY - bounds.top) / bounds.height) * 100))}%`,
    );
    frame.dataset.tracking = "true";
  };
  return (
    <button
      className="event-photo"
      onClick={() => onOpen(index)}
      onPointerMove={followPointer}
      onPointerLeave={(event) => {
        delete event.currentTarget.dataset.tracking;
      }}
      aria-label={"Enlarge photo: " + photo.caption}
    >
      <img
        src={"/images/events/" + photo.src}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        width={index === 1 ? 718 : 1280}
        height={index === 1 ? 1280 : index === 0 ? 720 : 960}
      />
      <span className="photo-viewfinder" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <span>FRAME 0{index + 1} · OPEN</span>
      </span>
      <span className="photo-enlarge" aria-hidden="true">
        <ArrowUpRight size={18} />
      </span>
    </button>
  );
}

function Contact() {
  const email = "amritkang2805@icloud.com";
  const [status, setStatus] = useState("");
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Email copied.");
    } catch {
      setStatus("You can select the email to copy it, or open the email link.");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 4000);
  };
  return (
    <footer className="contact-footer chapter-shell" id="contact">
      <div className="contact-heading">
        <span className="editorial-label">GET IN TOUCH</span>
        <h2>Say hello.</h2>
      </div>
      <div className="contact-address">
        <a href={"mailto:" + email}>
          {email}
          <ArrowUpRight size={22} aria-hidden="true" />
        </a>
        <div className="contact-actions">
          <a href={github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <button onClick={copy} aria-label="Copy email address">
            {status === "Email copied." ? (
              <Check size={14} />
            ) : (
              <Copy size={14} />
            )}{" "}
            Copy email
          </button>
        </div>
        <p role="status">{status}</p>
      </div>
      <div className="footer-colophon">
        <span>Amrit Kang</span>
        <span>Bengaluru, India</span>
      </div>
    </footer>
  );
}

export default function Chapters() {
  const routeRoot = useRef(null);
  const animateNavigation = useRef(false);
  const dialog = useRef(null);
  const opener = useRef(null);
  const [activePhoto, setActivePhoto] = useState(null);
  const [destination, setDestination] = useState(() =>
    window.location.hash.slice(1),
  );
  useEffect(() => {
    const navigate = () => {
      dialog.current?.close();
      setActivePhoto(null);
      setDestination(window.location.hash.slice(1));
    };
    window.addEventListener("hashchange", navigate);
    return () => window.removeEventListener("hashchange", navigate);
  }, []);
  useEffect(() => {
    if (!["chapters", "projects", "hosted-events"].includes(destination))
      return;
    let cancelled = false;
    let frame;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        document.getElementById(destination)?.scrollIntoView({
          behavior:
            animateNavigation.current &&
            !matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "smooth"
              : "instant",
        });
        animateNavigation.current = false;
        const heading =
          destination === "chapters"
            ? "choices-heading"
            : destination === "projects"
              ? "projects-heading"
              : "events-heading";
        document.getElementById(heading)?.focus({ preventScroll: true });
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [destination]);
  useEffect(() => {
    if (activePhoto === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.current.open) dialog.current.showModal();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [activePhoto]);
  const openPhoto = (index) => {
    opener.current = document.activeElement;
    setActivePhoto(index);
  };
  const closePhoto = () => {
    dialog.current.close();
    setActivePhoto(null);
    opener.current?.focus({ preventScroll: true });
  };
  const stepPhoto = (direction) =>
    setActivePhoto(
      (index) => (index + direction + photos.length) % photos.length,
    );
  const photo = activePhoto === null ? null : photos[activePhoto];
  return (
    <div className="journal-chapters" ref={routeRoot}>
      <ConnectedRoad root={routeRoot} destination={destination} />
      <nav
        className="chapter-crossroads chapter-shell"
        id="chapters"
        aria-label="Choose a portfolio chapter"
      >
        <div className="crossroads-heading">
          <span className="editorial-label">TWO SIDES OF WHAT I DO</span>
          <h2 id="choices-heading" tabIndex={-1}>
            Where to?
          </h2>
          <p>Pick a road. I’ll meet you there.</p>
        </div>
        <div className="road-space" aria-hidden="true" />
        <div className="chapter-choices">
          <a
            href="#projects"
            className="chapter-choice"
            onClick={() => {
              animateNavigation.current = true;
            }}
            aria-current={destination === "projects" ? "location" : undefined}
          >
            <small>01 / SELECTED WORK</small>
            <strong>
              <span>Projects</span> <ArrowUpRight aria-hidden="true" />
            </strong>
            <span>Interfaces, systems, and things I wanted to exist.</span>
          </a>
          <a
            href="#hosted-events"
            className="chapter-choice"
            onClick={() => {
              animateNavigation.current = true;
            }}
            aria-current={
              destination === "hosted-events" ? "location" : undefined
            }
          >
            <small>02 / COMMUNITY</small>
            <strong>
              <span>Events I hosted</span> <ArrowUpRight aria-hidden="true" />
            </strong>
            <span>Getting people into a room. Making it happen.</span>
          </a>
        </div>
      </nav>

      {destination === "projects" && (
        <section
          className="projects-chapter chapter-shell project-world"
          id="projects"
          aria-labelledby="projects-heading"
        >
          <div className="chapter-entry">
            <span className="road-arrival">
              <i aria-hidden="true" />
              01 / PROJECTS
            </span>
            <a className="chapter-return editorial-link" href="#chapters">
              <ArrowLeft size={16} aria-hidden="true" /> choose another road
            </a>
          </div>
          <header className="chapter-heading">
            <span className="editorial-label">SELECTED WORK / 01—04</span>
            <h2 id="projects-heading" tabIndex={-1}>
              At my desk.
            </h2>
            <p>Four projects, four different problems. Pick one to open.</p>
          </header>
          <ProjectWorkspace projects={projects} />
          <div className="chapter-bottom">
            <a
              className="editorial-link"
              href={github}
              target="_blank"
              rel="noreferrer"
            >
              All repositories <ArrowUpRight size={16} />
            </a>
            <a className="editorial-link" href="#chapters">
              back to the two paths ↑
            </a>
          </div>
        </section>
      )}

      {destination === "hosted-events" && (
        <section
          className="events-chapter chapter-shell event-world"
          id="hosted-events"
          aria-labelledby="events-heading"
        >
          <div className="chapter-entry">
            <span className="road-arrival">
              <i aria-hidden="true" />
              02 / EVENTS I HOSTED
            </span>
            <a className="chapter-return editorial-link" href="#chapters">
              <ArrowLeft size={16} aria-hidden="true" /> choose another road
            </a>
          </div>
          <header className="chapter-heading">
            <span className="editorial-label">
              THE CAMERA ROLL / HOSTING & COMMUNITY
            </span>
            <h2 id="events-heading" tabIndex={-1}>
              On the other
              <br />
              side of the mic.
            </h2>
            <p>
              Events I organized in Bengaluru. These are the people and moments
              I remember.
            </p>
          </header>
          <article className="sunbeam-story" aria-labelledby="sunbeam-heading">
            <div className="sunbeam-event-card">
              <header className="sunbeam-card-heading">
                <div>
                  <span className="editorial-label">
                    HACKCLUB · ALL-GIRLS HACKATHON
                  </span>
                  <h3 id="sunbeam-heading">Sunbeam</h3>
                </div>
                <span className="sunbeam-edition">Bengaluru edition</span>
              </header>
              <div className="sunbeam-card-feature">
                <figure className="sunbeam-card-photo">
                  <img
                    src="/images/events/sunbeam-community.jpeg"
                    alt="The Sunbeam Bengaluru participants together at Scaler"
                    width="1280"
                    height="720"
                    loading="lazy"
                  />
                  <figcaption>Sunbeam Bengaluru · Hosted at Scaler</figcaption>
                </figure>
                <div className="sunbeam-card-context">
                  <p className="sunbeam-reach">
                    <strong>40</strong>
                    <span>cities worldwide</span>
                  </p>
                  <p className="sunbeam-context-copy">
                    Girls coming together to build, across the world. Our
                    Bengaluru edition took place at Scaler.
                  </p>
                  <dl className="sunbeam-facts">
                    <div>
                      <dt>My role</dt>
                      <dd>Main organizer · Bengaluru</dd>
                    </div>
                    <div>
                      <dt>Behind the day</dt>
                      <dd>1.5 months of preparation</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
            <SunbeamMoment
              portrait={<EventPhoto index={1} onOpen={openPhoto} />}
              community={<EventPhoto index={0} onOpen={openPhoto} />}
            />
            <div
              className="sunbeam-team-spread"
              id="sunbeam-after-moment"
              tabIndex={-1}
            >
              <div>
                <span className="editorial-label">
                  03 / THE PEOPLE BEHIND THE DAY
                </span>
                <h4>The team behind Sunbeam</h4>
                <p>
                  I led the Bengaluru edition, and these are the people who
                  helped make the day happen at Scaler.
                </p>
              </div>
              <figure className="sunbeam-team">
                <EventPhoto index={2} onOpen={openPhoto} />
                <figcaption>The Sunbeam team at Scaler.</figcaption>
              </figure>
            </div>
          </article>
          <article
            className="tinyfish-story"
            aria-labelledby="tinyfish-heading"
          >
            <div className="event-title-row">
              <div>
                <span className="editorial-label">
                  02 / TINYFISH × IGNITE ROOM
                </span>
                <h3 id="tinyfish-heading">Three in a row.</h3>
              </div>
              <div className="event-metadata">
                <span className="event-role">EVENT LEAD · IGNITE ROOM</span>
                <p>
                  Three back-to-back hackathons in Bengaluru.
                  <br />
                  Photographs from Quad AI and Scaler.
                </p>
              </div>
            </div>
            <div className="tinyfish-album">
              <figure>
                <EventPhoto index={3} onOpen={openPhoto} />
                <figcaption>
                  <span>01 — Quad AI</span>
                  <span>Bengaluru</span>
                </figcaption>
              </figure>
              <figure>
                <EventPhoto index={4} onOpen={openPhoto} />
                <figcaption>
                  <span>02 — Scaler</span>
                  <span>Bengaluru</span>
                </figcaption>
              </figure>
            </div>
            <div className="tinyfish-after">
              <aside
                className="event-memory tinyfish-memory"
                aria-label="Amrit’s TinyFish memory"
              >
                <span className="editorial-label">WHAT MY DAY LOOKED LIKE</span>
                <blockquote>
                  “Resolving people’s doubts. Making sure everything was going
                  smoothly.”
                </blockquote>
              </aside>
              <figure>
                <EventPhoto index={5} onOpen={openPhoto} />
                <figcaption>Event Lead, Ignite Room.</figcaption>
              </figure>
            </div>
          </article>
          <div className="chapter-bottom">
            <span className="editorial-label">MORE TO REMEMBER.</span>
            <a className="editorial-link" href="#chapters">
              back to the two paths ↑
            </a>
          </div>
        </section>
      )}
      <Contact />
      <dialog
        className="photo-dialog"
        ref={dialog}
        aria-label="Event photo gallery"
        onCancel={(event) => {
          event.preventDefault();
          closePhoto();
        }}
        onClick={(event) => {
          if (event.target === dialog.current) closePhoto();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            stepPhoto(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            stepPhoto(-1);
          }
        }}
      >
        {photo && (
          <div className="photo-dialog-content">
            <button
              className="gallery-close"
              onClick={closePhoto}
              aria-label="Close photo gallery"
              autoFocus
            >
              <X size={22} />
            </button>
            <img
              className="gallery-image"
              src={"/images/events/" + photo.src}
              alt={photo.alt}
            />
            <div className="gallery-controls">
              <button onClick={() => stepPhoto(-1)} aria-label="Previous photo">
                <ArrowLeft size={20} />
              </button>
              <p aria-live="polite">
                {photo.caption}
                <small>
                  {activePhoto + 1} / {photos.length}
                </small>
              </p>
              <button onClick={() => stepPhoto(1)} aria-label="Next photo">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
