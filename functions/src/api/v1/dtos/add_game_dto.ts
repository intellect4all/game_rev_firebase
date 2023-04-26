export type AddGameDTO = {
    title: string;
    description: string;
    releaseyear: string;
    developer: string;
    publisher: string;
    poster : string;
    genres: GameGenre[];
    status : 'published' | 'unpublished' | 'deleted';

}

export type GameGenre = {
    title: string;
    slug: string;
}