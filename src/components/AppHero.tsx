import { SITE } from "../site";
import { AppDemo } from "./AppDemo";
import { AppleIcon, Arrow } from "./Icons";

/** The opening: what TodoCity does in one line, and the app itself to try. */
export function AppHero() {
  return (
    <section className="try" id="top" aria-labelledby="try-title">
      <div className="try-copy">
        <h1 id="try-title">
          Press ⌘C twice. <em>It's a task.</em>
        </h1>
        <p className="lede">From any email, Slack message or web page. An AI on your Mac writes it, with its date.</p>
        <div className="hero-ctas">
          <a className="btn btn-primary btn-lg" href={SITE.download}>
            <AppleIcon /> Download for Mac
          </a>
          <a className="btn btn-ghost btn-lg" href="#lights">
            See your city light up <Arrow />
          </a>
        </div>
        <p className="hero-fine">{SITE.requirements} · No account</p>
      </div>
      <AppDemo />
    </section>
  );
}
