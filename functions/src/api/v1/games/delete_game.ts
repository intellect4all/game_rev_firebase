import {Request, Response} from "express";
import Joi from "joi";
import { sendData, sendErrorMessage } from "../configs/route_utils";
import { db } from "../../../admin";
import { isVerifiedAdmin } from "../admin/admin_helper";

export async function deleteGame(req: Request,  res: Response) {
    const isAdminVerified = await isVerifiedAdmin(req, res);

    if (typeof isAdminVerified == "boolean") {
        // return because error message has been sent to user
        return;
    }

  let gameId = req.params.id;

    const { error } = Joi.string().min(3).required().validate(gameId);

    if (error) {
        return sendErrorMessage({
            res: res,
            message: error.message,
            status: 400,
        }
        );

    }
    let game : FirebaseFirestore.DocumentSnapshot;
    try {
         game = await db.collection("games").doc(gameId).get();
    } catch (error) {
        return sendErrorMessage({
            res: res,
            message: "Something went wrong",
            status: 400,
        });
    }

    if (!game.exists) {
        return sendErrorMessage({
            res: res,
            message: "Game does not exist",
            status: 400,
        });
    }

    return sendData({
        res,
        message: "Success",
        data: {
            ...game.data(),
            id: game.id,
        },
    });
}
