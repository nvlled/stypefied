
import express from "express";
import view from "../views/home";
import {Types} from "../lib";
import {allowStr, filterStr, SafeStr} from '../safestr';
const router = express.Router();

router.get("/", (request: Types.Request, response: Types.Response) => {
    response.send(view({
        username: allowStr("aaa"),
    }));
});

export default router;
