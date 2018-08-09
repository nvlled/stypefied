
import {
    elements,
    createTypeStyle,
    createRouter,
    createBodyParser,
    includePageStyle,
    includePageScript,
    escape,
    allowStr,
    SafeStr,
    Types,
} from "../lib";
import * as layouts from "../views/layouts";

export interface Args {
    username: SafeStr,
    layout?: layouts.DefaultLayout,
    formMsg?: SafeStr,
    errors: {
        username?: SafeStr,
        password?: SafeStr,
        form?: SafeStr,
    },
}

export function view(args: Args): string {
    const ts = createTypeStyle();
    const className = ts.style({color: 'red'});
    let layout = args.layout || new layouts.DefaultLayout();
    let errors = args.errors || {};


    let body = <div id="login" class={className}>
        <form method="POST">
            <input name="username" placeholder="username"/>
            <input name="password" placeholder="password" type="password"/>
            <input type="submit" />
            {errors.form && <span>{errors.form}</span>}
        </form>
        <style>{ts.getStyles()}</style>
    </div>;

    if (args.formMsg)
        layout.notices.push(args.formMsg);

    layout.title = "login";
    layout.body = body;
    return layout.render();
}

const router = createRouter();

router.get("/", (request: Types.Request, response: Types.Response) => {
    response.send(view({
        username: allowStr("aaa"),
        errors: {},
    }));
});

router.post("/", createBodyParser(), (request: Types.Request, response: Types.Response) => {
    let {username, password} = request.body;
    console.log("user pass: ", username, password);

    let viewData: Args = {
        username: allowStr("aaa"),
        errors: {},
    }

    if (username != "admin" && password != "pass") {
        viewData.errors = {
            form: escape`invalid username or password`,
        }
    } else {
        viewData.formMsg = allowStr("login successful");
        request.session.username = username;
    }

    response.send(view(viewData));
});

export default router;
