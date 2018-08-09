
import express from "express";
import * as elements from 'typed-html';
import DefaultLayout from "../views/layout";
import {settings, defaults} from "../lib";
import * as path from "path";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import {config as dotenvConfig} from "dotenv";
import {env} from "process";

dotenvConfig();
const {resourceDir, staticDir} = settings.fs;
const server = express();
const port = 7000;

server.use(require('request-local/middleware').create());
server.use(cookieSession({
    name: env.SESSION_NAME || defaults.SESSION_NAME,
    keys: [env.SESSION_KEY || defaults.SESSION_KEY],
}));
server.use((req, res, next) => {
    require('request-local').data.foo = 'bar';
    next();
});

server.use(path.join("/", path.basename(staticDir)), express.static(staticDir));
server.use(path.join("/", path.basename(resourceDir)), express.static(resourceDir));

import about from "../pages/about";
import login from "../pages/login";
import home  from "../routes/home";
server.use("/",      home);
server.use("/about", about);
server.use("/login", login);

server.listen(port, () => {
    console.log(`server listening at ${port}`);

});
