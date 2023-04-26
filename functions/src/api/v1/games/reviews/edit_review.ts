import { Request, Response } from "express";
import { Validator } from "../../configs/validation";
import { sendData, sendErrorMessage } from "../../configs/route_utils";
import { admin, db } from "../../../../admin";
import Joi from "joi";

export async function editReview(req: Request, res: Response){
    const decoded = await Validator.validToken(req, res);

    if (decoded === undefined) return;

    let reviewId = req.params.id;

    if (!reviewId) {
        return sendErrorMessage({
            res: res,
            data: undefined,
            message: "Review Id is required",
            status: 400,
        });
    }

    const review = await db.collection("reviews").doc(reviewId).get();

    if (!review.exists) {
        return sendErrorMessage({
            res: res,
            message: "Review does not exist",
            status: 400,
        });
    }

    const reviewData = review.data();

    if (reviewData?.userId !== decoded.uid) {
        return sendErrorMessage({
            res: res,
            message: "You are not authorized to edit this review",
            status: 401,
        });
    }

    const newData = new Map<string, string | number | string[]>();

    if (req.body.rating) {
        const { error } = Joi.number().min(1).max(5).required().validate(req.body.rating);

        if (error) {
            return sendErrorMessage({
                res: res,
                message: "Rating must be between 0 and 5",
                status: 400,
            });
        }

        newData.set("rating", req.body.rating);
    }

    if (req.body.review) {
        const { error } = Joi.string().min(3).max(500).required().validate(req.body.review);

        if (error) {
            return sendErrorMessage({
                res: res,
                message: "Review must be between 3 and 500 characters",
                status: 400,
            });
        }

        newData.set("review", req.body.review);
    }
    
    if (newData.size === 0) {
        return sendErrorMessage({
            res: res,
            message: "Nothing to update",
            status: 400,
        });
    }

    try {
        await db.collection("reviews").doc(reviewId).update({
            ...Object.fromEntries(newData),
            isEdited: true,
            lastEdited: admin.firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
        return sendErrorMessage({
            res: res,
            message: "Something went wrong",
            status: 400,
        });
    }

    return sendData({
        res,
        message: "Success",
    }
    )
}