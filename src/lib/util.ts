import * as path from "path";
import {URL} from "url";
import moment from "moment";
import ts from "typestyle";

// removePathPrefix("/a/b/c", "/a") == "/b/c"
// removePathPrefix("/a/b/c", "/a/") == "/b/c"
// removePathPrefix("/a/b/c", "/a/b") == "/c"
// removePathPrefix("/a/b", "/a/b") == "/"
// removePathPrefix("a/b", "a/b") == "."
// removePathPrefix("/a/b", "/a/b/c") == "/a/b"
export function removePathPrefix(str: string, prefix: string) {
    let sep = path.sep;
    let prefs = prefix.split(sep);
    let strs = str.split(sep);

    if (prefs.length > strs.length)
        return str;

    let i = 0;
    while (i < prefs.length) {
        if (prefs[i] != strs[i])
            break;
        i++;
    }
    return path.join( ...strs.slice(i, strs.length));
}

export function when(cond: boolean, body: () => any, alt: () => any = null): any {
    if (cond)
        return body();
    if (typeof alt == "function")
        return alt();
    return null;
}

export function objectValues(obj: any) {
    return Object.keys(obj).map(k => obj[k]);
}

export function getUrlHost(url: string): string {
    try {
        return new URL(url).hostname;
    } catch (e) {
        return "";
    }
}

export function getTimeFromNow(datetime: string): string {
    let m = moment(datetime);
    if ( ! m.isValid())
        return "";
    return m.fromNow();
}

export function $nest(selectors: string[], prop: ts.types.NestedCSSProperties):
Record<string, ts.types.NestedCSSProperties>
{
    if (selectors.length == 0)
        return {};
    let sel = selectors.pop();
    selectors.reverse();
    let props = {
        $nest: {
            [sel]: prop,
        }
    }
    for (let sel of selectors) {
        let props_ = {
            $nest: {
                [sel]: props,
            }
        }
        props = props_;
    }
    return props;
}
