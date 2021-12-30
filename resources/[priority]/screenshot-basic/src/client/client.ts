const exp = (<any>global).exports;

RegisterNuiCallbackType('screenshot_created');

class ResultData {
    cb: (data: string) => void;
}

const results: {[id: string]: ResultData} = {};
let correlationId = 0;

function registerCorrelation(cb: (result: string) => void) {
    const id = correlationId.toString();

    results[id] = { cb };

    correlationId++;

    return id;
}

on('__cfx_nui:screenshot_created', (body: any, cb: (arg: any) => void) => {
    cb(true);

    if (body.id !== undefined && results[body.id]) {
        results[body.id].cb(body.data);
        delete results[body.id];
    }
});

exp('requestScreenshot', (options: any, cb: (result: string) => void) => {
    const realOptions = (cb !== undefined) ? options : {
        encoding: 'jpg'
    };

    const realCb = (cb !== undefined) ? cb : options;

    realOptions.resultURL = null;
    realOptions.targetField = null;
    realOptions.targetURL = `http://${GetCurrentResourceName()}/screenshot_created`;
    
    realOptions.correlation = registerCorrelation(realCb);

    SendNuiMessage(JSON.stringify({
        request: realOptions
    }));
});

exp('requestScreenshotUpload', (url: string, field: string, options: any, cb: (result: string) => void) => {
    const realOptions = (cb !== undefined) ? options : {
        encoding: 'jpg'
    };

    const realCb = (cb !== undefined) ? cb : options;

    realOptions.targetURL = url;
    realOptions.targetField = field;
    realOptions.resultURL = `http://${GetCurrentResourceName()}/screenshot_created`;
    
    realOptions.correlation = registerCorrelation(realCb);

    SendNuiMessage(JSON.stringify({
        request: realOptions
    }));
});

onNet('screenshot_basic:requestScreenshot', (options: any, url: string) => {
    options.encoding = options.encoding || 'jpg';

    options.targetURL = `http://${GetCurrentServerEndpoint()}${url}`;
    options.targetField = 'file';
    options.resultURL = null;

    options.correlation = registerCorrelation(() => {});

    SendNuiMessage(JSON.stringify({
        request: options
    }));
});