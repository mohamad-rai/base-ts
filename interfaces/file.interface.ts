export enum FILE_MODEL {
    USER = 'user',
    PERSON_CARD = 'person-card',
}

export interface IFile {
    name: string;
    originalName: string;
    model: FILE_MODEL,
    path: string;
    type: string;
    owner: string;
    access?: string[];
}