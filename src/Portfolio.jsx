import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Github,
  Mail,
  Download,
  Sparkles,
  Code2,
  GitPullRequest,
  Check,
  MapPin,
  Heart,
  Pause,
  Play,
  X,
  Menu,
} from "lucide-react";
import "./styles.css";

const ShaderReveal = lazy(() => import("./ShaderReveal.jsx"));
const GH = "https://github.com/amritkang165";
const paths = [
  {
    id: "projects",
    name: "the project studio",
    short: "Projects",
    note: "little ideas, real things.",
    icon: "studio",
    color: "pink",
  },
  {
    id: "events",
    name: "the gathering place",
    short: "Events",
    note: "good people. big energy.",
    icon: "tent",
    color: "yellow",
  },
  {
    id: "opensource",
    name: "the open-source garden",
    short: "Open source",
    note: "better when we grow together.",
    icon: "garden",
    color: "green",
  },
  {
    id: "little-things",
    name: "the daydream corner",
    short: "Little things",
    note: "the wonderfully random bits.",
    icon: "house",
    color: "lavender",
  },
];
const projects = [
  {
    name: "MERAWARD",
    kicker: "A LITTLE MORE CIVIC POWER",
    desc: "Find your Delhi ward, report a problem by voice or photo, and turn it into an AI-drafted bilingual letter. Built to make civic accountability a little more accessible.",
    tags: ["React", "AWS", "Python"],
    type: "Web & AI",
    url: `${GH}/meraward`,
    live: "https://main.d1s6q0cvldi6dz.amplifyapp.com/",
    art: "ward",
    color: "peach",
  },
  {
    name: "Pocki",
    kicker: "SMALL APP. PEACE OF MIND.",
    desc: "A native iOS money companion that turns UPI screenshots into expenses. Offline-first, on-device, and built to keep your financial life yours.",
    tags: ["Swift 6", "SwiftUI", "SwiftData"],
    type: "iOS",
    url: `${GH}/Pocki`,
    art: "pocki",
    color: "rose",
  },
  {
    name: "ReGit",
    kicker: "RESEARCH HAS A HISTORY, TOO.",
    desc: "A research-native version-control project with semantic diffs, collaborative editing, and search across research artifacts. Built with a hackathon team.",
    tags: ["Python", "FastAPI", "React"],
    type: "Systems",
    url: `${GH}/ReGit`,
    live: "https://regit.vercel.app/",
    art: "regit",
    color: "sage",
  },
  {
    name: "Placement Week Scheduler",
    kicker: "A LITTLE ORDER IN THE CHAOS",
    desc: "A constraint solver that schedules interviews without clashes—and replans just the affected appointments when life happens.",
    tags: ["Python", "OR-Tools", "FastAPI"],
    type: "Systems",
    url: `${GH}/placement-week-scheduler`,
    art: "schedule",
    color: "butter",
  },
];
const contributions = [
  {
    repo: "flisk-sh / flisk",
    title: "A friendlier developer experience",
    detail: "Added a JSON Schema for service.json configuration.",
    number: "#416",
    date: "02 OCT 2026",
    url: "https://github.com/flisk-sh/flisk/pull/416",
  },
  {
    repo: "muneer406 / Sudoku-Solver-Python",
    title: "One less bug in the puzzle",
    detail: "Fixed fillGrid() discarding grid corrections on retry.",
    number: "#4",
    date: "16 SEP 2026",
    url: "https://github.com/muneer406/Sudoku-Solver-Python/pull/4",
  },
  {
    repo: "Muneer320 / ReGit",
    title: "Making the docs a little clearer",
    detail: "Corrected the README explanation of agent editing branches.",
    number: "#16",
    date: "16 SEP 2026",
    url: "https://github.com/Muneer320/ReGit/pull/16",
  },
  {
    repo: "Muneer320 / ReGit",
    title: "Building with the ReGit team",
    detail: "Merged a contribution spanning 30 files into the shared project.",
    number: "#15",
    date: "22 AUG 2026",
    url: "https://github.com/Muneer320/ReGit/pull/15",
  },
];

