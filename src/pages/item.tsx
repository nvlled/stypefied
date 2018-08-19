
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
    urlfor,
} from "../lib";
import { QueryFailedError } from "typeorm";
import express from "express";
import {view as notFoundView} from "../views/notfound";
import {requireLogin} from "../middlewares";
import * as api from "../api";

const {getRepository, getTreeRepository} = db;
const {Item, User} = models;
const {when, $nest, getUrlHost, getTimeFromNow} = util;

let typeStyle = createTypeStyle();
let stylesheet = typeStyle.stylesheet({
    newsub: {
        ...$nest(["label", "span"], {
            verticalAlign: "top",
            display: "inline-block",
            width: "50px",
            textAlign: "center",
        }),
    },
    comment: {
        margin: "1px",
        marginLeft: "10px",
    }
});

export interface ViewArgs {
    root:    models.Item,
    replyText?: string,
    errors?: string[],
    layout?: Types.Layout,
}

export const view = (args: ViewArgs) => {
    let {
        root,
        replyText="",
        errors=[],
        layout=new layouts.DefaultLayout(),
    } = args;

    let renderOP = (item: models.Item) => {
        let host = getUrlHost(item.url);
        let fromNow = getTimeFromNow(item.dateCreated);
        let root = item.root();

        return <div id="op">
            <span>{item.title}</span>
            {host && <span>(<a href="#">{host}</a>)</span>}
            <br />
            <span>{item.score} points</span>
            <span>by</span>
            <span>
                <a href={urlfor.user(item.username)}>
                    {item.username}
                </a>
            </span>
            {fromNow && <span>
                <a href={urlfor.item(item.id)}>
                    {fromNow}
                </a>
            </span>}
            {item.parent && "| "+<a href={urlfor.item(item.parent.id)}>parent</a>}
            | <a href={urlfor.hideItem(item.id)}>hide</a>
            | <a href={urlfor.item(item.id)}>
                0 comments
              </a>
            {(root && item.parent) &&
              "| " + <a href={urlfor.item(root.id)}>on: {root.title}</a>
            }
            <br />
            <p>{item.text}</p>
        </div>
    }

    let renderItem = (item: models.Item): string => {
        let fromNow = getTimeFromNow(item.dateCreated);
        return <div class={stylesheet.comment}>
            <span>
                <a href={urlfor.user(item.username)}>
                    {item.username}
                </a>
            </span>
            {fromNow && <span>
                <a href={urlfor.item(item.id)}>
                    {fromNow}
                </a>
            </span>}
            <br />
            <p>{item.text}</p>
            {when(item.replies.length > 0, () =>
                <div>
                {item.replies.map(renderItem)}
                </div>
            )}
        </div>;
    }

    layout.body = <div class={stylesheet.newsub}>
        {renderOP(root)}
        <form method="POST">
            <textarea rows="10" cols="50" name="text">{replyText}</textarea>
            <br />
            <button>reply</button>
            <span>{errors.join(", ")}</span>
        </form>
        {root.replies.map(renderItem)}
        <style>{typeStyle.getStyles()}</style>
    </div>;

    return layout.render();
}

export const router = createRouter();

router.use(
    async (request: Types.Request,
     response: Types.Response,
     next: express.NextFunction) =>
    {
        const repo = await getTreeRepository(Item);
        let id = parseInt(request.query.id);
        let item = await repo.findOne(id);
        if (!item) {
            return response.send(notFoundView({message: "Item not found"}));
        }
        item = await api.getThread(item);
        response.locals.root = item;
        console.log(item);
        next();
    });

router.get("/", async (request: Types.Request, response: Types.Response) => {
    let root: models.Item = response.locals.root;
    response.send(view({
        root,
    }));
});

router.use(requireLogin);
router.post("/",
    createBodyParser(),
    async (request: Types.Request, response: Types.Response) => {
        let parent: models.Item = response.locals.root;

        let {title, url, text} = request.body;
        let item = new Item();
        item.text = text;
        item.username = request.session.username;
        item.itemType = "comment";

        let errors = await models.validate(item);
        if (!url && !text) {
            errors.push("Provide url or text");
        }
        if (errors.length) {
            return response.send(view({
                root: parent,
                errors,
            }));
        }
        await api.replyThread(parent, item);

        let repo = await getTreeRepository(Item);
        let lineage = await repo.findAncestors(item);
        let root = lineage.pop() || parent;

        request.flash("info", "Submitted " + item.id);
        response.redirect(urlfor.item(root.id));
    });
