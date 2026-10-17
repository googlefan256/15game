import { App } from "./app";
import "./index.css";

import { hydrate, prerender as ssr } from "preact-iso";

if (typeof window !== "undefined") {
    hydrate(<App />, document.getElementById("root")!);
}

export async function prerender() {
    return await ssr(<App />);
}
