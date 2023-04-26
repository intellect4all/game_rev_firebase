import slugify from "slugify";

// eslint-disable-next-line require-jsdoc
export class TextHelper {
  // eslint-disable-next-line require-jsdoc
  static convertToSlug(text: string) {
    return slugify(text.trim().toLowerCase());
  }
}
