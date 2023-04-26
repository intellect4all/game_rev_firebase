import { ParsedQs } from "qs";

type QueryParam = string | ParsedQs | string[] | ParsedQs[] | undefined;

export const getCountFromQuery = (limit: QueryParam ) => {
    let count = parseInt(limit?.toString().trim() || "");

    if (isNaN(count)) {
        count = 10;
    }

    if (count < 10 || count > 100) {
        count = 10;
    }

    return count;
}

export const getLastGameIdFromQuery = (lastGameId: QueryParam) => {
    if (lastGameId === undefined) return undefined;

    let lastGameIdString = lastGameId.toString().trim();

    if (lastGameIdString.length === 0) return undefined;


    return lastGameIdString;
}