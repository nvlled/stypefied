
require('express-async-errors');
import "reflect-metadata";
import express from "express";
import * as path from "path";
import {config as dotenvConfig} from "dotenv";
import {env} from "process";
import {siteMap, RouteInfo, getParentId} from "../sitemap";
import {
    settings, defaults,
    importRoutes,
    Types,
} from "../lib";

const flash = require("connect-flash");
const {resourceDir, staticDir} = settings.fs;
const server = express();
const port = 7000;

dotenvConfig();
server.use(require('request-local/middleware').create());
server.use(require("cookie-session")({
    name: env.SESSION_NAME || defaults.SESSION_NAME,
    keys: [env.SESSION_KEY || defaults.SESSION_KEY],
}));
server.use(flash());
server.use((req, res, next) => {
    // example of adding data to request context
    require('request-local').data.foo = 'bar';
    next();
});

// Serve static assets from static/ and resources/
// * resources/ contain generated client scripts
server.use(path.join("/", path.basename(staticDir)),    express.static(staticDir));
server.use(path.join("/", path.basename(resourceDir)),  express.static(resourceDir));

let registerRoute = (router: express.Router, routeInfo: RouteInfo) => {
    server.use(routeInfo.url, router);
    if (routeInfo.id) {
        routeInfo.parentId = getParentId(routeInfo);
        siteMap.register(routeInfo);
    } else {
        console.log(`* ${routeInfo.url} has no exported id`);
    }
}

// Manually import routes from src/controllers
import * as home  from "../controllers/home";
registerRoute(home.router,  home.routeInfo);

// Automatically import routes from src/pages and contollers/json
const pages = importRoutes("pages", "");
const apis = importRoutes("controllers/json", "api");

for (let [router, routeInfo] of pages.concat(apis)) {
    console.log(`mounting ${routeInfo.url} from ${routeInfo.filename}`);
    registerRoute(router, routeInfo);
}
// Note:
// Modules from src/controllers and src/pages exports the following:
// (1) router:    express.Router
//  or handler:   express.Handler
// (2) routeInfo: sitemap.RouteInfo  (optional)



// Error handler
server.use((err: any, req: Types.Request, res: Types.Response, next: express.NextFunction) => {
    if (err) {
        res.status(500);
        res.send(`error: ${err.toString()}`);
        console.log("error: ", err);
    }
});

server.listen(port, () => {
    const touch = require("touch");
    touch.sync(".server-reload");
    console.log(`server listening at ${port}`);
});
