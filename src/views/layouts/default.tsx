
import {
    filterStr,
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
import * as csstips from "csstips";
import {createTypeStyle} from "typestyle";

// I guess one disadvantage of typestyle
// is that I have to restart the server
// everytime I make changes here.
const typeStyle = createTypeStyle();
const stylesheet = (() => {
    let {
        flex, fillParent,
        horizontal, vertical,
        centerCenter,
    } = csstips;
    return typeStyle.stylesheet({
        body: {
            fontSize: "130%",
            fontFamily: "Sans-Serif",
            backgroundColor: "#fdfdfdf",
            $nest: {
                a: {
                    color: '#0af',
                },
                ul: {
                    color: "red",
                    padding: "0",
                    margin: "5px",

                }
            },
        },
        aside: {
            backgroundColor: 'rgba(50, 50, 80, 0.9)',
            color: 'white',
        },
        header: {
            fontFamily: "Monospace",
            backgroundColor: '#118',
            color: '#fcfcf9',
        },
        siteinfo: {
            $nest: {
                h1: {
                    margin: 0,
                    padding: 0,
                    $nest: {
                        a: {
                            color: "#fcfcfc",
                            textDecoration: "none",
                        }
                    },
                }
            },
            ...flex,
            ...horizontal,
        },
        nameAndNav: {
            ...flex,
        },
        userinfo: {
            padding: "10px",
            ...vertical,
            ...csstips.centerCenter,
        },
        wrapper: {
            minHeight: "90%",
            ...flex,
            ...horizontal,
        },
        contents: {
            padding: "10px",
            backgroundColor: '#fdfdfd',
            ...flex,
        },
        footer: {
            color: "white",
            backgroundColor: '#118',
            padding: "5px",
        },
        notice: {
            backgroundColor: "rgba(50, 150, 60, 0.7)",
            textAlign: "center",
        },
        mainNav: {
            margin: "0px",
            padding: "0px",
            $nest: {
                li: {
                    margin: "0px",
                    padding: "0px",
                    listStyleType: "none",
                    display: "inline-block",
                    $nest: {
                       a: {
                            color: "#ffa",
                            textDecoration: "none",
                        },
                       '&:first-child': {
                           $nest: { '&::before': { content: `''` } }
                       },
                       '&::before': {
                           content: `'|'`
                       },
                    }
                },
            },
        },
    });
})();

export class DefaultLayout implements Types.Layout {
    notices:  SafeStr[] = [];
    errors:   SafeStr[] = [];
    styles:   string[] = [];
    scripts:  string[] = [];
    title =   "";
    body  =   "";
    aside =   "";
    showSearchForm = true;

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

        let messages = context.flashMessages().map(filterStr);
        let notices = this.notices.concat(messages);

        let currentUser = {
            username,
            karma: 0,
        }
        let {staticURL, resourceURL} = settings;
        let {withStyle} = staticURL;
        let {withScript} = resourceURL;

        let navItems = [
            {text: "new", href: "/new"},
            {text: "threads", href: "/threads"},
            {text: "comments", href: "/comments"},
            {text: "submit", href: "/new-submission"},
        ];

        let {when} = util;
        let mainNav = <ul class={stylesheet.mainNav}>
            {navItems.map(item =>
                <li>
                    <a href={item.href}>{item.text}</a>
                </li>
            )}
        </ul>;

        let header = <header id="site" class={stylesheet.header}>
            <div class={stylesheet.siteinfo}>
                <img src={staticURL.with("images/logo.png")} />
                <div class={stylesheet.nameAndNav}>
                    <h1><a href="/">{settings.sitename}</a></h1>
                    {mainNav}
                </div>
                <div class={stylesheet.userinfo}>
                    {!!username
                      ? <div>
                              <a href="#">{username} </a>
                              ({currentUser.karma}) |
                              <a href="/logout">logout</a>
                        </div>
                      : <div><a href="/login">login</a></div>
                    }

                </div>
            </div>
        </header>;

        return formatter.render(<html>
            <head>
                <title>{this.title + " " + settings.sitename}</title>
                <link rel="stylesheet" href={settings.staticURL.withStyle("normalize.css")} />
                <link rel="stylesheet" href={settings.staticURL.withStyle("site.css")} />
                {this.styles.map(name => {
                    return <link rel="stylesheet" href={settings.resourceURL.withScript(name)} />
                })}
                <style>{typeStyle.getStyles()}</style>
            </head>
            <body class={stylesheet.body}>
                {header}
                <div>
                    {notices.map(msg =>
                        <div class={stylesheet.notice}>
                        ♫ <span>{msg}</span>
                        </div>
                    )}
                </div>

                <div class={stylesheet.wrapper}>
                {when(!!this.aside, () =>
                    <section id="aside" class={stylesheet.aside}>
                        {this.aside}
                    </section>
                )}
                <section id="contents" class={stylesheet.contents}>
                    {this.body}
                </section>
                </div>

                <footer class={stylesheet.footer}>
                    {when(this.showSearchForm, () =>
                        <form action="/search-items">
                            search: <input name="q" />
                        </form>
                    )}
                </footer>
            </body>
            {this.scripts.map(name => {
                return <script src={settings.resourceURL.withScript(name)}></script>
            })}
        </html>)
    }
}

export default DefaultLayout;

