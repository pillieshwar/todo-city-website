import { AppHero } from "./components/AppHero";
import { CityIntro } from "./components/CityIntro";
import { Nav } from "./components/Nav";
import { Playground } from "./components/Playground";
import { Download, Faq, Features, Footer, Privacy } from "./components/Sections";
import { Story } from "./components/Story";

export function App() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <AppHero />
        <CityIntro />
        <Story />
        <Playground />
        <Features />
        <Privacy />
        <Faq />
        <Download />
      </main>
      <Footer />
    </>
  );
}
