
import {
    Types,
} from "../lib";
import express from "express";

export const requireLogin = (
    request: Types.Request,
    response: Types.Response,
    next: express.NextFunction
) => {
    if (!request.session.username) {
        request.flash("login required");
        return response.redirect("/login");
    }
    next();
}
