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

  static addAdmin = "/new";
  static getAllAdmins = "/my-admins";
  static adminSignUp = "/new/sign-up";
  static changeAdminAccountStatus = "/change-admin-account-status";
  static adminLogin = "/login";
  static forgotPasswordAdmin = "/forgot-password";
  static resendOtpAdmin = "/resend-otp";
  static resetPasswordAdmin = "/reset-password";
  static getAdminMovieData = "/movie-details";
  static sendNotification = "/send-notification";
  static getNotifications = "/get-notifications";


  // movies
  static addMovie = "/movie/add";
  static addEpisodes = "/movie/add-episodes";
  static editMovie = "/movie/edit";
  static editEpisode = "/movie/edit-episode";
  static getAllMovies = "/movie/all";


  // vod
  static getHomeVideos = "/vod/home-videos";
  static getMoreMovies = "/vod/get-more-movies";
  static getMovieDetails = "/vod/movie-details";
  static addToFavourites = "/vod/favourites/add";
  static addToWatchlist = "/vod/watchlist/add";
  static getFavourites = "/vod/favourites";
  static getWatchlist = "/vod/watchlist";
  static removeFromFavourites = "/vod/favourites/remove";
  static removeFromWatchlist = "/vod/watchlist/remove";
  static addComment = "/vod/comment/add";
  static getComments = "/vod/movie-comments";
  static updateWatchHistory = "/vod/update-watch-history";
  static getWatchHistory = "/vod/watch-history";
  static getHomePageTopSection = "/vod/home-page-top-section";
  static searchMovies = "/vod/search";


  static getEpgForDate = "/epg-for-date";
  static addSubscription = "/add-subscription-plan";
  static deleteSubscription = "/delete-subscription-plan";
  static getSubscriptionPlans = "/subscription-plans";
  static getSubscriptionPlansUser = "/subscription/plans";
  static getCurrentSubscription = "/subscription/current-subscription";
  static initializeCharge = "/subscription/initialize-charge";
  static addLandingPageItem = "/landingPageItems/add";
  static deleteLandingPageItem = "/landingPageItems/delete";
  static getLandingPageItems = "/landingPageItems";
  static getDashboardData = "/dashboard-data";
  static getArchivedMovies = "/movie/archive";
    
}


