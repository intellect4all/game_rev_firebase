import {Request, Response} from "express";
import {sendData, sendErrorMessage} from "../configs/route_utils";
import {db} from "../../../admin";
import {validateOtp} from "./validate_otp";


export async function emailOtpValidation(req: Request, res: Response,) {
  let email = req.body.email;
  const code = req.body.code;
  const id = req.body.id;

  const otpValidationRes = await validateOtp(email, code, id, "user");
  if (typeof otpValidationRes === "string") {
    return sendErrorMessage({res, message: otpValidationRes, status: 400});
  }

  email = email.trim().toLowerCase();

  const snapshot = await db.collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

  // check if user already exists
  if (snapshot.empty) {
    return sendErrorMessage({
      res: res,
      data: undefined,
      message: "User does not exist",
    });
  }

  const userDoc = snapshot.docs[0];

  await userDoc.ref.update({isVerified: true});


  return sendData({
    res,
    message: "Email successfully verified",
  });
}