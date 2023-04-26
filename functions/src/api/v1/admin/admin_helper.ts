import {db} from "../../../admin";
import {sendErrorMessage} from "../configs/route_utils";
import {Request, Response} from "express";
import {Validator} from "../configs/validation";
import {firestore} from "firebase-admin";
import DocumentData = firestore.DocumentData;

// eslint-disable-next-line require-jsdoc,max-len
async function isVerifiedAdmin(req: Request, res: Response, checkIfSuperAdmin = false)
    : Promise<false | DocumentData> {
  const decoded = await Validator.validToken(req, res);
  if (decoded === undefined) return false;


  const adminData = await db.doc(`admins/${decoded.uid}`).get();


  if (adminData.exists) {
    // if it is super admin, then no need to verify status
    if (adminData.get("type") === "super-admin") {
      return {
        id: adminData.id,
        ...adminData.data(),
      };
    }

    // eslint-disable-next-line max-len
    if (!checkIfSuperAdmin && (adminData.get("status") === "active") && adminData.get("verified")) {
      return {
        id: adminData.id,
        ...adminData.data(),
      };
    }
  }

  await sendErrorMessage({
    res: res,
    data: undefined,
    message: "Unauthorized to perform operation",
    status: 400,
  });
  return false;
}

export {isVerifiedAdmin};
