
import * as elements from 'typed-html';
import {siteMap} from "../sitemap";

export function breadCrumb(pageId: string) {
    let bs = siteMap.breadCrumb(pageId);
    return <ul class="breadcrumb">
        {bs.map(b => <li>
            <a href={b.url}>{b.title}</a>
        </li>)}
    </ul>
}
