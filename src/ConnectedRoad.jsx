import { useEffect, useState } from "react";

// Measure the actual signposts and destination so the road stays attached
// when text wraps, fonts load, or the viewport changes.
export default function ConnectedRoad({ root, destination }) {
  const [geometry, setGeometry] = useState(null);
  useEffect(() => {
    const container = root.current;
    if (!container) return;
    let frame;
    const measure = () => {
      frame = null;
      const bounds = container.getBoundingClientRect();
      const heading = container
        .querySelector(".crossroads-heading")
        .getBoundingClientRect();
      const signs = [...container.querySelectorAll(".chapter-choice")].map(
        (sign) => {
          const box = sign.getBoundingClientRect();
          return {
            x: box.left + box.width / 2 - bounds.left,
            top: box.top - bounds.top,
            bottom: box.bottom - bounds.top,
          };
        },
      );
      const marker = container
        .querySelector(".road-arrival i")
        ?.getBoundingClientRect();
      const start = {
        x: bounds.width / 2,
        y: heading.bottom - bounds.top + 22,
      };
      const forks = signs.map(
        (sign) =>
          `M${start.x} ${start.y} V${start.y + 18} C${start.x} ${sign.top - 45} ${sign.x} ${sign.top - 90} ${sign.x} ${sign.top}`,
      );
      const chosen =
        destination === "projects"
          ? 0
          : destination === "hosted-events"
            ? 1
            : -1;
      let continuation = null;
      let arrival = null;
      if (marker && chosen !== -1) {
        const from = signs[chosen];
        const end = {
          x: marker.left + marker.width / 2 - bounds.left,
          y: marker.top + marker.height / 2 - bounds.top,
        };
        arrival = end;
        continuation = `M${from.x} ${from.bottom} C${from.x} ${from.bottom + 75} ${end.x} ${end.y - 75} ${end.x} ${end.y}`;
      }
      setGeometry({
        width: bounds.width,
        height: marker
          ? marker.bottom - bounds.top + 4
          : Math.max(...signs.map((sign) => sign.top)) + 10,
        forks,
        signs,
        continuation,
        arrival,
        chosen,
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(container);
    observer.observe(container.querySelector(".chapter-crossroads"));
    container
      .querySelectorAll(".chapter-choice, .road-arrival")
      .forEach((el) => observer.observe(el));
    window.addEventListener("resize", schedule);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [root, destination]);
  if (!geometry) return null;
  return (
    <svg
      className="connected-road"
      width={geometry.width}
      height={geometry.height}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      fill="none"
      aria-hidden="true"
    >
      {geometry.forks.map((path, index) => (
        <g
          key={index}
          className={`connected-branch branch-${index}${geometry.chosen === index ? " is-selected" : ""}`}
        >
          <path className="connection-base" d={path} />
          <path className="connection-highlight" d={path} />
          <path className="connection-center" d={path} />
          <circle
            cx={geometry.signs[index].x}
            cy={geometry.signs[index].top}
            r="6"
          />
        </g>
      ))}
      {geometry.continuation && (
        <g key={destination} className="journey-continuation">
          <path className="connection-base" d={geometry.continuation} />
          <path
            className="connection-selected"
            d={geometry.continuation}
            pathLength="1"
          />
          <path className="connection-center" d={geometry.continuation} />
          <circle cx={geometry.arrival.x} cy={geometry.arrival.y} r="6" />
          <g className="road-traveler">
            <animateMotion
              path={geometry.continuation}
              dur="1.4s"
              fill="freeze"
              calcMode="spline"
              keyTimes="0;1"
              keySplines=".25 .1 .25 1"
            />
            <g
              transform="scale(.65)"
              fill="#fbeaf0"
              stroke="#8e2b51"
              strokeWidth="2.5"
              strokeLinejoin="round"
            >
              <path d="M-3 0C-25-23-31-12-23 1C-18 9-9 7-3 0ZM3 0C25-23 31-12 23 1C18 9 9 7 3 0Z" />
              <path d="M-4 2L-13 19L-4 15L0 5L4 15L13 19L4 2Z" />
              <ellipse rx="5" ry="6" />
            </g>
          </g>
          <circle
            cx={geometry.signs[geometry.chosen].x}
            cy={geometry.signs[geometry.chosen].bottom}
            r="6"
          />
        </g>
      )}
    </svg>
  );
}
