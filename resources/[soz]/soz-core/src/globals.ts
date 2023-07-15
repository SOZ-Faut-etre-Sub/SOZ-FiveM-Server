export declare const SOZ_CORE_IS_CLIENT: boolean;
export declare const SOZ_CORE_IS_SERVER: boolean;
export declare const SOZ_CORE_IS_PRODUCTION: boolean;
export declare const SOZ_CORE_DIRNAME: string;
export declare let __dirname: string;
export declare let __filename: string;

if (SOZ_CORE_IS_SERVER) {
    global.__dirname = process.cwd() + '/resources/[soz]/soz-core/build';
    global.__filename = global.__dirname + '/server.js';

    if (!process.cwd().match(/soz-core/)) {
        process.chdir('resources/[soz]/soz-core');
    }
}
