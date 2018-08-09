
import view from "../views/home";
import {
    createRouter,
    allowStr,
    Types,
} from "../lib";

const router = createRouter();

router.get("/", (request: Types.Request, response: Types.Response) => {
    response.send(view({
        username: allowStr("aaa"),
    }));
});

export default router;
