
import 'jquery';
import express from "express";
import * as elements from 'typed-html';
import {allowStr, filterStr, SafeStr} from '../safestr';
import DefaultLayout from "../views/layout";
import {settings} from "../lib";
import * as path from "path";
import bodyParser from "body-parser";

const server = express();

let {resourceDir, staticDir} = settings.fs;
server.use(path.join("/", path.basename(staticDir)), express.static(staticDir));
server.use(path.join("/", path.basename(resourceDir)), express.static(resourceDir));

import about from "../pages/about";
import login from "../pages/login";
import home  from "../routes/home";

server.use("/",      home);
server.use("/about", about);
server.use("/login", login);

const port = 7000;
server.listen(port, () => {
    console.log(`server listening at ${port}`);

});
