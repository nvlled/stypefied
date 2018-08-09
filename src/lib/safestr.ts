

const sanitizeHtml: (html: string, opts?: any) => string = require('sanitize-html');

export class SafeStr {
    value: string

    constructor(value: string) {
        this.value = value;
    }

    toString(): string {
        return this.value;
    }
}

export function escape(strs: TemplateStringsArray, ...values: string[]): SafeStr {
    let result = "";
    for (let i = 0; i < values.length; i++) {
        result += strs[i];
        result += sanitizeHtml(values[i]);
    }
    result += strs[strs.length-1];
    return new SafeStr(result);
}

export function allowStr(str: string): SafeStr {
    return new SafeStr(str);
}

export function filterStr(str: string): SafeStr {
    return new SafeStr(sanitizeHtml(str));
}

export default {
    allowStr, filterStr
}
