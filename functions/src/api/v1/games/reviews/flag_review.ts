import { admin, db } from "../../../../admin";
import { isVerifiedAdmin } from "../../admin/admin_helper";
import { sendData, sendErrorMessage } from "../../configs/route_utils";
import { Request, Response } from "express";
import { Validator } from "../../configs/validation";


export async function flagReview(req: Request, res: Response) {
    const decoded = await Validator.validToken(req, res);

    if (decoded === undefined) return;

    const reviewId = req.params.reviewId;

    const flagReviewReq = req.body as FlagReviewDto;

    const flagReviewDtoOrError = Validator.validateFlaggedReviewDto(flagReviewReq);

    if (typeof flagReviewDtoOrError === "string") {
        return sendErrorMessage(
            {
                res,
                message: flagReviewDtoOrError,
                status: 400,
            });
    }

    try {
        const review = await db.collection("reviews").doc(reviewId).get();

        if (!review.exists) {
            return sendErrorMessage(
                {
                    res,
                    message: "Review not found",
                    status: 404,
                });
        }

        await db.runTransaction(async (transaction) => {
            transaction.update(db.collection("reviews").doc(reviewId), {
                isFlagged: true,
            });

            const flaggedRef = db.collection("flaggedReviews").doc(reviewId);

            const flaggedReport = await transaction.get(flaggedRef)

            if (!flaggedReport.exists) {
                transaction.set(flaggedRef, {
                    reviewId,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    issuesCount: admin.firestore.FieldValue.increment(1),
                
                });

                transaction.set(db.collection("flaggedReviews").doc(reviewId).collection("issues").doc(), {
                    ...flagReviewReq,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    status: "pending",
                });
            }
            else {
                transaction.update(flaggedRef, {
                    issuesCount: admin.firestore.FieldValue.increment(1),
                });

                transaction.set(db.collection("flaggedReviews").doc(reviewId).collection("issues").doc(), {
                    ...flagReviewReq,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    status: "pending",
                });
            }
        });

        return sendData(
            {
                res,
                message: "Success",
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