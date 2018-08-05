
import {createTypeStyle} from "typestyle";
import * as elements from 'typed-html';
import {allowStr, filterStr, SafeStr} from '../../safestr';
import {
    includePageStyle,
    includePageScript,
} from "../../lib";
import DefaultLayout from "../../views/layout";

export interface Args {
    username: SafeStr,
    layout?: DefaultLayout,
}

export default function f(args: Args): string {
    let layout = args.layout || new DefaultLayout();
    layout.title = "About";

    const ts = createTypeStyle();
    const className = ts.style({color: 'red'});

    layout.body = <div id="about" class={className}>
        <em>This is misprioritized website that turned into a framework</em>
        <style>{ts.getStyles()}</style>
    </div>;
    return layout.render();
}
