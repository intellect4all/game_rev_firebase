

export type AddGameDTO = {
    title: string;
    description: string;
    releaseyear: string;
    developer: string;
    publisher: string;
    poster : string;
    genreSlugs: string[];
    status : 'published' | 'unpublished' | 'deleted';
}