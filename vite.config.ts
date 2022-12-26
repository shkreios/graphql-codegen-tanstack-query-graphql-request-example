import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { babelOptimizerPlugin } from "@graphql-codegen/client-preset";

export default defineConfig({
  build: {
    outDir: "build",
  },
  server: {
    port: 3000,
  },
  plugins: [
    react({
      babel: {
        plugins: [
          [
            babelOptimizerPlugin,
            { gqlTagName: "graphql", artifactDirectory: "./src/gql" },
          ],
        ],
      },
    }),
  ],
});
