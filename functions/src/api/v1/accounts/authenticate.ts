import {Request, Response} from "express";
import {sendData, sendErrorMessage} from "../configs/route_utils";
import {admin, db, functions} from "../../../admin";
import * as bcrypt from "bcrypt";
import {Validator} from "../configs/validation";

export async function authenitcate (req: Request, res: Response) {
  const checkLoginParams = await Validator.checkLoginParams(req, res);

  if (checkLoginParams === undefined) return;

  const {email, password} = checkLoginParams;

  const snapshot = await db.collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();
  if (snapshot.empty) {
    return sendErrorMessage({
      res,
      message: "No User found",
      status: 401,
    });
  }
  const user = snapshot.docs[0];

  const passwords = await db.collection(`user_private/${user.id}/passwords`)
      .orderBy("createdAt", "desc")
      .where("active", "==", true)
      .limit(1)
      .get();

  if (passwords.empty) {
    return sendErrorMessage({
      res,
      message: "User has no active password",
      status: 401,
    });
  }
  const value = passwords.docs[0].get("value");
  const isMatch = await bcrypt.compare(password, value);

  if (!isMatch) {
    return sendErrorMessage({
      res: res,
      message: "Incorrect Login Credentials",
      status: 401,
    });
  }
  if (user.get("deletedAt")) {
    return sendErrorMessage({
      res,
      message: "Your account has been marked for deletion. Contact support.",
    });
  }

  let token;
  try {
    token = await admin.auth().createCustomToken(user.id);
  } catch (e) {
    functions.logger.log(e);

    return sendErrorMessage({
      res,
      message: "An internal error occurred. Please try again later.",
      status: 500,
    });
  }
  await passwords.docs[0].ref.update({
    lastUsed: admin.firestore.FieldValue.serverTimestamp(),
  });


  return sendData({
    res, message: "Login successful",
    data: {
      token,
      "user": user.data(),
    },
  });
};

