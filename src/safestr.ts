

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

export function allowStr(str: string): SafeStr {
    return new SafeStr(str);
}

export function filterStr(str: string): SafeStr {
    return new SafeStr(sanitizeHtml(str));
}

export default {
    allowStr, filterStr
}
