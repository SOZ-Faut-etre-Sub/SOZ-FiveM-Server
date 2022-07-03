export declare const SOZ_PHONE_IS_CLIENT: boolean;
export declare const SOZ_PHONE_IS_SERVER: boolean;
export declare const SOZ_PHONE_IS_PRODUCTION: boolean;
export declare const SOZ_PHONE_DIRNAME: string;
export declare let __dirname: string;
export declare let __filename: string;

if (SOZ_PHONE_IS_SERVER) {
    global.__dirname = process.cwd() + '/resources/[soz]/soz-phone/build';
    global.__filename = global.__dirname + '/server.js';
}
