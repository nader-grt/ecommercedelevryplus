import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { corsOptions } from "./corsConfig/corsConfig.js";
import { folderPath } from "./filesystem/fileHandle.js";

const app = express();


// =========================
// MIDDLEWARE
// =========================

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


// =========================
// STATIC FILES
// =========================

app.use("/images", express.static(folderPath));


// =========================
// __dirname FIX (ESM)
// =========================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// =========================
// READ & PARSE YAML
// =========================

const yamlFile = fs.readFileSync(
  path.join(__dirname, "routes.yml"),
  "utf8"
);

const config :any = yaml.load(yamlFile);

if (!config?.modules || !Array.isArray(config.modules)) {
  throw new Error("Invalid routes.yml: modules array missing");
}


// =========================
// AUTO LOAD ROUTES
// =========================

console.log("CONFIG LOADED:", config);

for (const module of config.modules) {
  try {
    // validate structure
    if (!module.file || !module.path) {
      console.warn("Skipping invalid module:", module);
      continue;
    }

    // resolve absolute path
    const modulePath = path.resolve(__dirname, module.file);

    // dynamic import
    const routeModule = await import(modulePath);

    if (!routeModule.default) {
      console.warn(`No default export in ${module.file}`);
      continue;
    }

    // register route
    app.use(module.path, routeModule.default);

    console.log(`Loaded: ${module.path} -> ${module.file}`);

  } catch (err) {
    console.error(`Failed loading route: ${module.file}`, err);
  }
}


// =========================
// EXPORT APP
// =========================

export default app;