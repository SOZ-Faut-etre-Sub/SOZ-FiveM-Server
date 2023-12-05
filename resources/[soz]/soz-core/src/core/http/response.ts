import { Header } from './common';

export class Response {
    private headers: Header[] = [];

    private body = '';

    private statusCode = 200;

    public constructor(statusCode = 200, body = '', headers: Header[] = []) {
        this.statusCode = statusCode;
        this.body = body;
        this.headers = headers;
    }

    public getHeadersForCfx(): Record<string, string> {
        const headers: Record<string, string> = {};

        for (const header of this.headers) {
            // @TODO handle multiple headers with the same name (join with , ?)
            headers[header.name] = header.value;
        }

        return headers;
    }

    public getBody(): string {
        return this.body;
    }

    public getStatusCode(): number {
        return this.statusCode;
    }

    public static ok(body = '', headers: Header[] = []): Response {
        return new Response(200, body, headers);
    }

    public static notFound(body = '', headers: Header[] = []): Response {
        return new Response(404, body, headers);
    }

    public static unauthorized(body = '', headers: Header[] = []): Response {
        return new Response(401, body, headers);
    }

    public static internalServerError(body = '', headers: Header[] = []): Response {
        return new Response(500, body, headers);
    }

    public static json(body: any, headers: Header[] = []): Response {
        headers.push({ name: 'Content-Type', value: 'application/json' });

        return new Response(200, JSON.stringify(body), headers);
    }
}
