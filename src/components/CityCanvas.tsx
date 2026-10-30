import { useEffect, useRef, useState } from "react";
import type { Layout } from "../city/layout";
import type { CityEngine, EngineOptions, Picked } from "../city/engine";

/**
 * A 3D city on the page. three.js loads on its own (after the text), and the
 * engine only draws while the city is on screen.
 */
export function CityCanvas({
  layout,
  options,
  onEngine,
  className,
  label,
  tooltip = true,
}: {
  layout: Layout;
  options?: Omit<EngineOptions, "onHover" | "onReady">;
  onEngine?: (e: CityEngine | null) => void;
  className?: string;
  /** What the city shows, for screen readers. */
  label: string;
  tooltip?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<CityEngine | null>(null);
  const [ready, setReady] = useState(false);
  const [noGL, setNoGL] = useState(false);
  const [hover, setHover] = useState<Picked | null>(null);
  const first = useRef({ layout, options, onEngine });
  first.current.onEngine = onEngine;

  useEffect(() => {
    let alive = true;
    void import("../city/engine").then(({ CityEngine, webglAvailable }) => {
      if (!alive || !host.current) return;
      if (!webglAvailable()) {
        setNoGL(true);
        return;
      }
      const e = new CityEngine(host.current, first.current.layout, {
        ...first.current.options,
        onHover: tooltip ? setHover : undefined,
        onReady: () => setReady(true),
      });
      engine.current = e;
      first.current.onEngine?.(e);
    });
    return () => {
      alive = false;
      engine.current?.dispose();
      engine.current = null;
      first.current.onEngine?.(null);
    };
  }, [tooltip]);

  // New layouts swap in without rebuilding the renderer.
  useEffect(() => {
    if (engine.current && layout !== first.current.layout) engine.current.update(layout);
    first.current.layout = layout;
  }, [layout]);

  return (
    <div ref={host} role="img" aria-label={label} className={["city-host", ready ? "ready" : "", className ?? ""].filter(Boolean).join(" ")}>
      {noGL && <p className="city-nogl">Your browser can't show 3D right now, but the city is still there in the app.</p>}
      {hover && (hover.home || hover.name) && (
        <div className="city-tip" aria-hidden style={{ left: hover.x + 14, top: hover.y + 14 }}>
          {hover.home ? (
            <>
              <strong>{hover.home.title ?? "A home"}</strong>
              <span className={hover.home.lit ? "lit" : hover.home.late ? "late" : ""}>
                {hover.home.lit
                  ? "Lights on · someone moved in"
                  : hover.home.late
                    ? "Overdue · someone's waiting at the door"
                    : hover.home.readying
                      ? "Being readied · sub-tasks under way"
                      : "Empty home · still to do"}
              </span>
              <span>{hover.name && hover.name !== "Houses" ? `${hover.name}${hover.floor ? ` · ${hover.floor}` : ""}` : "A house · no project"}</span>
            </>
          ) : (
            <>
              <strong>{hover.name}</strong>
              {hover.floor && <span>{hover.floor}</span>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
