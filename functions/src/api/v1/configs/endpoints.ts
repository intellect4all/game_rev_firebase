/**
 * Contains all the endpoints for the app.
 */
export class Endpoints {
  static account = "/account"
  static signup = `${Endpoints.account}/signup`;
  static emailVerification = "/account/email-verification";
  static authenticate = `${Endpoints.account}/authenticate`;
  static forgotPassword = "/account/forget-password";
  static resetPassword = "/account/reset-password";
  static changePassword = "/account/change-password";
  static changeEmail = "/account/change-email";
  static resendOtp = "/account/resend-otp";
  static deactivateDeviceToken = "/account/deactivate-device-token";
  static getUserProfile = "/account/profile";
  static confirmChangeEmail = "/account/confirm-change-email";
  static deleteAccount = "/account/delete";

  // genres
  static genres = "/genres";
  static genre = `${Endpoints.genres}/:slug`;
  
  // games
  static games = "/games";
  static game = `${Endpoints.games}/:id`;
  

  // admin
  static addGenre = "/add-genre";
  static getAllGenres = "/all-genres";
  static editGenre = "/edit-genre";
  static deleteGenre = "/delete-genre";
    

  // reviews
  static reviews = "/reviews";
  static review = `${Endpoints.reviews}/:id`;
  static reviewsForGame = "/game/:gameId/reviews";
  static reviewsForUser = "/user/:userId/reviews";
  static flaggedReviews = `${Endpoints.reviews}/flagged`;
  static flagReview = `${Endpoints.review}/:reviewId/flag`;
  static resolveFlaggedReview = `${Endpoints.review}/flagged/resolve`;
  



}


