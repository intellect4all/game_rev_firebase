import {Request, Response} from "express";
import {sendData, sendErrorMessage} from "../../configs/route_utils";
import {admin, db} from "../../../../admin";
import {firestore} from "firebase-admin";

import {Validator} from "../../configs/validation";
import DocumentData = firestore.DocumentData;
import { isVerifiedAdmin } from "../../admin/admin_helper";


// eslint-disable-next-line require-jsdoc
export async function editGenre(req: Request, res: Response) {
    let genreSlug = req.params.slug;
  let {active, genreTitle} = req.body;

  if (!genreSlug) {
    
    return sendErrorMessage({
      res: res,
      data: undefined,
      message: "Genre Slug is required",
      status: 400,
    }
    );
  }

  if (genreTitle) {
    const genreTitleOrError = Validator.validateEmptyString(genreTitle);

    if (typeof genreTitleOrError == "string") {
      return sendErrorMessage({
        res: res,
        message: "Genre Title must be a string greater than 3",
        status: 400,
      }
      );
    }
  }

  const isAdminVerified = await isVerifiedAdmin(req, res);

  if (typeof isAdminVerified == "boolean") {
    // return because error message has been sent to user
    return;
  }

  const genreData = await db.doc(`genres/${genreSlug}`).get();
  if (!genreData.exists) {
    return sendErrorMessage({
      res: res,
      data: undefined,
      message: "Genre does not exist",
      status: 400,
    }
    );
  }

  const genre = genreData.data() as DocumentData;
  if (genre.genreTitle == genreTitle && genre.active == active) {
    return sendErrorMessage({
      res: res,
      message: "No changes made.",
      status: 400,
    }
    );
  }
  active = typeof active == "boolean" ? active : genre.active;

  await db.doc(`genres/${genreSlug}`).update({
    "title": genreTitle || genre.genreTitle,
    "active": active,
    "lastUpdated": admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return sendData({
    res,
    message: "Genre updated successfully",
    data: {
      "title": genreTitle,
      "active": active,
    },
  });
}
