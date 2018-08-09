
import * as path from "path";
import {settings} from "./lib/settings";
import * as util from "./lib/util";
import express from "express";
import bodyParser from "body-parser";
import {escape, allowStr, filterStr, SafeStr} from './lib/safestr';
import * as layouts from "./views/layout";
import * as elements from 'typed-html';

export * from "./lib/types";
export * from "./lib/settings";
export * from './lib/safestr';
export {util};
export {layouts};
export {elements};
export {createTypeStyle} from "typestyle";

export const createRouter = () => express.Router();
export const createBodyParser = () => bodyParser.urlencoded({ extended: false });

export const context = {
    currentUsername() {
        let local = require("request-local").data;
        return local.request.session.username;
    },
}

export const defaults = {
    DB_TYPE: "sqlite",
    DB_NAME: "data.db",
    DB_HOST: "localhost",
    DB_PORT: "3303",
    DB_USER: "root",
    DB_PASS: "",

    SESSION_NAME: "stypefied",
    SESSION_KEY: "yourkeyhere",
}

// To avoid future bewilderment, I should
// probably apply renaming only on pages/
export function includePageAsset(
    filename: string,
    ext: string,
    destpath: string
): string {
    let {join, basename, dirname, format} = path;
    let scriptPath = util.removePathPrefix(
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

const callsite = require("callsite");
export function includePageScript(level=1): string {
    let moduleName = callsite()[level].getFileName();
    return includePageAsset(moduleName, ".js", settings.resourceURL.scripts);
}

export function includePageStyle(level=1): string {
    let moduleName = callsite()[level].getFileName();
    return includePageAsset(moduleName, ".css", settings.resourceURL.styles);
}

console.log("settings:", settings);
