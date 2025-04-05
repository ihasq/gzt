import { TarWriter } from "npm:@gera2ld/tarjs";
import { walk } from "jsr:@std/fs"

const [target, outName] = Deno.args;

const writer = new TarWriter();

await Promise.all((await Array.fromAsync(walk(`./${target || ""}`, { includeDirs: false }))).map(({ path }) => new Response(new Response(Deno.readFileSync(path)).body?.pipeThrough(new CompressionStream("gzip"))).arrayBuffer().then(ab => writer.addFile(path, ab))))

Deno.writeFileSync(`${outName || "out"}.gzt`, new Uint8Array(await (await writer.write()).arrayBuffer()))