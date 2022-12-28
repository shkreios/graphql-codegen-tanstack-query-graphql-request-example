import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://graphqlzero.almansi.me/api",
  documents: ["src/**/*.graphql"],
  generates: {
    "./src/gql/client-types.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
    },
  },
};
export default config;
