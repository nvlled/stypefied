
export function user(username: string): string {
    return `/user?id=${username}`;
}

export function item(id: number): string {
    return `/item?id=${id}`;
}

export function hideItem(id: number): string {
    return `/hide?id=${id}`;
}
