
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
    validateModel,
} from "../lib";
import * as layouts from "../views/layouts";
import { when } from "../lib/util";
import {userRepository, getRepository} from "../db";
import {User} from "../models/user";
import { QueryFailedError } from "typeorm";
import { filterStr } from "../lib/safestr";

export interface Args {
    username?: SafeStr,
    password?: SafeStr,
    password2?: SafeStr,
    layout?: layouts.DefaultLayout,
    formMsg?: SafeStr,
    action?: string,
    loginError?: SafeStr,
    registerError?: SafeStr,
}

export function view(args: Args): string {
    const ts = createTypeStyle();
    const stylesheet = ts.stylesheet({
        loginForm: {

        },
        registerForm: {

        },
    });
    let layout = args.layout || new layouts.DefaultLayout();
    let {
        action,
        loginError,
        registerError,
        formMsg,
        username,
    } = args;

    let loginForm =
        <form method="POST" class={stylesheet.loginForm}>
            <h2>Login</h2>
            <p>
                username:
                <input name="username" placeholder="username" value={username ? username+"" : ""}/>
            </p>
            <p>
                password:
                <input name="password" placeholder="password" type="password"/>
            </p>
            {loginError && <p>{loginError}</p>}
            <input type="submit" name="action" value="login"/>
        </form>;

    let registerForm =
        <form method="POST" class={stylesheet.registerForm}>
            <h2>Create Account</h2>
            <p>
                username:
                <input name="username" placeholder="username" value={username ? username+"" : ""}/>
            </p>
            <p>
                password:
                <input name="password" placeholder="password" type="password" />
            </p>
            <p>
                re-enter password:
                <input name="password2" placeholder="password" type="password" />
            </p>
            {registerError && <p>{registerError}</p>}
            <input type="submit" name="action" value="register"/>
        </form>;

    let body = <div id="login">
        <p>{formMsg}</p>
        { when(!action || action == "login",    () => loginForm) }
        { when(!action || action == "register", () => registerForm) }
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
    response.send(view({}));
});

router.post("/", createBodyParser(), async (request: Types.Request, response: Types.Response) => {
    let {action} = request.body;
    if (action == "login") {
        submitLogin(request, response);
    } else {
        submitRegister(request, response);
    }
});

let submitLogin = async (request: Types.Request, response: Types.Response) => {
    let {username, password, password2, action} = request.body;
    let users = await userRepository();
    let viewData: Args = { action, username: filterStr(username) };
    let user = await users.findOne({username, password});
    if (!user) {
        response.send(view({
            loginError: escape`Bad login.`,
            ...viewData,
        }));
    } else {
        request.session.username = username;
        request.flash('info', "Login successful");
        response.redirect("/");
    }
}

let submitRegister = async (request: Types.Request, response: Types.Response) => {
    let {username, password, password2, action} = request.body;
    let users = await getRepository(User);
    let viewData: Args = { action, username: filterStr(username) };

    [username, password, password2] =
        [username, password, password2].map(s => s.trim());

    if (!username || !password) {
        response.send(view({
            registerError: escape`Username and password is required`,
            ...viewData,
        }));
        return;
    }
    if (password != password2) {
        response.send(view({
            registerError: escape`Password does not match`,
            ...viewData,
        }));
        return;
    }

    let newUser = new User();
    newUser.username = username;
    newUser.password = password;

    let errors = await models.validate(newUser);
    if (errors.length > 0) {
        response.send(view({
            registerError: filterStr(`${errors.join(", ")}`),
            ...viewData,
        }));
        console.log(errors);
        return;
    }

    try {
        await users.save(newUser);
    } catch (e) {
        let userConstraint = !!e.message.match(/SQLITE_CONSTRAINT.*username/i);
        if (e instanceof QueryFailedError && userConstraint) {
            viewData.registerError = escape`Username is already takeen.`;
        } else {
            viewData.registerError = escape`db error: ${e.message}`;
        }
    }

    viewData.action = "";
    viewData.formMsg = escape`
        user created: id=${newUser.id+""},
        dateCreated=$${newUser.dateCreated}
    `;
    response.send(view(viewData));
}
export {router};