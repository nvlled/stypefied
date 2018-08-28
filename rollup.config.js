
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import globals from 'rollup-plugin-node-globals';
import * as path from "path";
import fg from "fast-glob";
const settings = require("./dist/lib/settings").default;
const util = require("./dist/lib/util");

let srcDir = path.join(__dirname, "dist");
let destDir = path.join(__dirname, settings.resourcePath, "scripts");
let {removePathPrefix} = util;

function findClientScripts() {
    console.log("searching for scripts in " + srcDir);
    return fg.sync([
        path.join(srcDir, "client", "**", "*.js"),
        path.join(srcDir, "**", "client.js"),
        path.join(srcDir, "**", "*.client.js"),
    ]);
}

let plugins = [
    resolve({ jsnext: true, preferBuiltins: true, browser: true }),
    json(),
    commonjs({}),
    globals(),
];

let destFilenames = {};
let config = findClientScripts().map(function(fullpath) {
    let {basename, dirname, join} = path;
    let filename = basename(fullpath);

    let scriptPath = removePathPrefix(
        dirname(fullpath),
        join(__dirname, "dist")
    );
    if (filename == "client.js") {
        scriptPath = dirname(scriptPath);
        filename = basename(dirname(fullpath)) + ".js";
    }
    filename = filename.replace(/\.client\.js$/, ".js");

    if (destFilenames[filename]) {
        console.warn(filename + " will be overwritten");
    }
    destFilenames[filename] = true;

    return {
        input: fullpath,
        output: {
            exports: "named",
            name: path.join(scriptPath, filename),
            file: path.join(destDir, scriptPath, filename),
            format: 'iife',
        },
        plugins,
    }
});
console.log("bundle names: " + Object.keys(destFilenames));

export default config;
