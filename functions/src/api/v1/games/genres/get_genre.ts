import { DocumentData } from "@google-cloud/firestore";
import { db } from "../../../../admin";
import { sendErrorMessage, sendData } from "../../configs/route_utils";
import {Request, Response} from "express";
import { Validator } from "../../configs/validation";

export async function getGenre(req:Request, res:Response) {
    const decoded = await Validator.validToken(req, res);

    if (decoded === undefined) return;

    
    let genreSlug = req.params.slug;
    if (!genreSlug) {
        return sendErrorMessage({
        res: res,
        data: undefined,
        message: "Genre Slug is required",
        status: 400,
        });
    }
    const genreData = await db.doc(`genres/${genreSlug}`).get();
    if (!genreData.exists) {
        return sendErrorMessage({
        res: res,
        data: undefined,
        message: "Genre does not exist",
        status: 400,
        });
    }
    const genre = genreData.data() as DocumentData;
    return sendData(
        {
            res,
            message: "Success",
            data: {
                ...genre,
                id: genreSlug,
            },
        }
    );
}