import {Request, Response} from "express";
import {Validator} from "../configs/validation";
import {sendData, sendErrorMessage} from "../configs/route_utils";
import {admin, db} from "../../../admin";
import * as bcrypt from "bcrypt";

// eslint-disable-next-line require-jsdoc
async function changePassword(req: Request, res: Response) {
  const decoded = await Validator.validToken(req, res);

  if (decoded === undefined) return;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  if (!oldPassword || !newPassword) {
    let message = "New password is required";
    if (!oldPassword) {
      message = "Old password is required";
    }

    return sendErrorMessage({res, message, status: 400});
  }

  const isValidated = Validator.validatePassword(newPassword);
  if (typeof isValidated === "string") {
    return sendErrorMessage({
      res,
      message: "Invalid Password",
      status: 400,
    });
  }

  const userId = decoded.uid;

  // validate old password
  const passwords = await db.collection(`user_private/${userId}/passwords`)
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

  const isOldPasswordValid = await bcrypt.compare(oldPassword, passwords.docs[0]
      .get("value"));

  if (!isOldPasswordValid) {
    return sendErrorMessage({
      res,
      message: "Invalid old password",
      status: 401,
    });
  }

  // disable old password
  await passwords.docs[0].ref.update({active: false});

  // create new password
  await db.collection(`user_private/${userId}/passwords`).add({
    value: await bcrypt.hash(newPassword, 10),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastUsed: admin.firestore.FieldValue.serverTimestamp(),
    active: true,
  });

  return sendData({res, data: {message: "Password changed successfully"}});
}

export {changePassword};
