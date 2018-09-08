
import * as path from "path";
import * as util from "./lib/util";
import express from "express";
import bodyParser from "body-parser";
import * as elements from 'typed-html';
import fg from "fast-glob";
import * as layouts from "./views/layouts";
import * as db from "./db";
import * as models from "./models";
import * as urlfor from "./lib/urlfor";
import settings from "./lib/settings";
import defaults from "./lib/defaults";
import * as middlewares from "./middlewares";
import {RouteInfo} from "./sitemap";


export * from "./lib/types";
export * from './lib/safestr';
export {createTypeStyle} from "typestyle";
export {
    db,
    util,
    urlfor,
    models,
    layouts,
    elements,
    settings,
    defaults,
    middlewares,
};

export const createRouter = () => express.Router();
export const createBodyParser = () => bodyParser.urlencoded({ extended: false });

export const context = {
    require() {
        try {
            return require("request-local").data;
        } catch (e) {
            console.warn("unable to load request-local");
            return null;
        }
    },
    currentUsername() {
        let local = this.require();
        if (!local)
            return "";
        let {session} = local.request;
        if (session)
            return session.username;
        return "";
    },
    flashMessages(name: string = "info"): string[] {
        let local = this.require();
        if (local && local.request) {
            return local.request.flash(name);
        }
        return [];
    },
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
    return includePageAsset(moduleName, ".css", settings.staticURL.styles);
}

export function importRoutes(dir: string, subpath=dir): [express.Router, RouteInfo][] {
    let files = fg.sync([
        path.join(__dirname, dir, "**", "*.js"),
    ]);
    let result: [express.Router, RouteInfo][] = [];
    for (let file of files) {
        let name = path.basename(file.toString(), ".js");
        let dirname = path.resolve(path.dirname(file.toString()));
        dirname = util.removePathPrefix(dirname, path.join(__dirname, dir));

        // *.client.js and client.js will be ignored
        if (path.extname(name) == ".client" || name == "client") {
            continue;
        }

        if (name == "index") {
            name = "."; // dirname will be used as the name instead
        }

        let mountpath = path.join("/", subpath, dirname, name);
        let mod = null;

        try {
            mod = require(file.toString());
        } catch (e) {
            console.warn(`unable to mount ${name}: ${e.message}`);
            continue;
        }

        let {
            routeInfo={},
            router,
            handler,
        } = mod;

        if (!router) {
            router = handler;
        }
        if (router) {
            result.push([
                router,
                {
                    ...routeInfo,
                    filename: file,
                    url: mountpath,
                }
            ]);
        }
    }
    return result;
}

