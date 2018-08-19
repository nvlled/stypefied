
import {
    elements,
    createTypeStyle,
    createRouter,
    createBodyParser,
    includePageStyle,
    includePageScript,
    escape,
    allowStr,
    SafeStr,
    Types,
} from "./lib";

import * as layouts from "./views/layouts";
import { when } from "./lib/util";
import {getRepository} from "./db";
import {User, Item, validate} from "./models";
import { QueryFailedError } from "typeorm";

export async function createRandomStories(count=10) {
    const repo = await getRepository(Item);
    for (let i = 0; i < count; i++) {
        let item = new Item();
        item.title = Math.random().toString(36).slice(2);
        item.itemType = "story";
        item.username = "aaaa";
        repo.save(item);
    }
}

export async function getStories({pageNo=0, pageSize=20} = {}): Promise<Item[]> {
    const repo = await getRepository(Item);
    const stories = await repo.find({
        order: {
            dateUpdated: "DESC",
        },
        where: {
            itemType: "story",
        },
        skip: pageNo * pageSize,
        take: pageSize,
        cache: true
    });
    return stories;
}
