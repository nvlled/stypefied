
import {
    elements,
    createTypeStyle,
    includePageStyle,
    includePageScript,
    createRouter,
    allowStr,
    SafeStr,
    Types,
    context,
    util,
    urlfor,
} from "../../lib";
import * as layouts from "../../views/layouts";
import {Item} from "../../models";
import { db, models, } from "../../lib";
import { Brackets } from "typeorm";

const { getRepository, getTreeRepository } = db;

export const router = createRouter();

router.get("/self", async (request: Types.Request, response: Types.Response) => {
    response.send({
        username: context.currentUsername(),
    });
});

