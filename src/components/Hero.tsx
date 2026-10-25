import { useEffect, useMemo, useRef, useState } from "react";
import { bigCity } from "../city/layout";
import { SITE } from "../site";
import { CityCanvas } from "./CityCanvas";
import { AppleIcon, Arrow } from "./Icons";

/**
 * The opening: a whole city at night you can turn and zoom, where people keep
 * moving in — each one a task someone finished.
 */
export function Hero() {
  const layout = useMemo(() => bigCity(7), []);
  const start = useMemo(
    () =>
      layout.lots.reduce(
        (n, l) => n + (l.kind === "tower" ? l.floors.reduce((m, f) => m + f.homes.filter((h) => h.lit).length, 0) : l.kind === "houses" ? l.homes.filter((h) => h.lit).length : 0),
        0,
      ),
    [layout],
  );
  const [population, setPopulation] = useState(start);
  const [blip, setBlip] = useState(0);
  const copy = useRef<HTMLDivElement>(null);

  // The words drift up and fade as you scroll into the story.
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight);
        const el = copy.current;
        if (el) {
          el.style.transform = `translate3d(0, ${y * -0.18}px, 0)`;
          el.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.75)));
        }
      });
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <section className="hero" id="top" aria-label="Todo City">
      <CityCanvas
        layout={layout}
        className="hero-city"
        options={{
          interactive: true,
          autoRotate: true,
          alive: true,
          zoom: 0.78,
          onMoveIn: (n) => {
            setPopulation(n);
            setBlip((b) => b + 1);
          },
        }}
      />
      <div className="hero-shade" aria-hidden />
      <div className="hero-copy" ref={copy}>
        <p className="eyebrow">
          <span className="eyebrow-dot" /> A private to-do app for Mac
        </p>
        <h1>
          Every task is a home.
          <br />
          <em>Finish it,</em> and the lights come on.
        </h1>
        <p className="lede">
          Todo City turns any text into a dated task — an email, a message, a web page — with an AI that runs entirely on your Mac. Then every task
          becomes a home in your own city, and every one you finish switches on a light.
        </p>
        <div className="hero-ctas">
          <a className="btn btn-primary btn-lg" href={SITE.download}>
            <AppleIcon /> Download for Mac
          </a>
          <a className="btn btn-ghost btn-lg" href="#story">
            Hear the story <Arrow />
          </a>
        </div>
        <p className="hero-fine">Free and open source · {SITE.requirements}</p>
      </div>
      <div className="hero-pop">
        <span key={blip} className="pop-light" aria-hidden />
        <span className="pop-num">{population.toLocaleString()}</span>
        <span className="pop-text">
          residents · <span className="pop-new">someone just moved in</span>
        </span>
      </div>
      <p className="hero-hint" aria-hidden>
        Drag to turn the city · hover a window to see its task
      </p>
      <a className="hero-scroll" href="#story" aria-label="Scroll to the story">
        <span />
      </a>
    </section>
  );
}
