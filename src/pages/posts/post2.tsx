
import {
    elements,
    createRouter,
    allowStr,
    layouts,
    Types,
} from "../../lib";

const router = createRouter();
const routeInfo = {
    id: "post2",
    title: "Post 2 title",
}

router.get("/", (request: Types.Request, response: Types.Response) => {
    let layout = new layouts.DefaultLayout();
    layout.body = <div>
        <h3>{routeInfo.title}</h3>
    </div>;
    response.send(layout.render());
});

// TODO: export pageInfo instead
export {router, routeInfo};
