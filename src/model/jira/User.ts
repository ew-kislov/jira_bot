export interface User {
    name: string;
    key: string;
}

export function transformUsersResponse(usersRaw: any[]): User[] {
    return usersRaw.map((userRaw) => transformUserResponse(userRaw));
}


export function transformUserResponse(userRaw: any) {
    return {
        name: userRaw.displayName,
        key: userRaw.key
    };
}
