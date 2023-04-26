import {sendData, sendErrorMessage} from "../configs/route_utils";
import {Request, Response} from "express";
import {admin, db} from "../../../admin";
import * as bcrypt from "bcrypt";
import {Validator} from "../configs/validation";


// eslint-disable-next-line require-jsdoc
async function resetPassword(req: Request, res: Response) {
  // eslint-disable-next-line max-len
  const checkResetPasswordParams = await Validator.checkResetPasswordParams(req, res, "user");

  if (checkResetPasswordParams === undefined) return;

  const userSnapshot = await db.collection("users")
      .where("email", "==", checkResetPasswordParams.email)
      .limit(1).get();

  if (userSnapshot.empty) {
    return sendErrorMessage({
      res: res,
      data: undefined,
      message: "User does not exist",
    });
  }

  const userDoc = userSnapshot.docs[0];

  // disable all active passwords
  await db.collection(`user_private/${userDoc.id}/passwords`)
      .where("active", "==", true)
      .get().then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.update({active: false});
        });
      }
      );


  // create password hash
  await db.collection(`user_private/${userDoc.id}/passwords`).add({
    value: await bcrypt.hash(checkResetPasswordParams.password, 10),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastUsed: admin.firestore.FieldValue.serverTimestamp(),
    active: true,
  });

  return sendData({
    res, message: "Password successfully reset",
  });
}

export {resetPassword};
