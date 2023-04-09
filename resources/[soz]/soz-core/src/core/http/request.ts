export type Request = {
    method: string;
    path: string;
    headers: Record<string, string>;
    body: Promise<string>;
};
