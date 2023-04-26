import {Request, Response} from "express";
import {sendData, sendErrorMessage} from "../../configs/route_utils";
import {db} from "../../../../admin";
import { isVerifiedAdmin } from "../../admin/admin_helper";


// eslint-disable-next-line require-jsdoc
export async function deleteGenre(req: Request, res: Response) {
  const isAdminVerified = await isVerifiedAdmin(req, res);

  if (typeof isAdminVerified == "boolean") {
    // return because error message has been sent to user
    return;
  }

  let genreSlug = req.params.slug;

  if (!genreSlug) {
    const message = "Genre Slug is required";
    return sendErrorMessage({
      res: res,
      data: undefined,
      message: message,
      status: 400,
    }
    );
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

  // delete genre
  await db.doc(`genres/${genreSlug}`).delete();

//TODO:  we might want queue up the removal of this genre from all games

  return sendData({
    res: res,
    message: "Genre deleted successfully",
  });
}
