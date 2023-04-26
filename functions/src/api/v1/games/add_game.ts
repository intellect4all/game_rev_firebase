import { Request, Response } from "express";
import { isVerifiedAdmin } from "../admin/admin_helper";
import { Validator } from "../configs/validation";
import { AddGameDTO } from "../dtos/add_game_dto";
import { sendData, sendErrorMessage } from "../configs/route_utils";
import { admin, db } from "../../../admin";


export async function addGame(req: Request, res: Response) {
    const isAdminVerified = await isVerifiedAdmin(req, res);

    if (typeof isAdminVerified == "boolean") {
        // return because error message has been sent to user
        return;
    }

    let addGameReq = req.body as AddGameDTO;


    const gameDataOrError = Validator.validateGameData(addGameReq);

    if (typeof gameDataOrError == "string") {
        return sendErrorMessage({
            res: res,
            message: gameDataOrError,
            status: 400,
        });
    }

    let genres = addGameReq.genreSlugs;

    let embeddedGenres = [];

    // check if genres exist and active

    for (let i = 0; i < genres.length; i++) {
        const genre = genres[i];

        const genreDoc = await db.collection("genres").doc(genre).get();

        if (!genreDoc.exists) {
            return sendErrorMessage({
                res: res,
                message: "Genre does not exist",
                status: 400,
            });

        }

        const genreData = genreDoc.data();

        if (!genreData?.active) {
            return sendErrorMessage({
                res: res,
                message: "Genre is not active",
                status: 400,
            });
        }

        embeddedGenres.push({
            id: genre,
            title: genreData?.title ?? "",
        });
    }

    const titleArray = addGameReq.title
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, "").toLowerCase()
        .split(" ");

    const game = await db.collection("games").add({
        dateAdded: admin.firestore.FieldValue.serverTimestamp(),
        ...addGameReq,
        _titleArray: titleArray,
    });


    return sendData({
        res: res,
        message: "Game added successfully",
        data: {
            id: game.id,
        }
    });

}