import express, {Router} from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {registerAdminAppApi} from "./register_admin_api";
import { registerAppApi } from "./register_user_api";


// eslint-disable-next-line require-jsdoc
const app = express();

// eslint-disable-next-line require-jsdoc
export function registerV1Api() {
  
  app.use(cors({origin: true}));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));


  // eslint-disable-next-line new-cap
  const adminRouter = Router();
  // eslint-disable-next-line new-cap
  const userRouter = Router();

  registerAppApi(userRouter);
  registerAdminAppApi(adminRouter);

  // set prefix
  app.use("/admin", adminRouter);
  app.use("/", userRouter);
  
  return app;
}


