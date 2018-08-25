
import view from "../views/home";
import {
    createRouter,
    allowStr,
    Types,
} from "../lib";
import {Item} from "../models";
import {getStories} from "../api";

const router = createRouter();

router.get("/", async (request: Types.Request, response: Types.Response) => {
    response.send(view({
        items: await getStories(),
    }));
});

export default router;
