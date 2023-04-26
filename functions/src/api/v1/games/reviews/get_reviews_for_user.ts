import { db } from "../../../../admin";
import { getCountFromQuery } from "../../../../helpers/request_params_helper";
import { isVerifiedAdmin } from "../../admin/admin_helper";
import { sendData, sendErrorMessage } from "../../configs/route_utils";
import { Validator } from "../../configs/validation";
import { Request, Response } from "express";


export async function getReviewsForUser(req: Request, res: Response) {
    const decoded = await Validator.validToken(req, res);

    if (decoded === undefined) return;

    const { lastReviewId, limit,  } = req.query;

    const userId = req.params.userId;

    const count = getCountFromQuery(limit);

    const admin = await isVerifiedAdmin(req, res, false, false )


    if (userId !== decoded.uid && !admin) {
        return sendErrorMessage(
            {
                res,
                message: "Unauthorized",
                status: 401,
            });
    }

    let query = db.collection("reviews").where(
        "userId", "==", decoded.uid,
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