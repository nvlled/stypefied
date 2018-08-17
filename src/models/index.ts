
import {validate as _validate, ValidatorOptions} from "class-validator";
import * as util from "../lib/util";

export {User} from "./user";
export {Item} from "./item";

export async function validate(object: Object, validatorOptions?: ValidatorOptions): Promise<string[]> {
    let errors = await _validate(object, validatorOptions);
    let errorMessages: string[] = [];
    for (let err of errors) {
        errorMessages = errorMessages.concat(util.objectValues(err.constraints));
    }
    return errorMessages;
}
