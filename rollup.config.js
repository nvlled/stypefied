
import resolve from 'rollup-plugin-node-resolve';
import * as path from "path";
import fg from "fast-glob";
import {removePathPrefix, settings} from "./es-src/lib";

let srcDir = path.join(__dirname, "es-src");
let destDir = path.join(__dirname, settings.resourcePath, "scripts");

function findClientScripts() {
    console.log("searching for scripts in " + srcDir);
    return fg.sync([
        path.join(srcDir, "client", "**", "*.js"),
        path.join(srcDir, "**", "client.js"),
        path.join(srcDir, "**", "*.client.js"),
    ]);
}

let plugins = [ resolve() ];

let destFilenames = {};
let config = findClientScripts().map(function(fullpath) {
    let {basename, dirname, join} = path;
    let filename = basename(fullpath);

    let scriptPath = removePathPrefix(
        dirname(fullpath),
        join(__dirname, "es-src")
    );
    if (filename == "client.js") {
        scriptPath = dirname(scriptPath);
        filename = basename(dirname(fullpath)) + ".js";
    }

    if (destFilenames[filename]) {
        console.warn(filename + " will be overwritten");
    }
    destFilenames[filename] = true;

    return {
        input: fullpath,
        output: {
            name: path.join(scriptPath, filename),
            file: path.join(destDir, scriptPath, filename),
            format: 'iife',
        },
        plugins,
    }
});
console.log("bundle names: " + Object.keys(destFilenames));
console.log("config: ", config);

export default config;
