import { setHttpCallback } from '@citizenfx/http-wrapper';

import { v4 } from 'uuid';
import * as fs from 'fs';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as koaBody from 'koa-body';
import * as mv from 'mv';
import { File } from 'formidable';

const app = new Koa();
const router = new Router();

class UploadData {
    fileName: string;

    cb: (err: string | boolean, data: string) => void;
}

const uploads: { [token: string]: UploadData } = {};

router.post('/upload/:token', async (ctx) => {
    const tkn: string = ctx.params['token'];

    ctx.response.append('Access-Control-Allow-Origin', '*');
    ctx.response.append('Access-Control-Allow-Methods', 'GET, POST');

    if (uploads[tkn] !== undefined) {
        const upload = uploads[tkn];
        delete uploads[tkn];

        const finish = (err: string, data: string) => {
            setImmediate(() => {
                upload.cb(err || false, data);
            });
        }

        const f = ctx.request.files['file'] as File;

        if (f) {
            if (upload.fileName) {
                mv(f.path, upload.fileName, (err) => {
                    if (err) {
                        finish(err.message, null);
                        return;
                    }

                    finish(null, upload.fileName);
                });
            } else {
                fs.readFile(f.path, (err, data) => {
                    if (err) {
                        finish(err.message, null);
                        return;
                    }

                    fs.unlink(f.path, (err) => {
                        finish(null, `data:${f.type};base64,${data.toString('base64')}`);
                    });
                });
            }
        }

        ctx.body = { success: true };

        return;
    }

    ctx.body = { success: false };
});

app.use(koaBody({
        patchKoa: true,
        multipart: true,
    }))
   .use(router.routes())
   .use(router.allowedMethods());

setHttpCallback(app.callback());

// Cfx stuff
const exp = (<any>global).exports;

exp('requestClientScreenshot', (player: string | number, options: any, cb: (err: string | boolean, data: string) => void) => {
    const tkn = v4();

    const fileName = options.fileName;
    delete options['fileName']; // so the client won't get to know this

    uploads[tkn] = {
        fileName,
        cb
    };

    emitNet('screenshot_basic:requestScreenshot', player, options, `/${GetCurrentResourceName()}/upload/${tkn}`);
});