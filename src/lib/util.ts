import * as path from "path";

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