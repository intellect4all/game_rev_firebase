import {Request, Response} from "express";

import { Validator } from "../configs/validation";
import Joi from "joi";
import { sendData, sendErrorMessage } from "../configs/route_utils";
import { db } from "../../../admin";

export async function getGame(req: Request,  res: Response) {
    const decoded = await Validator.validToken(req, res);

  if (decoded === undefined) return;

  let gameId = req.params.id;

    const { error } = Joi.string().min(3).required().validate(gameId);

    if (error) {
        return sendErrorMessage({
            res: res,
            message: "Game Id is required",
            status: 400,
        }
        );

    }

    const game = await db.collection("games").doc(gameId).get();

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
