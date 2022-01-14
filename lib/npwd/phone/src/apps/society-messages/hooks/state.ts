import {atom, selector, useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {
  SocietyEvents,
  SocietyMessage,
} from '@typings/society';
import {fetchNui} from "@utils/fetchNui";
import {ServerPromiseResp} from "@typings/common";
import {buildRespObj} from "@utils/misc";
import {MockSocietyMessages} from "../utils/constants";

export const messageState = {
  messages: atom<SocietyMessage[]>({
    key: 'societyMessages',
    default: selector({
      key: 'defaultSocietyMessages',
      get: async () => {
        try {
          const resp = await fetchNui<ServerPromiseResp<SocietyMessage[]>>(
            SocietyEvents.FETCH_SOCIETY_MESSAGES,
            undefined,
            buildRespObj(MockSocietyMessages),
          );
          return resp.data.reverse();
        } catch (e) {
          console.error(e);
          return [];
        }
      },
    }),
  }),
};

export const useMessagesState = () => useRecoilState(messageState.messages);
export const useMessagesValue = () => useRecoilValue(messageState.messages);
export const useSetMessages = () => useSetRecoilState(messageState.messages);


