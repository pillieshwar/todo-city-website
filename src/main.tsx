import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// The home page (with the 3D city) and the guide pages load separately, so a
// guide never downloads three.js.
const path = window.location.pathname.replace(/\/+$/, "") || "/";
const root = createRoot(document.getElementById("root")!);
if (path === "/") {
  void import("./App").then(({ App }) =>
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    ),
  );
} else {
  void import("./pages/routes").then(({ routeFor }) => {
    const r = routeFor(path);
    if (r) root.render(<StrictMode>{r.element()}</StrictMode>);
  });
}
