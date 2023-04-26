import { Router } from "express";
import { Endpoints } from "./configs/endpoints";
import { signUp } from "./accounts/sign_up";
import { authenitcate } from "./accounts/authenticate";
import { emailOtpValidation } from "./accounts/email_otp_validation";
import { resendOtp } from "./accounts/resend_otp";
import { forgetPassword } from "./accounts/forget_password";
import { getUserProfile } from "./accounts/get_user_profile";
import { resetPassword } from "./accounts/reset_password";
import { changeEmail } from "./accounts/change_email";
import { changePassword } from "./accounts/change_password";
import { confirmChangeEmail } from "./accounts/confirm_change_email";
import { addGenre } from "./games/genres/add_genre";
import { editGenre } from "./games/genres/edit_genre";
import { getAllGenres } from "./games/genres/get_all_genres";
import { getGenre } from "./games/genres/get_genre";
import { deleteGenre } from "./games/genres/delete_genre";
import { addGame } from "./games/add_game";
import { editGame } from "./games/edit_game";
import { getAllGames } from "./games/get_all_games";
import { getGame } from "./games/get_game";
import { deleteGame } from "./games/delete_game";
import { addReview } from "./games/reviews/add_review";
import { editReview } from "./games/reviews/edit_review";
import { getAllReviews } from "./games/reviews/get_all_reviews";
import { getAllReviewsForGame } from "./games/reviews/get_all_reviews_for_game";
import { getReviewsForUser } from "./games/reviews/get_reviews_for_user";
import { deleteReview } from "./games/reviews/delete_review";


export function registerAppApi(router: Router) {
    // accounts
    router.post(Endpoints.signup, signUp);
    router.post(Endpoints.authenticate, authenitcate)
    router.post(Endpoints.emailVerification, (req, res) => emailOtpValidation(req, res));
    router.post(Endpoints.resendOtp, (req, res) => resendOtp(req, res, "user"));
    router.post(Endpoints.forgotPassword, forgetPassword);
    router.post(Endpoints.resetPassword, resetPassword);
    router.post(Endpoints.changePassword, changePassword);
    router.post(Endpoints.changeEmail, changeEmail);
    router.post(Endpoints.confirmChangeEmail, confirmChangeEmail);
    router.get(Endpoints.getUserProfile, getUserProfile);

    // games genres
    router.post(Endpoints.genres, addGenre);
    router.put(Endpoints.genre, editGenre);
    router.get(Endpoints.genres, getAllGenres);
    router.get(Endpoints.genre, getGenre);
    router.delete(Endpoints.genre, deleteGenre);

    // games
    router.post(Endpoints.games, addGame);
    router.put(Endpoints.game, editGame);
    router.get(Endpoints.games, getAllGames);
    router.get(Endpoints.game, getGame);
    router.delete(Endpoints.game, deleteGame);

    // reviews
    router.post(Endpoints.reviews, addReview);
    router.put(Endpoints.review, editReview);
    router.get(Endpoints.reviews, getAllReviews);
    router.get(Endpoints.reviewsForGame, getAllReviewsForGame);
    router.get(Endpoints.reviewsForUser, getReviewsForUser);
    router.delete(Endpoints.review, deleteReview);
    router.get(Endpoints.flaggedReviews, getFlaggedReviews);
    router.put(Endpoints.flagReview, flagReview);
    router.put(Endpoints.unflagReview, unflagReview);


    




    

}

