import {Response} from "express";

export interface SendDataParams<Type>  {
    res: Response,
    data?: Type,
    message?: string,
}


