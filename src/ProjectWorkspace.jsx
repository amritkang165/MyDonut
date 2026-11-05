import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowLeft, ArrowRight, X, Expand } from "lucide-react";
import "./worlds.css";

export default function ProjectWorkspace({ projects }) {
  const [active, setActive] = useState(0);
  const [inspecting, setInspecting] = useState(false);
  const tabs = useRef([]);
  const dialog = useRef(null);
  const opener = useRef(null);
  const project = projects[active];
  const imageSource = "/images/projects/" + project.image;
  const isPhone = project.id === "Pocki";
  useEffect(() => {
    if (!inspecting) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current.showModal();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [inspecting]);
  const closePreview = () => {
    dialog.current.close();
    setInspecting(false);
    opener.current?.focus({ preventScroll: true });
  };
  const selectWithKeys = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % projects.length;
    if (event.key === "ArrowLeft")
      next = (index + projects.length - 1) % projects.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = projects.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };
  const tiltPreview = (event) => {
    if (
      event.pointerType !== "mouse" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const frame = event.currentTarget;
    const box = frame.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    frame.style.setProperty("--tilt-x", `${(0.5 - y) * 3}deg`);
    frame.style.setProperty("--tilt-y", `${(x - 0.5) * 4}deg`);
    frame.style.setProperty("--light-x", `${x * 100}%`);
    frame.style.setProperty("--light-y", `${y * 100}%`);
  };
  const resetTilt = (event) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };
  return (
    <div
      className="project-workspace"
      style={{ "--project-count": projects.length }}
    >
      <div className="workspace-topline">
        <span>
          SELECTED BUILDS / 01—{String(projects.length).padStart(2, "0")}
        </span>
        <span>Pick a project. Take a closer look.</span>
      </div>
      <div
        className="workspace-tabs project-fan"
        role="tablist"
        aria-label="Choose a project"
      >
        {projects.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            id={`project-tab-${index}`}
            role="tab"
            type="button"
            aria-label={item.name}
            aria-selected={active === index}
            aria-controls="project-workspace-panel"
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => selectWithKeys(event, index)}
            style={{
              "--card-angle": `${(index - (projects.length - 1) / 2) * 3.5}deg`,
              "--card-drop": `${Math.abs(index - (projects.length - 1) / 2) * 9}px`,
            }}
          >
            <span className="project-card-index">
              0{index + 1}
              <span aria-hidden="true">↗</span>
            </span>
            <span
              className={`project-thumbnail${item.id === "Pocki" ? " thumbnail-phone" : ""}`}
            >
              <img
                src={"/images/projects/" + item.image}
                alt=""
                width={item.imageWidth ?? (item.id === "Pocki" ? 1206 : 1440)}
                height={item.imageHeight ?? (item.id === "Pocki" ? 2622 : 1000)}
                loading="lazy"
              />
            </span>
            <span className="project-card-title">{item.name}</span>
          </button>
        ))}
      </div>
      <article
        className="workspace-panel project-entry"
        role="tabpanel"
        id="project-workspace-panel"
        aria-labelledby={`project-tab-${active}`}
        tabIndex={0}
      >
        <div
          className={`workspace-monitor monitor-${project.id}`}
          onPointerMove={tiltPreview}
          onPointerLeave={resetTilt}
        >
          <div className="monitor-bar" aria-hidden="true">
            <span>
              0{active + 1} / {project.name}
            </span>
            <span>OPEN THE SCREEN ↗</span>
          </div>
          <div className="monitor-screen" key={project.id}>
            <figure className="workspace-screenshot">
              <button
                ref={opener}
                className="project-screen-open"
                aria-label={`Enlarge ${project.name} screenshot`}
                onClick={() => setInspecting(true)}
              >
                <img
                  src={imageSource}
                  width={project.imageWidth ?? (isPhone ? 1206 : 1440)}
                  height={project.imageHeight ?? (isPhone ? 2622 : 1000)}
                  alt={project.imageAlt}
                />
                <span className="screen-inspect" aria-hidden="true">
                  <Expand size={15} /> closer look
                </span>
              </button>
              <figcaption>
                {project.previewLabel} /{" "}
                {project.previewType ?? "ACTUAL SCREENSHOT"}
              </figcaption>
            </figure>
          </div>
        </div>
        <div className="workspace-project-copy" key={`copy-${project.id}`}>
          <span className="editorial-label">
            0{active + 1} / {project.kind}
          </span>
          <h3>{project.name}</h3>
          <p className="workspace-description">{project.description}</p>
          <p className="workspace-role">{project.role}</p>
          <p className="workspace-stack">{project.stack.join(" / ")}</p>
          <details className="project-story">
            <summary>
              About the project <span aria-hidden="true">+</span>
            </summary>
            <h4>My part</h4>
            <p>{project.contribution}</p>
            <p>{project.detail}</p>
          </details>
          <a
            className="editorial-link workspace-repository"
            href={`https://github.com/amritkang165/${project.id}`}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.name} on GitHub (${project.repositoryPrivate ? "private repository; " : ""}opens in a new tab)`}
          >
            {project.repositoryPrivate
              ? "Private repository"
              : "View repository"}{" "}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </article>
      <div className="workspace-desk" aria-hidden="true">
        <span>from an idea to a working thing.</span>
        <span>
          0{active + 1} / {String(projects.length).padStart(2, "0")}
        </span>
      </div>
      <dialog
        ref={dialog}
        className="project-image-dialog"
        aria-label="Project screenshot gallery"
        onCancel={(event) => {
          event.preventDefault();
          closePreview();
        }}
        onClick={(event) => {
          if (event.target === dialog.current) closePreview();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            setActive(
              (index) =>
                (index +
                  (event.key === "ArrowRight" ? 1 : -1) +
                  projects.length) %
                projects.length,
            );
          }
        }}
      >
        {inspecting && (
          <div className="project-image-content">
            <button
              className="project-image-close"
              onClick={closePreview}
              aria-label="Close project screenshot"
              autoFocus
            >
              <X size={22} />
            </button>
            <img
              className="project-full-image"
              src={imageSource}
              alt={project.imageAlt}
            />
            <div className="project-image-controls">
              <button
                onClick={() =>
                  setActive(
                    (index) => (index + projects.length - 1) % projects.length,
                  )
                }
                aria-label="Previous project screenshot"
              >
                <ArrowLeft size={20} />
              </button>
              <p aria-live="polite">
                {project.name}
                <small>
                  {project.previewLabel} · {active + 1} / {projects.length}
                </small>
              </p>
              <button
                onClick={() =>
                  setActive((index) => (index + 1) % projects.length)
                }
                aria-label="Next project screenshot"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
