import {atom, selector} from 'recoil';
import {CallEvents, CallHistoryItem} from '@typings/call';
import {fetchNui} from '@utils/fetchNui';
import {ServerPromiseResp} from '@typings/common';
import LogDebugEvent from '../../../os/debug/LogDebugEvents';
import {isEnvBrowser} from '@utils/misc';
import {MockHistoryData} from '../utils/constants';
import dayjs from "dayjs";

function formatCall(calls) {
    let listedCalls = [];

    calls.forEach(call => {
        const key = dayjs(call.start).format('DD/MM/YYYY')
        if (listedCalls[key] === undefined) {
            listedCalls[key] = []
        }
        listedCalls[key].push(call)
    })

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
                    LogDebugEvent({action: CallEvents.FETCH_CALLS, data: resp.data});

                    return formatCall(resp.data);
                } catch (e) {
                    if (isEnvBrowser()) {
                        console.log(formatCall(MockHistoryData))
                        return formatCall(MockHistoryData);
                    }
                    console.error(e);
                    return [];
                }
            },
        }),
    }),
};
