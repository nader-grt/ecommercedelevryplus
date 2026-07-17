import fs from "fs";
import yaml from "js-yaml";

export async function loadRoutes(app:any) {

  // read yml file
  const fileContents = fs.readFileSync("./routes.yml", "utf8");

  // convert yaml -> object
  const data :any = yaml.load(fileContents);

  // loop routes
  for (const route of data?.routes) {

    // dynamic import
    const module = await import(route.file);

    // router export
    const router = module.default;

    // app.use(...)
    app[route.method](route.path, router);

    console.log(`Loaded: ${route.file}`);
  }
}