import { useMemo, useState } from "react";
import { bigCity } from "../city/layout";
import { SITE } from "../site";
import { CityCanvas } from "./CityCanvas";
import { AppleIcon, Arrow } from "./Icons";

/**
 * After the app: a whole city at night you can turn and zoom, where people
 * keep moving in — each one a task someone finished.
 */
export function CityIntro() {
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

  return (
    <section className="hero" id="lights" aria-labelledby="lights-title">
      <CityCanvas
        layout={layout}
        className="hero-city"
        label="A 3D city at night. Each building is a project and each lit window a finished task; new residents keep moving in."
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
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="eyebrow-dot" /> Your city
        </p>
        <h2 id="lights-title">
          Every task is a home.
          <br />
          <em>Finish it,</em> and the lights come on.
        </h2>
        <p className="lede">
          In TodoCity, each project is a building and each of its sections a floor. Every task you finish moves someone in and switches on a light.
          This is a city after a few months of getting things done. Drag it, and hover a window to see its task.
        </p>
        <div className="hero-ctas">
          <a className="btn btn-primary btn-lg" href={SITE.download}>
            <AppleIcon /> Download for Mac
          </a>
          <a className="btn btn-ghost btn-lg" href="#story">
            Hear the story <Arrow />
          </a>
        </div>
        <p className="hero-fine">{SITE.requirements}</p>
      </div>
      <div className="hero-pop" aria-hidden>
        <span key={blip} className="pop-light" aria-hidden />
        <span className="pop-num">{population.toLocaleString()}</span>
        <span className="pop-text">
          residents · <span className="pop-new">someone just moved in</span>
        </span>
      </div>
      <p className="hero-hint" aria-hidden>
        Drag to turn the city · hover a window to see its task
      </p>
    </section>
  );
}
