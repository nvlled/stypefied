
import {
    elements,
    createTypeStyle,
    includePageStyle,
    includePageScript,
    layouts,
    SafeStr,
    Types,
} from "../../lib";

export interface Args {
    username: SafeStr,
    layout?: layouts.DefaultLayout,
}

export default function f(args: Args): string {
    let layout = args.layout || new layouts.DefaultLayout();
    layout.title = "About";

    const ts = createTypeStyle();
    const className = ts.style({color: 'red'});

    layout.body = <div id="about" class={className}>
        <em>This is misprioritized website that turned into a framework</em>
        <style>{ts.getStyles()}</style>
    </div>;
    return layout.render();
}
