import { createRoot } from "react-dom/client";

import OptionsApp from "../presentation/OptionsApp";

const app = document.getElementById("app");
const root = createRoot(app);
root.render(<OptionsApp />);
