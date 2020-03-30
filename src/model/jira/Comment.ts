import { transformUserResponse, User } from './User';

export interface Comment {
    author: User;
    text: string;
    creationDate: Date;
}

export function transformCommentsResponse(commentsRaw: any[]) {
    return commentsRaw.map((commentRaw) => ({
        author: transformUserResponse(commentRaw.author),
        text: commentRaw.body.length > 120 ? commentRaw.body.substr(0, 120) + '...' : commentRaw.body.trim(),
        creationDate: new Date(commentRaw.created)
    }));
}
