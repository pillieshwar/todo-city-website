import { Hero } from "./components/Hero";
import { Nav } from "./components/Nav";
import { Playground } from "./components/Playground";
import { Download, Features, Footer, Privacy } from "./components/Sections";
import { Story } from "./components/Story";

export function App() {
  return (
    <>
      <a className="skip" href="#story">
        Skip to the story
      </a>
      <Nav />
      <main>
        <Hero />
        <Story />
        <Playground />
        <Features />
        <Privacy />
        <Download />
      </main>
      <Footer />
    </>
  );
}