function Flower({ className = "", color = "currentColor" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill={color}
      aria-hidden="true"
    >
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse
          key={a}
          cx="50"
          cy="27"
          rx="14"
          ry="23"
          transform={`rotate(${a} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="13" fill="#fff7df" />
    </svg>
  );
}
function Bow({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 80"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M55 32C35 10 9 7 9 25c0 25 17 27 45 16M65 32C85 10 111 7 111 25c0 25-17 27-45 16"
        fill="#e9a3b8"
        stroke="#a74261"
        strokeWidth="2"
      />
      <path
        d="M56 43 34 74l-2-20-17 1 35-18m16 6 22 31 2-20 17 1-35-18"
        fill="#e9a3b8"
        stroke="#a74261"
        strokeWidth="2"
      />
      <ellipse
        cx="60"
        cy="36"
        rx="10"
        ry="13"
        fill="#f2b7cb"
        stroke="#a74261"
        strokeWidth="2"
      />
    </svg>
  );
}
function Landmark({ type }) {
  return (
    <svg
      className="landmark"
      viewBox="0 0 220 170"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="110" cy="151" rx="85" ry="12" fill="#356345" opacity=".08" />
      {type === "studio" && (
        <>
          <path
            d="M45 69h130v78H45z"
            fill="#f8c2cd"
            stroke="#8b574f"
            strokeWidth="2"
          />
          <path
            d="m31 69 30-41h97l31 41z"
            fill="#bb5567"
            stroke="#8b574f"
            strokeWidth="2"
          />
          <path
            d="M57 28v41m25-41v41m26-41v41m25-41v41m25-41v41"
            stroke="#f9d7db"
            strokeWidth="10"
          />
          <rect
            x="58"
            y="83"
            width="44"
            height="36"
            rx="3"
            fill="#fffaed"
            stroke="#8b574f"
            strokeWidth="2"
          />
          <path d="M80 84v35M58 101h44" stroke="#8b574f" />
          <rect
            x="121"
            y="87"
            width="32"
            height="60"
            rx="15"
            fill="#fffaed"
            stroke="#8b574f"
            strokeWidth="2"
          />
          <circle cx="144" cy="121" r="2" fill="#8b574f" />
          <path d="M45 147h130" stroke="#8b574f" strokeWidth="4" />
          <text
            x="110"
            y="21"
            textAnchor="middle"
            fill="#854557"
            fontSize="12"
            fontFamily="monospace"
          >
            MAKE SOMETHING ♡
          </text>
          <path
            d="M22 148v-30m-7 11 7 8 8-13m169 23v-35m-8 16 8 7 9-11"
            stroke="#6b8b58"
            strokeWidth="3"
          />
        </>
      )}
      {type === "tent" && (
        <>
          <path
            d="m30 143 80-111 80 111z"
            fill="#f1cc74"
            stroke="#8e7141"
            strokeWidth="2"
          />
          <path d="m110 32 18 111H92z" fill="#fffaea" />
          <path d="m110 32 52 111h28zm0 0L58 143H30z" fill="#e7a377" />
          <path
            d="M110 32V9m0 1 33 8-33 10"
            stroke="#8e7141"
            strokeWidth="2"
            fill="#d88092"
          />
          <path d="m87 143 23-56 23 56" fill="#936e55" />
          <path d="M14 56q96 47 192 0" stroke="#8e7141" strokeWidth="2" />
          <path
            d="m25 61 7 18 13-12m21 5 10 17 11-14m31 0 11 15 10-18m25-5 13 13 8-19"
            fill="#d78299"
          />
          <path d="M19 143h182" stroke="#8e7141" strokeWidth="2" />
        </>
      )}
      {type === "garden" && (
        <>
          <path
            d="M31 149V91m23 58V91m23 58V91m67 58V91m23 58V91m23 58V91M25 109h58m56 0h57M25 136h58m56 0h57"
            stroke="#a1ae78"
            strokeWidth="8"
          />
          <path
            d="M86 149V77a25 25 0 0 1 50 0v72"
            stroke="#5e8059"
            strokeWidth="7"
          />
          <path
            d="M97 139c-25-46-32-82-16-106m52 94c28-46 21-81 6-103"
            stroke="#5e8059"
            strokeWidth="3"
          />
          <path
            d="M78 69c-25 0-27-19-27-19 23-6 30 5 27 19m4-22c19-4 19-22 19-22-19-4-23 9-19 22m62 24c25 0 27-19 27-19-23-6-30 5-27 19m-5-25c-19-4-19-22-19-22 19-4 23 9 19 22"
            fill="#87a172"
          />
          <g fill="#df9caf">
            <circle cx="78" cy="35" r="13" />
            <circle cx="146" cy="67" r="12" />
            <circle cx="95" cy="107" r="10" />
          </g>
          <g fill="#fff3c8">
            <circle cx="78" cy="35" r="4" />
            <circle cx="146" cy="67" r="4" />
            <circle cx="95" cy="107" r="3" />
          </g>
        </>
      )}
      {type === "house" && (
        <>
          <path
            d="M50 75h120v73H50z"
            fill="#e2cde6"
            stroke="#89708e"
            strokeWidth="2"
          />
          <path
            d="m35 76 75-57 75 57z"
            fill="#b78bac"
            stroke="#89708e"
            strokeWidth="2"
          />
          <path
            d="M151 48V23h15v36"
            fill="#d3b3d2"
            stroke="#89708e"
            strokeWidth="2"
          />
          <rect
            x="91"
            y="100"
            width="37"
            height="48"
            rx="18"
            fill="#fff4dc"
            stroke="#89708e"
            strokeWidth="2"
          />
          <path
            d="M65 91h16v23H65zm75 0h16v23h-16z"
            fill="#fff4dc"
            stroke="#89708e"
            strokeWidth="2"
          />
          <path d="M109 57c-11-14-24 2 0 16 24-14 11-30 0-16" fill="#f8d0d7" />
          <path
            d="m23 80 3-12 4 12 12 3-12 3-4 12-3-12-12-3zm166-35 3-12 4 12 12 3-12 3-4 12-3-12-12-3z"
            fill="#d8af62"
          />
          <path d="M95 151q-6 8-20 12h65q-17-8-19-12" fill="#d4c7ae" />
        </>
      )}
    </svg>
  );
}
function useScrollStory(paused) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((e) => observer.observe(e));
    let frame;
    const update = () => {
      frame = null;
      const max = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty(
        "--page-progress",
        `${max > 0 ? (scrollY / max) * 100 : 0}%`,
      );
      const scene = document.querySelector(".journey"),
        path = document.querySelector("#journey-line"),
        traveler = document.querySelector(".road-traveler");
      if (scene && path && traveler) {
        const r = scene.getBoundingClientRect(),
          progress = Math.max(
            0,
            Math.min(1, (innerHeight * 0.65 - r.top) / r.height),
          ),
          length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length * (1 - progress)}`;
        const point = path.getPointAtLength(length * progress);
        traveler.setAttribute("transform", `translate(${point.x}, ${point.y})`);
      }
      if (!paused)
        document.documentElement.style.setProperty(
          "--drift",
          `${Math.min(scrollY, 1100) * 0.075}px`,
        );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [paused]);
}
function ProjectArt({ type }) {
  if (type === "pocki")
    return (
      <div className="project-art pocki-art" aria-hidden="true">
        <span className="art-note">
          your money,
          <br />a little softer.
        </span>
        <div className="phone">
          <div className="phone-notch" />
          <span>hello, amrit ♡</span>
          <small>YOUR LITTLE MONEY WORLD</small>
          <strong>
            ₹ 12,480<span>.00</span>
          </strong>
          <div className="phone-chart">
            {[30, 60, 45, 75, 52, 90, 70].map((h, i) => (
              <i key={i} style={{ height: h }} />
            ))}
          </div>
          <div className="transaction">
            <span>☕ a little treat</span>
            <b>₹ 180</b>
          </div>
          <div className="transaction">
            <span>✿ saved for later</span>
            <b>₹ 500</b>
          </div>
        </div>
        <Flower className="art-flower" color="#b84f6a" />
      </div>
    );
  if (type === "ward")
    return (
      <div className="project-art ward-art" aria-hidden="true">
        <div className="map-grid" />
        <div className="map-river" />
        <div className="map-pin">
          <MapPin size={38} fill="#bb5f51" color="#fff8e8" />
        </div>
        <div className="map-label">
          <span className="tiny-dot" /> YOUR NEIGHBOURHOOD, HEARD.
        </div>
        <div className="map-report">
          <span>MERAWARD</span>
          <strong>
            Small voices.
            <br />
            Real change.
          </strong>
          <i>
            Find my ward <ArrowUpRight size={16} />
          </i>
        </div>
      </div>
    );
  if (type === "regit")
    return (
      <div className="project-art regit-art" aria-hidden="true">
        <span className="art-note">
          every idea
          <br />
          has a story.
        </span>
        <div className="research-window">
          <div className="window-bar">
            <i />
            <i />
            <i />
            <span>research / a little breakthrough</span>
          </div>
          <div className="commit-tree">
            <span>✦ first thought</span>
            <span>↳ a different direction</span>
            <span>↳ the breakthrough</span>
          </div>
          <div className="diff-line">+ keep the good ideas.</div>
          <div className="diff-line">+ and how you got there.</div>
        </div>
      </div>
    );
  return (
    <div className="project-art scheduler-art" aria-hidden="true">
      <div className="calendar-art">
        <header>
          one wonderfully organised week <span>✷</span>
        </header>
        <div className="calendar-grid">
          {["MON", "TUE", "WED", "THU", "FRI"].map((d) => (
            <b key={d}>{d}</b>
          ))}
          {Array.from({ length: 15 }, (_, i) => (
            <i key={i} className={`slot slot-${i % 4}`}>
              {i % 3 === 0
                ? "interview"
                : i % 3 === 1
                  ? "a little break"
                  : "all set ✓"}
            </i>
          ))}
        </div>
      </div>
      <span className="calendar-sticker">
        zero
        <br />
        clashes ♡
      </span>
    </div>
  );
}
function Projects() {
  const [filter, setFilter] = useState("All");
  return (
    <>
      <div className="destination-heading">
        <span className="eyebrow">01 / THE PROJECT STUDIO</span>
        <h2>
          Made with curiosity.
          <br />
          <em>And probably coffee.</em>
        </h2>
        <p>
          Things I’ve built, problems I’ve chased, and ideas that made it out of
          my notes app.
        </p>
      </div>
      <div className="project-filters" aria-label="Filter projects">
        {["All", "Web & AI", "iOS", "Systems"].map((f) => (
          <button
            key={f}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={filter === f ? "selected" : ""}
          >
            {f}
            {f === "All" && <span>04</span>}
          </button>
        ))}
      </div>
      <div className="projects-grid">
        {projects
          .filter((p) => filter === "All" || p.type === filter)
          .map((p) => (
            <article className={`project-card ${p.color}`} key={p.name}>
              <ProjectArt type={p.art} />
              <div className="project-copy">
                <span className="eyebrow">{p.kicker}</span>
                <div className="project-title">
                  <h3>{p.name}</h3>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View ${p.name} on GitHub`}
                  >
                    <ArrowUpRight />
                  </a>
                </div>
                <p>{p.desc}</p>
                <div className="project-bottom">
                  <div className="tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noreferrer">
                      Live <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
      </div>
      <a
        className="text-link more-projects"
        href={`${GH}?tab=repositories`}
        target="_blank"
        rel="noreferrer"
      >
        There’s more where that came from <Github size={17} />
        <ArrowUpRight size={17} />
      </a>
    </>
  );
}
function Events() {
  return (
    <>
      <div className="destination-heading">
        <span className="eyebrow">02 / THE GATHERING PLACE</span>
        <h2>
          Good things happen
          <br />
          <em>when we show up.</em>
        </h2>
        <p>
          Hackathons, community, and the people who make building things even
          better.
        </p>
      </div>
      <div className="community-grid">
        <article className="community-card">
          <Landmark type="tent" />
          <span className="eyebrow">JUL 2026 — PRESENT</span>
          <h3>HackClub · Sunbeam</h3>
          <span className="role">Bengaluru Organizer</span>
          <p>
            Leading Bengaluru operations for a global initiative spanning 40
            cities. Making room for people to build, learn, and find their
            people.
          </p>
        </article>
        <article className="community-card">
          <Flower className="event-flower" color="#d78d9f" />
          <span className="eyebrow">AUG 2026 — PRESENT</span>
          <h3>Ignite Room</h3>
          <span className="role">Events Lead</span>
          <p>
            From venues and volunteers to speakers and partners: bringing the
            moving pieces together so the community can come together.
          </p>
        </article>
      </div>
      <h3 className="subheading">
        A few places I’ve built things <span>↘</span>
      </h3>
      <div className="event-list">
        {[
          [
            "Top 6",
            "Gradient Rush",
            "ReGit · research-native version control",
            `${GH}/ReGit`,
          ],
          [
            "Top 7 finalist",
            "ProdX Hackathon",
            "iffy.ai · frontend development",
            `${GH}/iffy-ai`,
          ],
          [
            "Built & shipped",
            "Replit Hackathon",
            "Oratio · a voice-enabled AI debate platform",
            `${GH}/Oratio`,
          ],
          [
            "Built & shipped",
            "Hackarena",
            "exHacker · a seven-agent hackathon pipeline",
            `${GH}/exHacker`,
          ],
          [
            "Built & shipped",
            "RIFT Hackathon",
            "LaunderLens · graph-based fraud detection",
            `${GH}/Launder-Lens`,
          ],
        ].map(([award, title, detail, url]) => (
          <a href={url} key={title} target="_blank" rel="noreferrer">
            <span className="event-award">{award}</span>
            <div>
              <h4>{title}</h4>
              <p>{detail}</p>
            </div>
            <ArrowUpRight />
          </a>
        ))}
      </div>
    </>
  );
}
function OpenSource() {
  return (
    <>
      <div className="destination-heading">
        <span className="eyebrow">03 / THE OPEN-SOURCE GARDEN</span>
        <h2>
          A little contribution.
          <br />
          <em>A shared kind of growth.</em>
        </h2>
        <p>
          Fixing a bug, improving the docs, building together. Every little bit
          counts.
        </p>
      </div>
      <div className="garden-summary">
        <Flower color="#72895e" />
        <div>
          <strong>4 merged contributions</strong>
          <p>
            Across three other repositories. Each one links to the actual pull
            request.
          </p>
        </div>
        <GitPullRequest size={38} />
      </div>
      <div className="contribution-list">
        {contributions.map((c) => (
          <a
            className="contribution"
            href={c.url}
            key={c.url}
            target="_blank"
            rel="noreferrer"
          >
            <div className="merge-icon">
              <GitPullRequest size={22} />
            </div>
            <div>
              <span className="eyebrow">{c.repo}</span>
              <h3>{c.title}</h3>
              <p>{c.detail}</p>
              <div className="contribution-meta">
                <span>
                  <Check size={12} /> Merged
                </span>
                <span>{c.number}</span>
                <time>{c.date}</time>
              </div>
            </div>
            <ArrowUpRight />
          </a>
        ))}
      </div>
      <div className="opensource-note">
        <span>Also growing in my own garden…</span>
        <h3>Pocki is open source, too.</h3>
        <p>
          An MIT-licensed, native iOS finance tracker. Come have a look around.
        </p>
        <a
          className="text-link"
          href={`${GH}/Pocki`}
          target="_blank"
          rel="noreferrer"
        >
          Explore the repository <ArrowUpRight size={18} />
        </a>
      </div>
    </>
  );
}
function LittleThings({ paused }) {
  const [bubbles, setBubbles] = useState([]),
    timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  function blowBubbles() {
    setBubbles(
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: 5 + ((i * 17) % 90),
        delay: i * 0.1,
        size: 22 + ((i * 11) % 45),
      })),
    );
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setBubbles([]), 5500);
  }
  return (
    <>
      <div className="destination-heading">
        <span className="eyebrow">04 / THE DAYDREAM CORNER</span>
        <h2>
          Not everything
          <br />
          <em>goes on a résumé.</em>
        </h2>
        <p>
          The side quests, the plot twists, and the tiny things that make me,
          me.
        </p>
      </div>
      <div className="memory-grid">
        <article className="memory memo-yellow">
          <span className="memory-doodle">✧</span>
          <span className="eyebrow">THE ORIGINAL PLAN</span>
          <h3>
            Little me wanted
            <br />
            to be an IAS officer.
          </h3>
          <p>
            The plot took a turn.
            <br />
            The curiosity stayed.
          </p>
          <span className="handwriting">some dreams change shape ♡</span>
        </article>
        <article className="memory memo-pink">
          <span className="chess-piece" aria-hidden="true">
            ♞
          </span>
          <span className="eyebrow">AFTER THE SCHOOL BELL</span>
          <h3>
            Chess was
            <br />
            my thing.
          </h3>
          <p>
            A school chess player, thinking a few moves ahead. Some habits
            stick.
          </p>
        </article>
        <article className="memory memo-green">
          <span className="memory-doodle">♫</span>
          <span className="eyebrow">A DIFFERENT KIND OF RHYTHM</span>
          <h3>
            Two years
            <br />
            of Kathak.
          </h3>
          <p>
            Before keyboard clicks, there were footwork, rhythm, and a whole lot
            of practice.
          </p>
          <span className="handwriting">still a part of me.</span>
        </article>
      </div>
      <div className="dreams-heading">
        <span className="handwriting">dear universe, just saying…</span>
        <h3>The dreams-still-pending shelf</h3>
        <p>Growing up is optional in this particular corner.</p>
      </div>
      <div className="wishlist">
        <article className="wish-card">
          <div className="wish-photo">
            <img
              src="/images/bubble-machine.jpg"
              alt="A pink soap bubble machine with a carry handle"
              loading="lazy"
            />
            <span className="wish-number">wish no. 01</span>
          </div>
          <h4>A soap bubble machine</h4>
          <p>
            For absolutely no practical reason.
            <br />
            And that’s the whole point.
          </p>
          <button className="text-link" onClick={blowBubbles}>
            Make a little magic <Sparkles size={17} />
          </button>
          <div
            className={`bubble-field ${paused ? "still-bubbles" : ""}`}
            aria-hidden="true"
          >
            {bubbles.map((b) => (
              <i
                className="bubble"
                key={b.id}
                style={{
                  left: `${b.x}%`,
                  width: b.size,
                  height: b.size,
                  animationDelay: `${b.delay}s`,
                }}
              />
            ))}
          </div>
          <span role="status" className="sr-only">
            {bubbles.length ? "A little cloud of bubbles, just for you." : ""}
          </span>
        </article>
        <article className="wish-card">
          <div className="wish-photo">
            <img
              src="/images/dreamhouse.jpg"
              alt="A big pink Barbie Dreamhouse with three floors and a spiral slide"
              loading="lazy"
            />
            <span className="wish-number">wish no. 02</span>
          </div>
          <h4>The big Barbie dreamhouse</h4>
          <p>
            Yes, the big one. The whole set.
            <br />
            Little me is still waiting.
          </p>
          <span className="handwriting">one day, girl. one day. ♡</span>
        </article>
      </div>
      <details className="image-credits">
        <summary>Photos on the dream shelf</summary>
        <p>
          Bubble machine photo:{" "}
          <a
            href="https://www.discopartylight.com/bubble-machines/180.html"
            target="_blank"
            rel="noreferrer"
          >
            Qiaohua
          </a>
          . Barbie Dreamhouse photo:{" "}
          <a
            href="https://www.mykingdom.com.vn/en/products/ngoi-nha-trong-mo-cua-barbie-phien-ban-2023-hmx10"
            target="_blank"
            rel="noreferrer"
          >
            Mykingdom / Mattel
          </a>
          . These are wishlist items.
        </p>
      </details>
    </>
  );
}
export default function Portfolio() {
  const [paused, setPaused] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [active, setActive] = useState(
    () => paths.find((p) => p.id === location.hash.slice(1))?.id || "projects",
  );
  const [menuOpen, setMenuOpen] = useState(false),
    destination = useRef();
  useScrollStory(paused);
  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "reduced" : "full";
    return () => delete document.documentElement.dataset.motion;
  }, [paused]);
  useEffect(() => {
    const hashChange = () => {
      const p = paths.find((p) => p.id === location.hash.slice(1));
      if (p) {
        setActive(p.id);
        requestAnimationFrame(() =>
          destination.current?.scrollIntoView({ behavior: "instant" }),
        );
      }
    };
    hashChange();
    addEventListener("hashchange", hashChange);
    return () => removeEventListener("hashchange", hashChange);
  }, []);
  function choosePath(id) {
    setActive(id);
    setMenuOpen(false);
    history.pushState(null, "", `#${id}`);
    requestAnimationFrame(() => {
      destination.current?.scrollIntoView({
        behavior: paused ? "instant" : "smooth",
        block: "start",
      });
      destination.current?.focus({ preventScroll: true });
    });
  }
  const current = paths.find((p) => p.id === active);
  return (
    <div className="portfolio">
      <a className="skip-link" href="#about">
        Skip to my profile
      </a>
      <div className="reading-progress" />
      <header className="site-header">
        <a href="#home" className="brand" aria-label="Amrit's world, home">
          <Flower />
          <span>
            amrit’s<span className="brand-script"> little world</span>
          </span>
        </a>
        <nav
          aria-label="Main navigation"
          className={menuOpen ? "nav-open" : ""}
        >
          <a href="#about" onClick={() => setMenuOpen(false)}>
            the girl
          </a>
          <a href="#crossroads" onClick={() => setMenuOpen(false)}>
            the map
          </a>
          <button onClick={() => choosePath("projects")}>the work</button>
          <a href="mailto:amritkang2805@icloud.com" className="nav-contact">
            say hello <ArrowUpRight size={16} />
          </a>
        </nav>
        <button
          className="mobile-menu icon-button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>
      <main>
        <section className="hero" id="home" aria-labelledby="hero-heading">
          <div className="hero-topline">
            <span className="tiny-star">✳</span> A DEVELOPER’S PORTFOLIO, WITH A
            LITTLE EXTRA HEART <span className="tiny-star">✳</span>
          </div>
          <h1 id="hero-heading">
            hello, <em>world.</em>
            <span className="title-star">✧</span>
          </h1>
          <p className="hero-intro">
            I’m Amrit. I build things, follow little curiosities,
            <br />
            and believe there’s always room for a little whimsy.
          </p>
          <div className="hero-collage">
            <span className="collage-sparkle sparkle-one" aria-hidden="true">
              ✦
            </span>
            <div className="portrait-polaroid">
              <span className="tape" />
              <img
                src="/images/amrit.jpg"
                alt="Amrit Kang smiling, wearing glasses and a black shirt"
                fetchPriority="high"
              />
              <span className="handwriting">the girl behind the pixels ♡</span>
              <span className="portrait-caption">oh hey, that’s me!</span>
            </div>
            <div className="kitty-card">
              <Bow className="kitty-bow" />
              <div className="kitty-image">
                <img
                  src="/images/hello-kitty.jpg"
                  alt="Hello Kitty wearing a pink bow and holding a phone"
                  fetchPriority="high"
                />
                {!paused && (
                  <Suspense fallback={null}>
                    <ShaderReveal src="/images/hello-kitty.jpg" />
                  </Suspense>
                )}
              </div>
              <div className="kitty-card-footer">
                <span>HELLO KITTY, HELLO POSSIBILITY.</span>
                <Heart size={15} />
              </div>
            </div>
            <div className="hero-note">
              <span className="note-pin" />
              <span className="handwriting">a small reminder</span>
              <p>
                you can build
                <br />
                serious things
                <br />
                <em>and still love pink.</em>
              </p>
              <svg viewBox="0 0 130 55" aria-hidden="true">
                <path
                  d="M10 15q55 50 105 0m-17 3 19-6-5 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="round-stamp">
              <span>MADE OF CURIOSITY</span>
              <Flower color="#7d8e64" />
              <span>& A LITTLE BIT OF MAGIC</span>
            </div>
            <span className="collage-sparkle sparkle-two" aria-hidden="true">
              ✧
            </span>
            <span className="hero-aside">
              based in bengaluru · dreaming everywhere
            </span>
          </div>
          <a className="journey-start" href="#about">
            <span>come, take the scenic route</span>
            <span className="round-arrow">
              <ArrowDown size={20} />
            </span>
          </a>
          <div className="hero-bottom">
            <span>A WORK IN PROGRESS. JUST LIKE ME.</span>
            <span>SCROLL TO WANDER ↓</span>
          </div>
        </section>
        <div className="journey">
          <svg
            className="journey-road"
            viewBox="0 0 1200 1480"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M600 0C600 190 1050 30 1060 285S160 465 180 720 780 855 600 1060 610 1300 600 1480"
              className="road-edge"
            />
            <path
              d="M600 0C600 190 1050 30 1060 285S160 465 180 720 780 855 600 1060 610 1300 600 1480"
              className="road-base"
            />
            <path
              id="journey-line"
              d="M600 0C600 190 1050 30 1060 285S160 465 180 720 780 855 600 1060 610 1300 600 1480"
              className="road-line"
            />
            <g className="road-traveler">
              <circle r="22" fill="#bc5f78" stroke="#fff8e9" strokeWidth="5" />
              <path d="M0 8C-22-5-5-18 0-7 5-18 22-5 0 8" fill="#fff8e9" />
            </g>
          </svg>
          <section
            className="about section-shell"
            id="about"
            aria-labelledby="about-heading"
          >
            <div className="about-photo" data-reveal>
              <div className="photo-frame">
                <img
                  src="/images/amrit.jpg"
                  alt="Portrait of Amrit Kang"
                  loading="lazy"
                />
                <span className="handwriting">
                  a face to put to the commits.
                </span>
              </div>
              <div className="photo-label">
                <MapPin size={14} /> BENGALURU, INDIA
              </div>
              <Bow className="about-bow" />
              <span className="photo-flower">
                <Flower color="#d5a656" />
              </span>
            </div>
            <div className="about-copy" data-reveal>
              <span className="eyebrow">FIRST, THE GIRL BEHIND IT ALL</span>
              <h2 id="about-heading">
                A curious mind.
                <br />
                <em>A soft little heart.</em>
              </h2>
              <p>
                I’m <strong>Amrit Kang</strong>, a Computer Science student at
                BITS Pilani. I like turning “what if?” into things you can
                actually use—from full-stack web apps to native iOS experiences
                and AI-powered tools.
              </p>
              <p>
                Somewhere between the code, you’ll find a community organizer, a
                former school chess player, and a girl with a very long list of
                things she wants to make.
              </p>
              <div className="profile-facts">
                <div>
                  <span>MY LITTLE ACADEMIC CHAPTER</span>
                  <strong>BITS Pilani</strong>
                  <p>B.Sc. Computer Science · 2025–2029</p>
                </div>
                <div className="cgpa">
                  <strong>
                    9.27<span>/ 10</span>
                  </strong>
                  <span>CGPA</span>
                </div>
              </div>
              <div className="skills-line">
                <span>Python</span>
                <span>React</span>
                <span>Swift</span>
                <span>Go</span>
                <span>AWS</span>
                <span>+ curiosity</span>
              </div>
              <a
                href="/Amrit-Kang-Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                The slightly more formal version <Download size={16} />
              </a>
            </div>
          </section>
          <div className="experience-note section-shell" data-reveal>
            <span className="eyebrow">A LITTLE REAL-WORLD BUILDING</span>
            <div>
              <h3>SDE & Forward Deployed Engineer Intern</h3>
              <p>Grabware</p>
            </div>
            <p>
              Hosting, deployment, and infrastructure for 15+ production
              websites, plus migrations from PHP to MERN.
            </p>
            <Code2 size={28} />
          </div>
          <div className="road-interlude">
            <span className="handwriting">there’s more to the story…</span>
            <Flower className="road-flower" color="#d9a0b0" />
            <span className="road-star">✧</span>
            <span className="road-caption">
              NO NEED TO RUSH. THE GOOD STUFF IS ON THE WAY.
            </span>
          </div>
        </div>
        <section
          className="crossroads"
          id="crossroads"
          aria-labelledby="map-heading"
        >
          <div className="section-shell">
            <div className="map-heading" data-reveal>
              <span className="eyebrow">YOU’VE ARRIVED AT THE CROSSROADS</span>
              <h2 id="map-heading">
                Where shall <em>we wander?</em>
              </h2>
              <p>
                Four little roads. Four different pieces of me.
                <br />
                Pick a place. You can always come back.
              </p>
            </div>
            <div className="world-map">
              <svg
                className="branch-roads"
                viewBox="0 0 1100 390"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M550 390V250Q550 210 400 210T125 130M550 250Q550 210 700 210T975 130M550 300Q550 210 400 135M550 300Q550 210 700 135"
                  className="map-road-border"
                />
                <path
                  d="M550 390V250Q550 210 400 210T125 130M550 250Q550 210 700 210T975 130M550 300Q550 210 400 135M550 300Q550 210 700 135"
                  className="map-road"
                />
                <path
                  d="M550 390V250Q550 210 400 210T125 130M550 250Q550 210 700 210T975 130M550 300Q550 210 400 135M550 300Q550 210 700 135"
                  className="map-road-dashes"
                />
              </svg>
              <div className="map-locations">
                {paths.map((p, i) => (
                  <button
                    className={`map-location map-location-${i} ${p.color}`}
                    key={p.id}
                    onClick={() => choosePath(p.id)}
                    aria-label={`Explore ${p.short}`}
                  >
                    <Landmark type={p.icon} />
                    <span className="location-name">
                      {p.name} <ArrowUpRight size={17} />
                    </span>
                    <span className="location-note">{p.note}</span>
                    <span className="location-number">0{i + 1}</span>
                  </button>
                ))}
              </div>
              <span className="map-you">
                <Heart size={15} fill="currentColor" /> you are here
              </span>
              <Flower className="map-flower flower-left" color="#e4b274" />
              <Flower className="map-flower flower-right" color="#b6a1bd" />
              <span className="map-compass">
                N<br />✧<br />
                <small>follow your curiosity</small>
              </span>
            </div>
          </div>
        </section>
        <section
          className={`destination destination-${current.color}`}
          ref={destination}
          tabIndex={-1}
          id="destination"
          aria-label={current.short}
        >
          <div className="section-shell">
            <div className="destination-toolbar">
              <a href="#crossroads" className="text-link">
                <ArrowLeft size={15} /> Back to the map
              </a>
              <div
                className="destination-tabs"
                role="group"
                aria-label="Choose a destination"
              >
                {paths.map((p) => (
                  <button
                    key={p.id}
                    className={active === p.id ? "active" : ""}
                    aria-pressed={active === p.id}
                    onClick={() => choosePath(p.id)}
                  >
                    {p.short}
                  </button>
                ))}
              </div>
            </div>
            <div key={active} className="destination-content">
              {active === "projects" ? (
                <Projects />
              ) : active === "events" ? (
                <Events />
              ) : active === "opensource" ? (
                <OpenSource />
              ) : (
                <LittleThings paused={paused} />
              )}
            </div>
            <div className="next-stop">
              <span className="handwriting">shall we keep wandering?</span>
              <button
                className="text-link"
                onClick={() =>
                  choosePath(
                    paths[
                      (paths.findIndex((p) => p.id === active) + 1) %
                        paths.length
                    ].id,
                  )
                }
              >
                Next little road <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
        <footer className="footer" id="contact">
          <Flower className="footer-flower" color="#a7b191" />
          <span className="eyebrow">EVERY GOOD STORY STARTS WITH A HELLO</span>
          <h2>
            Let’s make
            <br />
            <em>something lovely.</em>
          </h2>
          <p>
            A project, a collaboration, or just a little hello.
            <br />
            There’s room for you in my corner of the internet.
          </p>
          <a className="contact-button" href="mailto:amritkang2805@icloud.com">
            leave a little note <Mail size={18} />
          </a>
          <div className="social-links">
            <a href={GH} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={14} />
            </a>
            <a
              href="https://www.linkedin.com/in/amritkang28/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <ArrowUpRight size={14} />
            </a>
            <a href="/Amrit-Kang-Resume.pdf" target="_blank" rel="noreferrer">
              Résumé <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} AMRIT KANG</span>
            <span>BUILT WITH A LITTLE CODE & A LOT OF HEART ♡</span>
            <a href="#home">BACK TO THE TOP ↑</a>
          </div>
        </footer>
      </main>
      <button
        className="motion-toggle"
        onClick={() => setPaused(!paused)}
        aria-label={paused ? "Enable animations" : "Pause animations"}
        aria-pressed={paused}
      >
        {paused ? <Play size={12} /> : <Pause size={12} />}
        <span>{paused ? "motion off" : "motion on"}</span>
      </button>
    </div>
  );
}
