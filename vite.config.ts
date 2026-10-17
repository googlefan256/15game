import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

import preact from "@preact/preset-vite";

export default defineConfig({
    plugins: [
        tailwindcss(),
        preact({
            prerender: { enabled: true },
        }),
    ],
    esbuild: { legalComments: "none" },
});
