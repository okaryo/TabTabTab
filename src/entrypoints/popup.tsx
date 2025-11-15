import { createRoot } from "react-dom/client";
import PopupApp from "../presentation/PopupApp";

const app = document.getElementById("app");
const root = createRoot(app);
root.render(<PopupApp />);
