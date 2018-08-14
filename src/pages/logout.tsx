
import {
    createRouter,
    allowStr,
    Types,
} from "../lib";

const router = createRouter();

router.get("/", (request: Types.Request, response: Types.Response) => {
    request.session.username = null;
    response.redirect("/");
});

export {router};