
import express from "express";
import view from "./view";
import {allowStr, filterStr, SafeStr} from '../../safestr';
import {Types} from "../../lib";
const router = express.Router();

router.get("/", (request: Types.Request, response: Types.Response) => {
    response.send(view({
        username: allowStr("aaa"),
    }));
});

export default router;
