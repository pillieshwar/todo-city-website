import { SITE } from "../site";
import { AppDemo } from "./AppDemo";
import { AppleIcon, Arrow } from "./Icons";

/** The opening: what TodoCity does in one line, and the app itself to try. */
export function AppHero() {
  return (
    <section className="try" id="top" aria-labelledby="try-title">
      <div className="try-copy">
        <h1 id="try-title">
          Less clutter. <em>More done.</em>
        </h1>
        <p className="lede">Copy any text twice, from an email, a Slack message or a web page, and an AI on your Mac writes the task and its date.</p>
        <div className="hero-ctas">
          <a className="btn btn-primary btn-lg" href={SITE.download}>
            <AppleIcon /> Download for Mac
          </a>
          <a className="btn btn-ghost btn-lg" href="#lights">
            A gamified way to manage tasks <Arrow />
          </a>
        </div>
        <p className="hero-fine">{SITE.requirements} · No account</p>
      </div>
      <AppDemo />
    </section>
  );
}
