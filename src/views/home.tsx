
import {createTypeStyle} from "typestyle";
import * as elements from 'typed-html';
import {allowStr, filterStr, SafeStr} from '../safestr';
import {
    includePageStyle,
    includePageScript,
} from "../lib";
import DefaultLayout from "../views/layout";

export interface Args {
    username: SafeStr,
    layout?: DefaultLayout,
}

export default function f(args: Args): string {
    let layout = args.layout || new DefaultLayout();
    layout.title = "Home";
    layout.scripts.push("otherscript.js");
    layout.notices.push(allowStr("you are now registered"));

    let ts = createTypeStyle();
    let className = ts.style({color: "blue"});
    layout.body = <div id="home" class={className}>
        <em>Hello {args.username}</em>
        <style>
        {ts.getStyles()}
        </style>
    </div>;
    return layout.render();
}
