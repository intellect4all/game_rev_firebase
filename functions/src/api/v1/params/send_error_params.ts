import {Response} from "express";

export interface SendErrorParams {
    res: Response,
    message: string,
    status?: number,
    data?: Map<unknown, unknown>,
}


