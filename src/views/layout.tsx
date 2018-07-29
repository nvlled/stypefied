
import * as elements from 'typed-html';
import {allowStr, filterStr, SafeStr} from '../safestr';
import {
    Layout,
    settings,
    includePageScript,
    includePageStyle,
} from "../lib";
const formatter = require("html-formatter");

export default class DefaultLayout implements Layout {
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

    render(): string {
        return formatter.render(<html>
            <head>
                <title>{this.title + " " + settings.sitename}</title>
                <link rel="stylesheet" href={settings.staticURL.withStyle("site.css")} />
                {this.styles.map(name => {
                    return <link rel="stylesheet" href={settings.resourceURL.withScript(name)} />
                })}
            </head>
            <body>
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
