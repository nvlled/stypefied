
import view from "./view";
import {
    createRouter,
    allowStr,
    Types
} from "../../lib";
const router = createRouter();
const routeInfo = {
    id:  "about",
    url: "/",
}

router.get("/", (request: Types.Request, response: Types.Response) => {
    response.send(view({
        username: allowStr("aaa"),
    }));
});

export {router, routeInfo};
