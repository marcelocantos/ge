import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { writeFileSync } from "fs";

const buildId = Date.now().toString(36);

export default defineConfig({
  plugins: [
    react(),
    {
      name: "build-id",
      writeBundle(options) {
        const dir = options.dir || "dist";
        writeFileSync(dir + "/.build-id", buildId + "\n");
      },
    },
  ],
  define: {
    __GE_BUILD_ID__: JSON.stringify(buildId),
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:42069",
        changeOrigin: true,
      },
      "/ws": {
        target: "ws://localhost:42069",
        ws: true,
      },
    },
  },
});
