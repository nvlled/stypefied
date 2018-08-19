
import {
    elements,
    createTypeStyle,
    createRouter,
    createBodyParser,
    includePageStyle,
    includePageScript,
    escape,
    filterStr,
    allowStr,
    SafeStr,
    Types,
    layouts,
    db,
    models,
    util,
} from "../lib";
import { QueryFailedError } from "typeorm";
import express from "express";

const {getRepository} = db;
const {Item} = models;
const {$nest} = util;

let typeStyle = createTypeStyle();
let stylesheet = typeStyle.stylesheet({
    newsub: {
        ...$nest(["label", "span"], {
            verticalAlign: "top",
            display: "inline-block",
            width: "50px",
            textAlign: "center",
        }),
    }
});

export interface ViewArgs {
    title?: string,
    url?:   string,
    text?:  string,
    errors?: string[],
    layout?: Types.Layout,
}

export const view = (args: ViewArgs) => {
    let {
        title="",
        url="",
        text="",
        errors=[],
        layout=new layouts.DefaultLayout(),
    } = args;

    layout.body = <div class={stylesheet.newsub}>
        <form method="POST">
            <label>
                <span>title</span> <input name="title" value={title} />
            </label>
            <br />
            <label>
                <span>url</span> <input name="url" value={url} />
            </label>
            <br />
            <label>
                <span>text</span>
                <textarea rows="10" cols="50" name="text">{text}</textarea>
            </label>
            <br />
            <label>
                <span></span>
                {errors.join(", ")}
            </label>
            <br />
            <label>
                <span></span>
                <button>submit</button>
            </label>
        </form>

        <style>{typeStyle.getStyles()}</style>
    </div>;

    return layout.render();
}

export const router = createRouter();

router.use(
    (request: Types.Request,
     response: Types.Response,
     next: express.NextFunction) =>
    {
        if (!request.session.username) {
            request.flash("login required");
            return response.redirect("/login");
        }
        next();
    });

router.get("/", (request: Types.Request, response: Types.Response) => {
    response.send(view({}));
});

router.post("/",
    createBodyParser(),
    async (request: Types.Request, response: Types.Response) => {
        let {title, url, text} = request.body;
        let item = new Item();
        item.title = title;
        item.url = url;
        item.text = text;
        item.username = text;
        item.itemType = "story";

        let repo = await getRepository(Item);
        let errors = await models.validate(item);
        if (!url && !text) {
            errors.push("Provide url or text");
        }
        if (errors.length) {
            return response.send(view({
                errors,
            }));
        }

        await repo.save(item);
        request.flash("info", "Submitted");
        response.redirect("/");
    });

