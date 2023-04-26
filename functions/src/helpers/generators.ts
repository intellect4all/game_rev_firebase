/**
 * Generate a 6 digit OTP code
 *
 */

// eslint-disable-next-line require-jsdoc
export function generateOtpCode() {
  return Math.random()
      .toString()
      .replace(".", "")
      .replace(/^0+/, "")
      .substring(0, 6);
}


