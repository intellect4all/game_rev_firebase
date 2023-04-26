import { UserLocation } from "./location";

export type AddReviewDTO = {
    gameId: string;
    rating: number;
    review: string;
    origin: UserLocation;
}


