import {Request, Response} from "express";
import {isVerifiedAdmin} from "../../admin/admin_helper";
import {admin, db} from "../../../../admin";
import {sendData, sendErrorMessage} from "../../configs/route_utils";
import {Validator} from "../../configs/validation";
import { TextHelper } from "../../../../helpers/text_helper";


// eslint-disable-next-line require-jsdoc
export async function addGenre(req: Request, res: Response) {
  const isAdminVerified = await isVerifiedAdmin(req, res);

  if (typeof isAdminVerified == "boolean") {
    // return because error message has been sent to user
    return;
  }

  if (!req.body.genreTitle) {
    const message = "Genre Title is compulsory";
    return sendErrorMessage({
      res: res,
      message: message,
      status: 400,
    }
    );
  }

  const addGenreReq = req.body as AddGenreDTO;
  
  const validateOrErrorMssg = Validator.validateAddGenreReq(addGenreReq);

  if (typeof validateOrErrorMssg == "string") {
    
    return sendErrorMessage({
      res: res,
      message: validateOrErrorMssg,
      status: 400,
    }
    );
  }
  const genreSlug = TextHelper.convertToSlug(addGenreReq.title);

  const genresPath = "genres";
  const genreData = await db.doc(`${genresPath}/${genreSlug}`).get();
  if (genreData.exists) {
    return sendErrorMessage({
      res: res,
      message: "Genre already existed",
      status: 400,
    }
    );
  }

  await db.collection(genresPath).doc(genreSlug).set({
    ...addGenreReq,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    creator: isAdminVerified.id,
  });
  return sendData({
    res,
    message: "Genre created successfully",
    data: {
      "title": addGenreReq.title,
      "slug": genreSlug,
      "active": false,
    },
  });
}

