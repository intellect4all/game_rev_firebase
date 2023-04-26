// eslint-disable-next-line @typescript-eslint/no-var-requires
import { sendErrorMessage } from "./route_utils";
import { Request, Response } from "express";
import { admin, functions } from "../../../admin";
import Joi from "joi";
import { validateOtp } from "../accounts/validate_otp";
import { AddGameDTO } from "../dtos/add_game_dto";
import { AddReviewDTO } from "../dtos/add_review_dto";
// 

// eslint-disable-next-line require-jsdoc
export class Validator {
  static validateAddReview(addReviewReq: AddReviewDTO) {
    const schema = Joi.object({
      gameId: Joi.string().min(3).required(),
      review: Joi.string().min(3).max(500).required(),
      rating: Joi.number().min(1).max(5).required(),
      origin: this._getLocationSchema(),
    });

    const { error } = schema.validate(addReviewReq);
    if (error) {
      return error.details[0].message;
    }

    return true;
  }
  static async validateGameData(data: AddGameDTO) {
    const schema = Joi.object({
      title: Joi.string().min(3).max(30).required(),
      description: Joi.string().min(5).max(200).required(),
      releaseYear: Joi.number().min(4).max(4).required(),
      developer: Joi.string().min(3).max(30).required(),
      publisher: Joi.string().min(3).max(30).required(),
      poster: Joi.string().uri().default(""),
      genres: Joi.array().items(Joi.string().min(3).max(30).required(),
      ).min(1).required(),
    });

    const { error } = schema.validate(data);
    if (error) {
      return error.details[0].message;
    }

    return true;
  }


  static async validateAddGenreReq(addGenreReq: AddGenreDTO) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      description: Joi.string().min(5).max(140).required(),
    });

    const { error } = schema.validate(addGenreReq);

    if (error) {
      return error.details[0].message;
    }

    return true;
  }
  // eslint-disable-next-line require-jsdoc
  static async checkLoginParams(req: Request, res: Response) {
    let { email, password } = req.body;
    if (!email || !password) {
      let message = "Missing required fields";
      if (!email) {
        message = "Email is required";
      }
      if (!password) {
        message = "Password is required";
      }
      return sendErrorMessage({ res, message, status: 400 });
    }

    email = email.trim().toLowerCase();

    const isValidated = Validator.validateLoginData(email, password,);

    if (typeof isValidated === "string") {
      return sendErrorMessage({
        res: res,
        data: undefined,
        message: "Invalid Login Credentials",
        status: 400,
      });
    }

    return { email, password };
  }


  static async checkResetPasswordParams(req: Request, res: Response, type: string) {
    const email = req.body.email;
    const code = req.body.code;
    const id = req.body.id;
    const password = req.body.password;

    const validatePassword = Validator.validatePassword(password);
    if (typeof validatePassword === "string") {
      return sendErrorMessage({ res, message: validatePassword });
    }

    const otpValidationRes = await validateOtp(email, code, id, type);
    if (typeof otpValidationRes === "string") {
      return sendErrorMessage({
        res, message: otpValidationRes,
        status: 400,
      });
    }

    return { email, password };
  }


  static validatePassword(password: string): boolean | string {
    const schema = Joi.string().min(8).max(30)
      .required();
    const { error } = schema.validate(password);
    if (error) {
      return error.details[0].message;
    }
    return true;
  }



  static validateRegistrationData(data: any) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(30)
        .required(),
      username: Joi.string().min(3).required(),
      role: Joi.string().default("user").valid("admin", "user"),
      firstName: Joi.string().min(2).max(30).required(),
      lastName: Joi.string().min(2).max(30).required(),
      phone: Joi.string().min(3).required(),
      location: this._getLocationSchema(),

    });
    const { error } = schema.validate(data);
    if (error) {
      return error.details[0].message;
    }

    return true;

  }


  static async validToken(req: Request, res: Response) {
    let token;
    try {
      const headers = req.headers;
      token = (headers["authorization"] as string).substring(7);
    } catch (e) {
      return sendErrorMessage({ res, message: "Auth is required", status: 401 });
    }

    try {
      return (await admin.auth().verifyIdToken(token));
    } catch (e) {
      functions.logger.log(e);
      // eslint-disable-next-line max-len
      return sendErrorMessage({ res, message: "Invalid auth token", status: 401 });
    }
  }


  static validateLoginData(email: string, password: string) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(30)
        .required(),
    });
    const { error } = schema.validate({ email, password });
    if (error) {
      return error.details[0].message;
    }
    return true;
  }


  static validateEmail(email: string) {
    const schema = Joi.string().email().required();
    const { error } = schema.validate(email.trim().toLowerCase());
    if (error) {
      return error.details[0].message;
    }

    return true;
  }


  static validateEmptyString(string: string) {
    const schema = Joi.string().required();
    const { error } = schema.validate(string);
    if (error) {
      return error.details[0].message;
    }

    return true
  }

  static _getLocationSchema() {
    return Joi.object(
      {
        city: Joi.string().required(),
        country: Joi.string().required(),
        countryCode: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
      }
    );
  }

}