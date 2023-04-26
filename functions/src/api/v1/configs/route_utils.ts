
import { SendErrorParams } from "../params/send_error_params";
import { SendDataParams } from "../params/send_data_params";


export function sendErrorMessage(
  errorParams: SendErrorParams,
) {
   errorParams.res.status(errorParams.status || 500).json({
    message: errorParams.message,
    data: errorParams.data,
    statusCode: errorParams.status || 500,
  });
  return undefined;
}


export function sendData<T>(
  sendDataParams: SendDataParams<T>,
) {
   sendDataParams.res.status(200).json({
    message: sendDataParams.message || "Success",
    data: sendDataParams.data || {},
    statusCode: 200,
  });
}

