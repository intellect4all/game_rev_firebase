import Joi from "joi";
import { isVerifiedAdmin } from "../admin/admin_helper";
import { Request, Response } from "express";
import { sendData, sendErrorMessage } from "../configs/route_utils";
import { admin } from "../../../admin";

export async function editGame(req: Request, res: Response) {
    const isAdminVerified = await isVerifiedAdmin(req, res);

    if (typeof isAdminVerified == "boolean") {
        // return because error message has been sent to user
        return;
    }

    let gameId = req.params.id;

    const { error } = Joi.string().min(3).required().validate(gameId);

    if (error) {
        const message = "Game Id is required";
        return sendErrorMessage({
            res: res,
            message: message,
            status: 400,
        }
        );

    }

    const { title, description, releaseYear, developer, publisher, poster, genres, } = req.body;

    if (!title && !description && !releaseYear && !developer && !publisher && !poster && !genres) {
        const message = "At least one field is required";
        return sendErrorMessage({
            res: res,
            message: message,
            status: 400,
        });
    }

    const newData = new Map<string, string | number | string[]>();

    let fieldVlaidationMap = new Map<string, Joi.Schema>();

    fieldVlaidationMap.set("title", Joi.string().min(3).max(30));
    fieldVlaidationMap.set("description", Joi.string().min(5).max(200).required());
    fieldVlaidationMap.set("releaseYear", Joi.number().min(4).max(4).required());
    fieldVlaidationMap.set("developer", Joi.string().min(3).max(30).required());
    fieldVlaidationMap.set("publisher", Joi.string().min(3).max(30).required());
    fieldVlaidationMap.set("poster", Joi.string().uri().default(""));
    fieldVlaidationMap.set("genres", Joi.array().items(Joi.object({
        title: Joi.string().min(3).max(30).required(),
        slug: Joi.string().min(3).max(30).required(),
    })));


    for (let i = 0; i < fieldVlaidationMap.size; i++) {

        const key = fieldVlaidationMap.keys().next().value;
        const value = fieldVlaidationMap.get(key);

        if (req.body[key]) {
            const { error } = value!.validate(req.body[key]);
            if (error) {
                const message = error.details[0].message;
                return sendErrorMessage({
                    res: res,
                    message: message,
                    status: 400,
                }
                );
            }
            newData.set(key, req.body[key]);
        }
        fieldVlaidationMap.delete(key);
    }

    if (newData.get("title")) {
        const titleArray = newData.get("title")!.toString()
            .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, "").toLowerCase()
            .split(" ");
        newData.set("_titleArray", titleArray);
    }


    try {
        await admin.firestore().collection("games").doc(gameId).update({
            ...Object.fromEntries(newData),
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
        return sendErrorMessage({
            res: res,
            message: "Something went wrong",
            status: 500,
        });

    }

    return sendData({
        res: res,
        message: "Game updated successfully",
    });



}