import { db } from "../../../../admin";
import { getCountFromQuery } from "../../../../helpers/request_params_helper";
import { isVerifiedAdmin } from "../../admin/admin_helper";
import { sendData, sendErrorMessage } from "../../configs/route_utils";
import { Request, Response } from "express";

export async function getAllReviews(req: Request, res: Response) {
    const isAdminVerified = await isVerifiedAdmin(req, res);

    if (typeof isAdminVerified == "boolean") {
        // return because error message has been sent to user
        return;
    }

    const { lastReviewId, limit } = req.query;

    const count = getCountFromQuery(limit);

    let query =
        db.collection("games").where(
            "isDeleted", "==", false,
        )
            .orderBy("createdAt", "desc");

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
            },);


    } catch (error) {
        return sendErrorMessage(
            {
                res,
                message: "Something went wrong",
                status: 500,
            });

    }
}