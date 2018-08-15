
import {
    elements,
    createTypeStyle,
    includePageStyle,
    includePageScript,
    allowStr,
    SafeStr,
    Types,
    context,
} from "../lib";
import * as layouts from "./layouts";

export interface Args {
    layout?: layouts.DefaultLayout,
}

export default function f(args: Args): string {
    let layout = args.layout || new layouts.DefaultLayout();
    layout.title = "Home";
    layout.scripts.push("otherscript.js");

    let ts = createTypeStyle();
    let className = ts.style({color: "blue"});
    let username = context.currentUsername();
    layout.aside = <div>
        <ul>
            <li><a href="#">article 1</a></li>
            <li><a href="#">article 2</a></li>
            <li><a href="#">article 3</a></li>
        </ul>
    </div>;
    layout.body = <div id="home" class={className}>
        <em>Hello {username || "there"}!</em>
        <style>{ts.getStyles()}</style>
    </div>;
    return layout.render();
}
