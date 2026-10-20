import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/cyrillic-400.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/cyrillic-600.css";
import App from "./App";
import "./styles.scss";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
