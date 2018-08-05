
import express from "express";
import view from "../views/home";
import {allowStr, filterStr, SafeStr} from '../safestr';
const router = express.Router();

router.get("/", (req: express.Request, res: express.Response) => {
    res.send(view({
        username: allowStr("aaa"),
    }));
});

export default router;
