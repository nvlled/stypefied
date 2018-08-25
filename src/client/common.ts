
type Sel = string | { name: string; sel: string; };
type Dict<T = string, U = string|number> = { [key: string] : U };
type HtmlStr = { html: string };

export class DomSh7 {
    node: HTMLElement;
    sels: Sel[];
    nodes: { [name: string]: DomSh7 } = {};
    showWarnings = false;

    constructor(nodeSel: string|HTMLElement, sels: Sel[] = []) {
        this.sels = sels;
        if (typeof nodeSel == "string") {
            let sel = nodeSel;
            let node: HTMLElement|null = document.querySelector(sel);
            if (node == null) {
                throw Error(`element not found: ${sel}`);
            }
            this.node = node;
        } else {
            this.node = nodeSel;
        }

        for (let entry of sels) {
            let name: string = "";
            let sel = "";
            let node: HTMLElement|null = null;

            if (typeof entry == "string") {
                name = entry;
                let prefixes = ["#", ".", ];
                for (let pref of prefixes) {
                    sel = `${pref}${name}`;
                    node = this.node.querySelector(sel);
                    if (!!node)
                        break;
                }
                if (!node) {
                    let str = prefixes.map(p => `${p}${name}`).join(", ");
                    throw Error(`no matching element found: ${str}`);
                }
            } else {
                ({name, sel} = entry);
                node = this.node.querySelector(sel);
                if (node == null) {
                    throw Error(`element not found: ${sel}`);
                }
            }
            if (name != null && node != null) {
                this.nodes[name] = new DomSh7(node);
            }
        }
    }

    text(val?: string): string {
        if (this.node instanceof HTMLInputElement) {
            let input: HTMLInputElement = this.node;
            if (val != null) {
                input.value = val;
            }
            return input.value;
        }
        if (val != null) {
            this.node.textContent = val;
        }
        return this.node.textContent || "";
    }

    html(val?: string): string {
        if (val != null) {
            this.node.innerHTML = val;
        }
        return this.node.innerHTML || "";
    }


    remove() { this.node.remove(); return this }
    clear() { this.node.innerHTML = ""; return this }
    show() { this.node.style.display = ""; return this }
    hide() { this.node.style.display = "none"; return this; }
    attr(name: string, val?: any): string {
        if (val != null) {
            this.node.setAttribute(name, val);
        }
        return this.node.getAttribute(name) || "";
    }

    map(obj: Dict<HtmlStr | string>) {
        for (let name of Object.keys(obj)) {
            let val  = obj[name];
            let node = this.nodes[name];
            if (!node) {
                if (this.showWarnings) {
                    console.warn(`no elem mapped to name: ${name}`);
                }
                continue;
            }
            if (typeof val == "string")
                node.text(val);
            else if (typeof val == "number")
                node.text(val+"");
            else
                node.html(val);
        }
        return this;
    }

    new(obj: Dict<HtmlStr | string> = {}) {
        let node: Node = this.node.cloneNode(true);
        if (node instanceof HTMLElement) {
            let inst = new DomSh7(node, this.sels);
            inst.map(obj);
            return inst;
        } else {
            throw Error("huh");
        }
    }

    $(name: string): DomSh7 {
        let node = this.nodes[name];
        if (node == null) {
            throw Error(`unknown element: ${name}`);
        }
        return node;
    }

    append(obj: DomSh7|HTMLElement) {
        let node = obj instanceof DomSh7 ? obj.node : obj;
        if (obj instanceof DomSh7) {
            this.node.appendChild(obj.node);
            obj.show();
        } else {
            node = obj;
            this.node.appendChild(obj);
            this.node.style.display = "";
        }
        return this;
    }
}
