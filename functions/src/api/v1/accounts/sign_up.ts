import {sendData, sendErrorMessage} from "../configs/route_utils";
import {admin, db, functions} from "../../../admin";
import {Request, Response} from "express";
import {SignUpDTO} from "../dtos/sign_up_dto";
import {generateOtpCode} from "../../../helpers/generators";
import {Validator} from "../configs/validation";
import * as bcrypt from "bcrypt";


export async function signUp(req: Request, res: Response) {
  if (!req.body.email || !req.body.password || !req.body.fullName) {
    let message = "Missing required fields";
    if (!req.body.email) {
      message = "Email is required";
    }
    if (!req.body.password) {
      message = "Password is required";
    }
    if (!req.body.fullName) {
      message = "Full name is required";
    }
    return sendErrorMessage({
      res: res, data: undefined,
      message: message, status: 400,
    });
  }
  let signupReq = req.body as unknown as SignUpDTO;
  let email = signupReq.email.trim().toLowerCase();

  const snapshot = await db.collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

  // check if user already exists
  if (!snapshot.empty) {
    return sendErrorMessage({
      res: res,
      data: undefined,
      message: "Email already exists",
      status: 400,
    });
  }

  const isValidated = Validator.validateRegistrationData(req.body);
  if (typeof isValidated === "string") {
    return sendErrorMessage({
      res: res,
      data: undefined,
      message: isValidated,
      status: 400,
    });
  }



  const userDoc = await db.collection("users").add({
    "email": email,
    "username": signupReq.username,
    "password":signupReq.password,
    "firstName": signupReq.firstName,
    "lastName":signupReq.lastName,
    "phone": signupReq.phone,
    "location": {
      ...signupReq.location
    }
  });

  // increment user count
  await db.doc("configs/data").update({
    userCount: admin.firestore.FieldValue.increment(1),
  });

  let token;
  try {
    token = await admin.auth().createCustomToken(userDoc.id);
  } catch (e) {
    functions.logger.log(e);
    sendErrorMessage({
      res: res,
      message: "An internal error occurred. Please try again later.",
      status: 500,
    });
  }

  // create password hash
  await db.collection(`user_private/${userDoc.id}/passwords`).add({
    value: await bcrypt.hash(signupReq.password, 10),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastUsed: admin.firestore.FieldValue.serverTimestamp(),
    active: true,
  });

  // set user_private
  await db.doc(`user_private/${userDoc.id}`).set({
    "createdAt": admin.firestore.FieldValue.serverTimestamp(),
  });

  // generate OTP
  const code = generateOtpCode();

  const res1 = await db.collection("configs/otp/user").add({
    email,
    code,
    type: "register",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return sendData({
    res,
    message: `Account Created. An OTP token has been sent to ${email}`,
    data: {
      "id": res1.id,
      "token": token,
    },
  });
}
