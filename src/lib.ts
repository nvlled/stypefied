
import 'jquery';
import * as path from "path";
import {allowStr, filterStr, SafeStr} from './safestr';

const callsite = require("callsite");
const resourcePath = "resources";
const staticPath = "static";
const resourceDir = path.join(__dirname, "..", resourcePath);
const staticDir = path.join(__dirname, "..", staticPath);
const srcDir = path.join(__dirname, "..", "src");

export const settings = {
    sitename: "Typed CRUD",

    resourcePath,
    staticPath,

    staticURL: {
        styles:  path.join("/", staticPath, "styles"),
        scripts: path.join("/", resourcePath, "scripts"),
        withScript(name: string) {
            if (path.isAbsolute(name))
                return name;
            return path.join(this.scripts, name);
        },
        withStyle(name: string)  {
            if (path.isAbsolute(name))
                return name;
            return path.join(this.styles, name);
        },
    },

    resourceURL: {
        styles:  path.join("/", resourcePath, "styles"),
        scripts: path.join("/", resourcePath, "scripts"),
        withScript(name: string) {
            if (path.isAbsolute(name))
                return name;
            return path.join(this.scripts, name);
        },
        withStyle(name: string)  {
            if (path.isAbsolute(name))
                return name;
            return path.join(this.styles, name);
        },
    },

    fs: {
        staticDir,
        resourceDir,
        stylesDir: path.join(resourceDir, "styles"),
        scriptsDir: path.join(resourceDir, "scripts"),


        withStaticDir(filename="") {
            return path.join(this.scriptsDir, filename);
        },
        withStylesDir(filename="") {
            return path.join(this.stylesDir, filename);
        },
    },
}

export const defaults = {
    DBTYPE: "sqlite",
    DBNAME: "data.db",
    DBHOST: "localhost",
    DBPORT: "3303",
    DBUSER: "root",
    DBPASS: "",
}


// removePathPrefix("/a/b/c", "/a") == "/b/c"
// removePathPrefix("/a/b/c", "/a/") == "/b/c"
// removePathPrefix("/a/b/c", "/a/b") == "/c"
// removePathPrefix("/a/b", "/a/b") == "/"
// removePathPrefix("a/b", "a/b") == "."
// removePathPrefix("/a/b", "/a/b/c") == "/a/b"
export function removePathPrefix(str: string, prefix: string) {
    let sep = path.sep;
    let prefs = prefix.split(sep);
    let strs = str.split(sep);

    if (prefs.length > strs.length)
        return str;

    let i = 0;
    while (i < prefs.length) {
        if (prefs[i] != strs[i])
            break;
        i++;
    }
    return path.join( ...strs.slice(i, strs.length));
}

// To avoid future bewilderment, I should
// probably apply renaming only on pages/
export function includePageAsset(
    filename: string,
    ext: string,
    destpath: string
): string {
    let {join, basename, dirname, format} = path;
    let scriptPath = removePathPrefix(
        dirname(filename),
        __dirname,
    );

    let base = basename(filename, ".js");
    if (base == "view" || base == "index") {
        base = basename(dirname(filename));
        scriptPath = dirname(scriptPath);
    } else if (scriptPath == "views") {
        scriptPath = "client";
    }

    let src = format({
        dir: join(destpath, scriptPath),
        name: base,
        ext,
    });
    return src;
}

export function includePageScript(level=1): string {
    let moduleName = callsite()[level].getFileName();
    return includePageAsset(moduleName, ".js", settings.resourceURL.scripts);
}

export function includePageStyle(level=1): string {
    let moduleName = callsite()[level].getFileName();
    return includePageAsset(moduleName, ".css", settings.resourceURL.styles);
}

export interface Layout {
    notices: SafeStr[],
    errors:  SafeStr[],
    styles:  string[],
    scripts:  string[],
    title:   string,
    body:    string,
    aside:   string,

   render(): string,
}

console.log("settings:", settings);
