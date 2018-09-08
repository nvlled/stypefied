
import {
    createRouter,
    allowStr,
    Types,
} from "../../../lib";

const router = createRouter();
const routeInfo = {
    id: "post3",
    title: "Post 3 title",
}

router.get("/", (request: Types.Request, response: Types.Response) => {
    request.session.username = "";
    response.send("post 3");
});

// TODO: export pageInfo instead
export {router, routeInfo};
