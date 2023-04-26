import {Validator} from "../configs/validation";
import {Request, Response} from "express";
import {sendData, sendErrorMessage} from "../configs/route_utils";
import {db} from "../../../admin";
import {validateOtp} from "./validate_otp";

// eslint-disable-next-line require-jsdoc
export async function confirmChangeEmail(req: Request, res: Response) {
  const decoded = await Validator.validToken(req, res);
  if (decoded === undefined) return;
  const {code, otpId, newEmail} = req.body;

  // validate the OTP
  const otpValidationRes = await validateOtp(newEmail, code, otpId, "user");

  if (typeof otpValidationRes == "string") {
    return sendErrorMessage({
      res, message: "Invalid email",
      status: 401,
    });
  }

  // check if no user with email in db
  const existingUser = await db.collection("users")
      .where("email", "==", newEmail)
      .limit(1).get();

  if (!existingUser.empty) {
    return sendErrorMessage({res, message: "Email exists", status: 401},);
  }

  try {
    const userRef = db.collection("users").doc(decoded.uid);
    await userRef.update({email: newEmail});
    const user = await userRef.get();
    return sendData(
        {
          res,
          message: "Email successfully changed",
          data: {
            user: user.data(),
          },
        },
    );
  } catch (_) {
    return sendErrorMessage({
      res, message: "Error updating email",
      status: 500,
    });
  }
}
