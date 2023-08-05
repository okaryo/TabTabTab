import { createRoot } from "react-dom/client";

import App from "./pages/App";

const app = document.getElementById("app");
const root = createRoot(app);
root.render(<App />);
