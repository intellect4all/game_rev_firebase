import { db } from "../../../../admin";
import { getCountFromQuery } from "../../../../helpers/request_params_helper";
import { isVerifiedAdmin } from "../../admin/admin_helper";
import { sendData, sendErrorMessage } from "../../configs/route_utils";
import { Validator } from "../../configs/validation";
import { Request, Response } from "express";

export async function deleteReview(req: Request, res: Response) {
    const decoded = await Validator.validToken(req, res);

    if (decoded === undefined) return;

    const reviewId = req.params.reviewId;

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

        const userId = review.data()?.userId;

        const isAdmin = await isVerifiedAdmin(req, res, false, false)

        if (userId !== decoded.uid && !isAdmin) {
            return sendErrorMessage(
                {
                    res,
                    message: "Unauthorized",
                    status: 401,
                });
        }

        await db.collection("reviews").doc(req.params.reviewId).update({
            isDeleted: true,
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