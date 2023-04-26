
import {Request, Response} from "express";
import {db} from "../../../../admin";
import {sendData} from "../../configs/route_utils";
import { Validator } from "../../configs/validation";


// eslint-disable-next-line require-jsdoc
export async function getAllGenres(req: Request, res: Response) {
  const decoded = await Validator.validToken(req, res);

  if (decoded === undefined) return;

  const genresQuery = await db.collection("genres").get();
  const genres: FirebaseFirestore.DocumentData[] = [];
  genresQuery.forEach(
      (genreDoc) => {
        genres.push({...genreDoc.data(), id: genreDoc.id});
      }
  );

  return sendData(
      {
        res,
        message: "Success",
        data: genres,
      }
  );
}
