import {Request, Response} from "express";
import {Validator} from "../configs/validation";
import {getUserById} from "./get_user_by_email";
import {sendData, sendErrorMessage} from "../configs/route_utils";

// eslint-disable-next-line require-jsdoc
export async function getUserProfile(req: Request, res: Response) {
  const decoded = await Validator.validToken(req, res);
  if (decoded === undefined) return;

  const user = await getUserById(decoded.uid);
  if (user === undefined) {
    return sendErrorMessage({res, message: "User not found", status: 404});
  }

  return sendData({res, message: "User profile", data: user});
}
