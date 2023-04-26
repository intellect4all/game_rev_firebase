import {Validator} from "../configs/validation";
import {Request, Response} from "express";
import {sendData, sendErrorMessage} from "../configs/route_utils";
import {getUserByEmail} from "./get_user_by_email";
import {generateOtpCode} from "../../../helpers/generators";
import {admin, db} from "../../../admin";

// eslint-disable-next-line require-jsdoc
export async function changeEmail(req: Request, res: Response) {
  const decoded = await Validator.validToken(req, res);

  if (decoded === undefined) return;
  const {newEmail} = req.body;

  const agent = await getUserByEmail(newEmail.trim().toLowerCase(), "user");

  if (agent != undefined) {
    return sendErrorMessage({res, message: "Email exists", status: 401},);
  }

  // generate OTP
  const code = generateOtpCode();

  const res1 = await db.collection("configs/otp/user").add({
    email: newEmail,
    code,
    type: "change_email",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });


  return sendData(
      {res, message: "Email change initiated", data: {otpId: res1.id}},
  );
}
