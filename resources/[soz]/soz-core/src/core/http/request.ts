import { HTTPMethod } from '@egoist/router';

export type Request = {
    method: HTTPMethod;
    path: string;
    headers: Record<string, string>;
    body: Promise<string>;
};
