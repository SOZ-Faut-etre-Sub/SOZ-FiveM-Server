import { ServerPromiseResp } from '../../../../typings/common';
import { mainLogger } from '../../sv_logger';
import { getSource } from '../../utils/miscUtils';
import { CBSignature, PromiseEventResp, PromiseRequest } from './promise.types';

const netEventLogger = mainLogger.child({ module: 'events' });

export function onNetPromise<T = any, P = any>(eventName: string, cb: CBSignature<T, P>): void {
    onNet(eventName, async (respEventName: string, data: T) => {
        const startTime = process.hrtime.bigint();
        const src = getSource();

        if (!respEventName) {
            return netEventLogger.warn(
                `Promise event (${eventName}) was called with wrong struct by ${src} (maybe originator wasn't a promiseEvent`
            );
        }

        const promiseRequest: PromiseRequest<T> = {
            source: src,
            data,
        };

        netEventLogger.silly(`netPromise > ${eventName} > RequestObj`);
        netEventLogger.silly(promiseRequest);

        const promiseResp: PromiseEventResp<P> = (data: ServerPromiseResp<P>) => {
            const endTime = process.hrtime.bigint();
            const totalTime = Number(endTime - startTime) / 1e6;
            TriggerLatentClientEvent(respEventName, src, 64 * 1024, data);
            netEventLogger.silly(`Response Promise Event ${respEventName} (${totalTime}ms), Data >>`);
            netEventLogger.silly(data);
        };

        // In case the cb is a promise, we use Promise.resolve
        Promise.resolve(cb(promiseRequest, promiseResp)).catch(e => {
            netEventLogger.error(`An error occured for a onNetPromise (${eventName}), Error: ${e.message}`);

            promiseResp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
        });
    });
}
