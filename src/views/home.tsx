
import {
    elements,
    createTypeStyle,
    includePageStyle,
    includePageScript,
    allowStr,
    SafeStr,
    layouts,
    Types,
} from "../lib";

export interface Args {
    username: SafeStr,
    layout?: layouts.DefaultLayout,
}

export default function f(args: Args): string {
    let layout = args.layout || new layouts.DefaultLayout();
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
