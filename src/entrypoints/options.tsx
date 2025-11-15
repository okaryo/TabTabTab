import { createRoot } from "react-dom/client";

import OptionsApp from "../ui/OptionsApp";

const app = document.getElementById("app");
const root = createRoot(app);
root.render(<OptionsApp />);
