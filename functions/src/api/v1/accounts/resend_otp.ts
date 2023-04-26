import {Request, Response} from "express";
import {sendData, sendErrorMessage} from "../configs/route_utils";
import {getUserByEmail} from "./get_user_by_email";
import {admin, db} from "../../../admin";
import {generateOtpCode} from "../../../helpers/generators";

// eslint-disable-next-line require-jsdoc
async function resendOtp(req: Request, res: Response, accountType: string) {
  const {email, type} = req.body;
  let message = "";
  if (!email) {
    message = "Email is required";
  }
  if (!type) {
    message = "Type is required";
  }
  if (message) {
    return sendErrorMessage({res, message});
  }

  const user = await getUserByEmail(email, accountType);
  if (!user) {
    return sendErrorMessage({res, message: "User does not exist"});
  }

  // generate OTP
  const code = generateOtpCode();

  const res1 = await db.collection(`configs/otp/${accountType}`).add({
    email,
    code,
    type: type,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return sendData({
    res,
    message: `Otp sent to ${email}`,
    data: {
      "id": res1.id,
      "email": email,
    },
  });
}

export {resendOtp};
