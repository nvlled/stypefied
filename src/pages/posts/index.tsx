
import {
    elements,
    createRouter,
    allowStr,
    Types,
    layouts,
    db,
} from "../../lib";
import {siteMap} from "../../sitemap";

const routeInfo = {
    id: "posts",
    title: "Posts",
}

const view = () => {
    let posts = siteMap.children(routeInfo.id);
    let layout = new layouts.DefaultLayout();
    layout.body = <div>
        <ul>
        {posts.map(t => {
            return <li><a href={siteMap.urlfor(t.id)}>{t.title}</a></li>
        })}
        </ul>
    </div>;
    return layout.render();
}
const router = createRouter();

router.get("/", (request: Types.Request, response: Types.Response) => {
    request.session.username = "";
    response.send(view());
});

// Note:
// If there are subroutes, a router must be exported here,
// not a function (req, res) handler.
export {router, routeInfo};
