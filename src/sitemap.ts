
import * as path from "path";

type UrlFn = (args?: {[key: string] : string}) => string

export interface RouteInfo {
    id:        string,
    parentId?: string,
    nextId?:   string,
    prevId?:   string,
    url:       string,
    urlfn?:    UrlFn,
    title?:    string,
    imageUrl?: string,
    synopsis?: string,
    filename?: string,
    tags?:     string[],
    date?:     Date,
}

export function getParentId(page: RouteInfo) {
    if (!!page.parentId)
        return page.parentId;
    let dirname = path.dirname(page.url);
    if (dirname != "") {
        return siteMap.idfor(dirname);
    }
    return "";
}

export class SiteMap {
    rootId: string = "home";
    routes:    { [id: string]: RouteInfo   } = {};
    subRoutes: { [id: string]: RouteInfo[] } = {};

    register(page: RouteInfo) {
        page.id = (page.id||"").trim();
        if (!page.id) {
            throw Error(`page id is required: url=${page.url}, title=${page.title}`);
        }

        let route_ = this.routes[page.id];
        if (!!route_) {
            throw Error(`${page.id} is already registered with ${route_.url}.`);
        }
        this.routes[page.id] = page;


        if (this.rootId && !page.parentId && page.id != this.rootId) {
            page.parentId = this.rootId;
        }

        if (page.parentId) {
            let subRoutes = this.subRoutes[page.parentId];
            if (!subRoutes) {
                subRoutes = this.subRoutes[page.parentId] = [];
            }
            subRoutes.push(page);
        }
    }

    get(id: string): RouteInfo {
        return this.routes[id];
    }

    urlfor(id: string): string {
        let page = this.get(id);
        if (!page) {
            return "";
        }
        return page.url;
    }

    idfor(url: string): string {
        for (let [_, page] of Object.entries(this.routes)) {
            if (url == page.url) {
                return page.id;
            }
        }
        return "";
    }

    children(id: string): RouteInfo[] {
        let subRoutes = this.subRoutes[id] || [];
        if (!this.get(id) && subRoutes.length > 0) {
            console.warn(`missing parent for ${id}`);
        }
        return subRoutes;
    }

    breadCrumb(id: string): RouteInfo[] {
        if (id == this.rootId) {
            return [this.get(this.rootId)];
        }
        let page = this.get(id);
        if (!page) {
            return [];
        }
        let crumbs = [];
        while (page) {
            crumbs.unshift(page);
            page = this.get(page.parentId || "");
        }
        return crumbs;
    }
}

let siteMap = new SiteMap();

export {siteMap}
