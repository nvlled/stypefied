
import {
    elements,
    createTypeStyle,
    includePageStyle,
    includePageScript,
    createRouter,
    allowStr,
    SafeStr,
    Types,
    context,
    util,
    urlfor,
} from "../../lib";
import * as layouts from "../../views/layouts";
import {Item} from "../../models";
import {typeStyle, stylesheet} from "./style";
import { db, models, } from "../../lib";
import { Brackets } from "typeorm";

const { getRepository, getTreeRepository } = db;
const {when, getUrlHost, getTimeFromNow} = util;

export interface Args {
    layout?: layouts.DefaultLayout,
    items?: Item[],
    query?: string,
}

export function view(args: Args): string {
    let layout = args.layout || new layouts.DefaultLayout();
    layout.title = "Search";

    let ts = createTypeStyle();
    let className = ts.style({color: "blue"});
    let username = context.currentUsername();
    let {
        items=[],
        query="",
    } = args;

    let renderItem = (item: Item, i: number) => {
        let host = getUrlHost(item.url);
        let fromNow = getTimeFromNow(item.dateCreated);

        return <div class={stylesheet.item}>
            <div>
                <span class="itemNo"></span>
                <span class="title"></span>
                <br />
                <span class="score"></span>
                <span>by</span>
                <span>
                    <a href="" class="username">
                        {item.username}
                    </a>
                </span>
                {fromNow && <span>
                    <a href={urlfor.item(item.id)} class="date">
                        {fromNow}
                    </a>
                </span>}
                | <a href={urlfor.hideItem(item.id)} class="hidelink">hide</a>
                | <a href={urlfor.item(item.id)} class="commentslink">
                    0 comments
                </a>
                <br /><br />
            </div>
        </div>;
    }

    layout.showSearchForm = false;
    layout.body = <div id="home">
        <div id="search">
            search: <input name="q" value={query}/>
        </div>
        <div class={stylesheet.results}>
        {items.map(renderItem)}
        </div>
        <style>{typeStyle.getStyles()}</style>
    </div>;
    return layout.render();
}

const router = createRouter();

router.get("/", async (request: Types.Request, response: Types.Response) => {
    let item = new Item();
    item.title = "aaaa";
    response.send(view({
        items: [item],
        query: request.query.q,
    }));
});

router.get("/data.json", async (request: Types.Request, response: Types.Response) => {
    let q = "%" + (request.query.q || "") + "%";
    let repo = await getRepository(Item);
    let items = await repo.createQueryBuilder("item")
        .where("item.itemType = 'story'")
        .andWhere(new Brackets(qb => {
            qb.where("item.text like :q", { q })
            .orWhere("item.title like :q", { q });
        }))
        .limit(10)
        .getMany();
    response.send(items);
});

export {router};
