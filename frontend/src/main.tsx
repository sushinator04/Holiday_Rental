import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";
import { StrictMode } from "react";

import "./styles/index.css";
import { BrowserRouter as Router } from "react-router-dom";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}
ReactDOM.createRoot(root).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
