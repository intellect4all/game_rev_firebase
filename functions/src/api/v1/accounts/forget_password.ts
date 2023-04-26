import {Request, Response} from "express";
import {sendData, sendErrorMessage} from "../configs/route_utils";
import {Validator} from "../configs/validation";
import {admin, db} from "../../../admin";
import {generateOtpCode} from "../../../helpers/generators";

// eslint-disable-next-line require-jsdoc
export async function forgetPassword(req: Request, res: Response) {
  if (!req.body.email) {
    return sendErrorMessage({res, message: "Email is required"});
  }
  const email = req.body.email.trim().toLowerCase();
  const isValidated = Validator.validateEmail(email);
  if (typeof isValidated === "string") {
    return sendErrorMessage({res, message: "Invalid email"});
  }
  const userSnapshot = await db.collection("users")
      .where("email", "==", email,)
      .limit(1)
      .get();

  if (userSnapshot.empty) {
    return sendErrorMessage({res, message: "User not found"});
  }
  const user = userSnapshot.docs[0];
  if (user.get("deletedAt")) {
    return sendErrorMessage({
      res,
      message: "Account has been marked for deletion",
    });
  }

  const code = generateOtpCode();

  const res1 = await db.collection("configs/otp/user").add({
    email,
    code,
    type: "password_reset",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return sendData({res: res, data: {id: res1.id}, message: "success"});
}


