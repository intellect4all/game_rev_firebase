import {admin, db} from "../../../admin";

export async function validateOtp(
    email: string, code: string, id: string, accountType: string,
) {
  if (!email || !code || !id) {
    let message = "";
    if (!email) {
      message = "Email is required";
    }
    if (!code) {
      message = "No OTP code provided";
    }
    if (!id) {
      message = "No OTP id provided";
    }
    return message;
  }
  

  const otpData = await db.collection(`configs/otp/${accountType}`).doc(id).get();
  
  if (!otpData.exists) {
    return "Invalid Id. Please request for a new OTP";
  }

  if (otpData.get("code") !== code) {
    return "Invalid code";
  }

  if (otpData.get("confirmed")) {
    return "Code has already been used.";
  }

  const at = otpData.get("createdAt");

  const now = admin.firestore.Timestamp.now();

  const diff = now.seconds - at.seconds;

  const tenMins = 10 * 60;

  if (diff > tenMins) {
    return "Code expired.";
  }

  await otpData.ref.update({confirmed: true});
  return true;
}

