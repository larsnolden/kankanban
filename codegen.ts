import { CodegenConfig } from "@graphql-codegen/cli";
import * as dotenv from "dotenv";

// Because this is ran without next.js we cannot rely on next reading the .env file and making it accesible
dotenv.config();

console.log(process.env.NEXT_PUBLIC_GRAPHQL_URI);
const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_GRAPHQL_URI,
  // this assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "./src/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
