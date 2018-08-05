
import 'jquery';
import express from "express";
import * as elements from 'typed-html';
import {allowStr, filterStr, SafeStr} from '../safestr';
import DefaultLayout from "../views/layout";
import home from "../views/home";
import {settings} from "../lib";
import * as path from "path";
import bodyParser from "body-parser";

const server = express();

function render(res: express.Response, html: string) {
    res.send(html);
}

let {resourceDir, staticDir} = settings.fs;
server.use(path.join("/", path.basename(staticDir)), express.static(staticDir));
server.use(path.join("/", path.basename(resourceDir)), express.static(resourceDir));

server.get("/", (req: express.Request, res: express.Response) => {
    render(res, home({
        username: allowStr("aaa"),
    }));
});

import about from "../pages/about";
import router from "../pages/login";
server.use("/about", about);
server.use("/login", router);

const port = 7000;
server.listen(port, () => {
    console.log(`server listening at ${port}`);

});
