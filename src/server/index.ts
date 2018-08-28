
import "reflect-metadata";
require('express-async-errors');
import express from "express";
import {
    settings, defaults,
    importRouters,
    Types,
} from "../lib";
import * as path from "path";
import {config as dotenvConfig} from "dotenv";
import {env} from "process";
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

//#route imports
import home  from "../controllers/home";
server.use("/", home);

// Use routers on "src/pages"
// You can also remove this line
// and manually import them
// for added type-safety
importRouters(server, "pages", "");

// Add json routers on /api
importRouters(server, "controllers/json", "api");

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
