
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

const {$nest} = util;
let typeStyle = createTypeStyle();
let stylesheet = typeStyle.stylesheet({
    fouruhoh: {
    }
});

export interface ViewArgs {
    message?: string,
    layout?: Types.Layout,
}
export const view = (args: ViewArgs) => {
    let {
        message="Missing thingy",
        layout=new layouts.DefaultLayout(),
    } = args;

    layout.body = <div class={stylesheet.fouruhoh}>
        <p>Four Uh-oh</p>
        <p>{message}</p>
    </div>;

    return layout.render();
}
