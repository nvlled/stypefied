
import {
    elements,
    Types,
    settings,
    includePageScript,
    includePageStyle,
    SafeStr,
    util,
    context,
} from "../../lib";
const formatter = require("html-formatter");

export class DefaultLayout implements Types.Layout {
    notices:  SafeStr[] = [];
    errors:   SafeStr[] = [];
    styles:   string[] = [];
    scripts:  string[] = [];
    title =   "";
    body  =   "";
    aside =   "";

    constructor(includeAssets=true) {
        if (includeAssets) {
            this.scripts.push(includePageScript(2));
            this.styles.push(includePageStyle(2));
        }
    }

    render(username: string = ""): string {
        if (!username) {
            username = context.currentUsername();
        }

        return formatter.render(<html>
            <head>
                <title>{this.title + " " + settings.sitename}</title>
                <link rel="stylesheet" href={settings.staticURL.withStyle("site.css")} />
                {this.styles.map(name => {
                    return <link rel="stylesheet" href={settings.resourceURL.withScript(name)} />
                })}
            </head>
            <body>
                {util.when(!!username, () => {
                    return <em>greetings {username}</em>
                })}
                {this.notices.map(msg =>
                    <div class="notice">
                    ♫ <span>{msg}</span>
                    </div>
                )}
                <h1>sitename</h1>
                <hr />
                <div class="wrapper">
                    {this.body}
                </div>
            </body>
            {this.scripts.map(name => {
                return <script src={settings.resourceURL.withScript(name)}></script>
            })}
        </html>)
    }
}

export default DefaultLayout;
