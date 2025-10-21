import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./api/mockServer";

createRoot(document.getElementById("root")!).render(<App />);
