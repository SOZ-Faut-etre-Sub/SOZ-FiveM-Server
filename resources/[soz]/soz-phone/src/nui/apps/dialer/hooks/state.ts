import { CallEvents, CallHistoryItem } from '@typings/call';
import { ServerPromiseResp } from '@typings/common';
import { fetchNui } from '@utils/fetchNui';
import { isEnvBrowser } from '@utils/misc';
import dayjs from 'dayjs';
import { atom, selector } from 'recoil';

import LogDebugEvent from '../../../os/debug/LogDebugEvents';
import { MockHistoryData } from '../utils/constants';

function formatCall(calls) {
    const listedCalls = [];

    calls
        .sort((a, b) => a.start < b.start)
        .forEach(call => {
            const key = dayjs(call.start).format('DD/MM/YYYY');

            if (listedCalls[key] === undefined) {
                listedCalls[key] = [];
            }
            listedCalls[key].push(call);
        });

    return listedCalls;
}

export const dialState = {
    history: atom<CallHistoryItem[]>({
        key: 'dialHistory',
        default: selector({
            key: 'dialHistoryDefault',
            get: async () => {
                try {
                    const resp = await fetchNui<ServerPromiseResp<CallHistoryItem[]>>(CallEvents.FETCH_CALLS);
                    LogDebugEvent({ action: CallEvents.FETCH_CALLS, data: resp.data });

                    return formatCall(resp.data);
                } catch (e) {
                    if (isEnvBrowser()) {
                        return formatCall(MockHistoryData);
                    }
                    console.error(e);
                    return [];
                }
            },
        }),
    }),
};
