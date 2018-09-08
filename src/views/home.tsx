
import {
    elements,
    createTypeStyle,
    includePageStyle,
    includePageScript,
    allowStr,
    SafeStr,
    Types,
    context,
    util,
    urlfor,
} from "../lib";
import * as layouts from "./layouts";
import {Item} from "../models";
import {siteMap} from "../sitemap";

const {when, getUrlHost, getTimeFromNow} = util;

export interface Args {
    layout?: layouts.DefaultLayout,
    items?: Item[],
    startNo?: number,
}

export default function f(args: Args): string {
    let layout = args.layout || new layouts.DefaultLayout();
    layout.title = "Home";
    layout.scripts.push("otherscript.js");

    let ts = createTypeStyle();
    let className = ts.style({color: "blue"});
    let username = context.currentUsername();
    let {
        items=[],
        startNo=1,
    } = args;

    layout.aside = <div>
        <div><a href={siteMap.urlfor("posts")}>Posts</a></div>
        <ul>
        {siteMap.children("posts").map(page => {
            return <li><a href={page.url}>{page.title}</a></li>
        })}
        </ul>
    </div>;


    let renderItem = (item: Item, i: number) => {
            let host = getUrlHost(item.url);
            let fromNow = getTimeFromNow(item.dateCreated);
            return <div>
                <span>{i+startNo}.</span>
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
                | <a href={urlfor.hideItem(item.id)}>hide</a>
                | <a href={urlfor.item(item.id)}>
                    0 comments
                </a>
                <br /><br />
            </div>;
    }

    layout.body = <div id="home" class={className}>
        {items.map(renderItem)}
        <style>{ts.getStyles()}</style>
    </div>;
    return layout.render();
}
