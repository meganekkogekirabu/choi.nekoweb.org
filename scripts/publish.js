import AdmZip from "adm-zip";
import NekowebAPI from "@indiefellas/nekoweb-api";
import path from "node:path";
import process from "node:process";
import fs from "node:fs";
import { execSync } from "node:child_process";

execSync("pnpm run build", {
  stdio: "inherit",
});

const __dirname = import.meta.dirname;
const dist = path.join(__dirname, "..", "dist");
const dist_zip = path.join(__dirname, "..", "dist.zip");

const zip = new AdmZip();

zip.addLocalFolder(dist, "choi.nekoweb.org");
zip.writeZip(dist_zip);

process.loadEnvFile();

const api_key = process.env.API_KEY;
if (!api_key) throw new Error("missing API key for nekoweb");

let nekoweb = new NekowebAPI({
  apiKey: api_key,
  logging: (type, message) => {
    console.log(type, message);
  },
});

let archive = fs.readFileSync(dist_zip);
let bigfile = await nekoweb.createBigFile();
await bigfile.append(archive);
await bigfile.import();

fs.unlink(dist_zip, (err) => {
  if (err) throw err;
  console.log("deleted dist.zip");
});

fs.rmdir(dist, (err) => {
  if (err) throw err;
  console.log("deleted dist/");
});
