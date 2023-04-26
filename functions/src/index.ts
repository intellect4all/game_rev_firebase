
import {functions} from "./admin";
import { registerV1Api } from "./api/v1/register_v1_api";


module.exports = {
  api: {
    v1: functions.https.onRequest(registerV1Api()),
  },

//   sendOtp,
};
