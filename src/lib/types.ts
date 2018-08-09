
import express from "express";
import {allowStr, filterStr, SafeStr} from '../lib';

export namespace Types {
    export type Request  = express.Request & { session: {[key: string]: string} };
    export type Response = express.Response;
    export type HttpContext  = { request: Request, response: Response }

    export interface Layout {
        notices: SafeStr[],
        errors:  SafeStr[],
        styles:  string[],
        scripts:  string[],
        title:   string,
        body:    string,
        aside:   string,

       render(): string,
    }
}

