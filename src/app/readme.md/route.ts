import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Serves the repository README as plain Markdown at /readme.md so the
 * "Ask AI" links can point ChatGPT, Claude and others at the full context.
 * No request data is read, so this is prerendered at build time.
 */
export async function GET() {
  const body = await readFile(path.join(process.cwd(), "README.md"), "utf8");
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
