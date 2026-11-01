import { CityIntro } from "./components/CityIntro";
import { Arrow } from "./components/Icons";
import { Nav } from "./components/Nav";
import { Playground } from "./components/Playground";
import { Reveal } from "./components/Reveal";
import { Download, Footer } from "./components/Sections";

/** What each part of your list becomes in the city. */
const MAP: [string, string, string][] = [
  ["A project", "building", "It goes up when you start the project."],
  ["A section", "floor", "# Rollout and # Press are floors of Launch."],
  ["A task", "home", "Finish it and its window stays lit for good."],
];

/** What the city gains as its population (every task you've finished) grows. */
const MILESTONES: [number, string][] = [
  [10, "Street lamps"],
  [25, "A park"],
  [50, "A fountain"],
  [100, "A train line"],
  [250, "A harbour"],
  [500, "A stadium"],
  [1000, "A bridge to a second island"],
];

/** /city: the city in TodoCity, on its own page so the home page can stay about the app. */
export function CityPage() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav home={false} page="city" />
      <main id="main" tabIndex={-1}>
        <CityIntro />

        <section className="city-how" id="how" aria-labelledby="how-title">
          <h2 id="how-title">Your list, as a city.</h2>
          <Reveal className="city-map">
            {MAP.map(([k, v, d]) => (
              <div key={v} className="city-map-item">
                <span>{k}</span>
                <b>
                  is a <em>{v}</em>
                </b>
                <p>{d}</p>
              </div>
            ))}
          </Reveal>
          <ul className="city-legend">
            <li>
              <i className="glow" aria-hidden /> Sub-tasks under way
            </li>
            <li>
              <i className="late" aria-hidden /> Past its date
            </li>
            <li>
              <i className="house" aria-hidden /> Tasks in no project: little houses
            </li>
          </ul>
        </section>

        <section className="city-how" id="milestones" aria-labelledby="miles-title">
          <h2 id="miles-title">The city grows with you.</h2>
          <p className="city-sub">What's built stays built. No streaks or points, and every feature of the app is yours from day one.</p>
          <Reveal as="ol" className="city-miles">
            {MILESTONES.map(([n, t]) => (
              <li key={n}>
                <b>{n.toLocaleString("en-US")}</b>
                <span>{t}</span>
              </li>
            ))}
          </Reveal>
          <p className="city-sub small">Prefer a clean screen? Hide the city any time in Settings → Your city.</p>
        </section>

        <Playground />
        <Download title="Turn on the lights.">
          <a className="btn btn-ghost btn-lg" href="/">
            See all features <Arrow />
          </a>
        </Download>
      </main>
      <Footer home={false} />
    </>
  );
}
