
import * as urlfor from "../../lib/urlfor";
import {stylesheet} from "./style";
import {Item} from "../../models/item";
import axios from "axios";
import {DomSh7} from "../../client/common";

window.onload = () => {
    let s = stylesheet;
    let results   = new DomSh7("."+stylesheet.results);
    let itemTempl = new DomSh7("."+stylesheet.item, [
        "title",
        "itemNo",
        "username",
        "date",
        "hidelink",
        "commentslink",
        "score",
    ]).remove();

    let input: HTMLInputElement|null = document.querySelector("#search input");
    if (input == null) {
        throw Error("input not found");
    }
    input.onchange = async e => {
        results.clear();
        if (input == null)
            return;

        let q = (input.value || "").toString().trim();
        let {pathname} = window.location;
        let resp = await axios.get(`${pathname}/data.json?q=${q}`);
        let i = 0;
        for (let itemData of resp.data) {
            let item = itemTempl.new({
                itemNo: ++i+".",
                ...itemData
            });
            item.$("commentslink").attr("href", urlfor.item(itemData.id));
            results.append(item);
        }
        window.history.replaceState({}, "", `?q=${q}`);
    };
    input.onchange(new Event(''));
}
