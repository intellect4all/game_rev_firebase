import { Request, Response } from "express";
import { Validator } from "../configs/validation";

import { db } from "../../../admin";
import { sendData } from "../configs/route_utils";
import { getCountFromQuery, getLastGameIdFromQuery } from "../../../helpers/request_params_helper";

export async function getAllGames(req: Request, res: Response) {
    const decoded = await Validator.validToken(req, res);

    if (decoded === undefined) return;

    const { lastGameId, limit } = req.query;


    const count = getCountFromQuery(limit);

    const lastGameIdString = getLastGameIdFromQuery(lastGameId);

    let query =
        db.collection("games").where(
            "status", "==", "published",
        )
            .orderBy("dateAdded", "desc");

    if (lastGameIdString !== undefined) {
        const lastGameSnapshot = await db.collection("movies")
            .doc(lastGameIdString as string).get();

        if (lastGameSnapshot.exists) {
            query = query.startAfter(lastGameSnapshot);
        }
    }

    const gamesQuery = await query.limit(count).get();

    const games: FirebaseFirestore.DocumentData[] = [];

    gamesQuery.forEach(
        (gameDoc) => {
            games.push({ ...gameDoc.data(), id: gameDoc.id });
        }
    );

    return sendData(
        {
            res,
            message: "Success",
            data: games,
        });

}



