import { Request, Response } from "express";
import { admin, db } from "../../../../admin";
import { sendErrorMessage, sendData } from "../../configs/route_utils";
import { Validator } from "../../configs/validation";
import { AddReviewDTO } from "../../dtos/add_review_dto";

export async function addReview(req: Request, res: Response) {
    const decoded = await Validator.validToken(req, res);

    if (decoded === undefined) return;

    let addReviewReq =  req.body as AddReviewDTO;

    const reviewDataOrError = Validator.validateAddReview(addReviewReq);

    if (typeof reviewDataOrError === "string") {
        return sendErrorMessage({
            res: res,
            message: reviewDataOrError,
            status: 400,
        });
    }

        

    const game = await db.collection("games").doc(addReviewReq.gameId).get();

    if (!game.exists) {
        return sendErrorMessage({
            res: res,
            message: "Game does not exist",
            status: 404,
        },
        );
    }

    const reviewRef = await db.collection("reviews").add({
        ...addReviewReq,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isDeleted: false,
        isFlagged: false,
        userId: decoded.uid,
        isEdited : false,
    });

    return sendData({
        res,
        message: "Success",
        data: {
            ...addReviewReq,
            id: reviewRef.id,

        },
    });
}