import { Request, Response } from "express";
import { Validator } from "../../configs/validation";
import { getCountFromQuery } from "../../../../helpers/request_params_helper";
import { db } from "../../../../admin";
import { sendData, sendErrorMessage } from "../../configs/route_utils";

export async function getAllReviewsForGame(req: Request, res: Response) {
    const decoded = await Validator.validToken(req, res);

    if (decoded === undefined) return;

    const gameId = req.params.gameId;

    const { lastReviewId, limit } = req.query;

    const count = getCountFromQuery(limit);

    let query = db.collection("reviews").where(
        "gameId", "==", gameId,
    ).where(
        "isDeleted", "==", false,
    ).orderBy("createdAt", "desc");

    try {
        if (lastReviewId !== undefined && lastReviewId !== "") {
            const lastReviewSnapshot = await db.collection("reviews")
                .doc(lastReviewId as string).get();

            if (lastReviewSnapshot.exists) {
                query = query.startAfter(lastReviewSnapshot);
            }
        }

        const reviewsQuery = await query.limit(count).get();

        const reviews: FirebaseFirestore.DocumentData[] = [];

        reviewsQuery.forEach(
            (reviewDoc) => {
                reviews.push({ ...reviewDoc.data(), id: reviewDoc.id });
            }

        );
        return sendData(
            {
                res,
                message: "Success",
                data: reviews,
            });

    } catch (error) {
        return sendErrorMessage(
            {
                res,
                message: "Something went wrong",
                status: 500,
            });
    }

}