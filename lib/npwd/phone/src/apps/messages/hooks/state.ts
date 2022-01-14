import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  CreateMessageGroupResult,
  Message,
  MessageConversation,
  MessageEvents,
} from '@typings/messages';
import { fetchNui } from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { buildRespObj } from '@utils/misc';
import { MockMessageConversations } from '../utils/constants';

const currentGroupId = atom({ key: 'currentGroupId', default: null });

export const messageState = {
  messageCoversations: atom<MessageConversation[]>({
    key: 'messageConversations',
    default: selector({
      key: 'defaultMessageConversation',
      get: async () => {
        try {
          const resp = await fetchNui<ServerPromiseResp<MessageConversation[]>>(
            MessageEvents.FETCH_MESSAGE_CONVERSATIONS,
            undefined,
            buildRespObj(MockMessageConversations),
          );
          return resp.data;
        } catch (e) {
          console.error(e);
          return [];
        }
      },
    }),
  }),
  filterValue: atom<string>({
    key: 'defaultFilterValue',
    default: '',
  }),
  filteredMessageConversations: selector<MessageConversation[]>({
    key: 'defaultFilteredMessageConversations',
    get: ({ get }) => {
      const searchValue: string = get(messageState.filterValue);
      const messageConversations: MessageConversation[] = get(messageState.messageCoversations);

      if (!searchValue) return messageConversations; // added this

      const regExp = new RegExp(searchValue, 'gi');

      return messageConversations.filter(
        (conversation) =>
          conversation?.display?.match(regExp) || conversation.phoneNumber.match(regExp),
      );
    },
  }),
  messages: atom<Message[]>({
    key: 'messages',
    default: [],
  }),
  activeMessageConversation: atom<MessageConversation | null>({
    key: 'activeMessageGroup',
    default: null,
  }),
  showNewMessageGroup: atom<boolean>({
    key: 'showNewMessageGroup',
    default: false,
  }),
  createMessageGroupResult: atom<CreateMessageGroupResult>({
    key: 'createMessageGroupResult',
    default: null,
  }),
  imageModal: atom<boolean>({
    key: 'useImageModal',
    default: false,
  }),
  unreadMessagesCount: atom<number>({
    key: 'unreadMessagesCount',
    default: 0,
  }),
  selectedMessage: atom<Message>({
    key: 'selectedMessage',
    default: null,
  }),
  checkedConversations: atom<string[]>({
    key: 'checkedConversation',
    default: [],
  }),
  isEditing: atom<boolean>({
    key: 'messageIsEditing',
    default: false,
  }),
};

export const useMessageConversationsValue = () => useRecoilValue(messageState.messageCoversations);
export const useSetMessageConversations = () => useSetRecoilState(messageState.messageCoversations);
export const useMessageConversations = () => useRecoilState(messageState.messageCoversations);

export const useMessagesState = () => useRecoilState(messageState.messages);
export const useMessagesValue = () => useRecoilValue(messageState.messages);
export const useSetMessages = () => useSetRecoilState(messageState.messages);

export const useActiveMessageConversation = () =>
  useRecoilValue(messageState.activeMessageConversation);

export const useSetConversationId = () => useSetRecoilState(currentGroupId);
export const useConversationId = () => useRecoilValue(currentGroupId);

export const useFilterValueState = () => useRecoilState(messageState.filterValue);
export const useSetFilterValue = () => useSetRecoilState(messageState.filterValue);

export const useFilteredConversationsValue = () =>
  useRecoilValue(messageState.filteredMessageConversations);

export const useSetSelectedMessage = () => useSetRecoilState(messageState.selectedMessage);
export const useSelectedMessageValue = () => useRecoilValue(messageState.selectedMessage);

export const useCheckedConversations = () => useRecoilState(messageState.checkedConversations);
export const useCheckedConversationsValue = () => useRecoilValue(messageState.checkedConversations);

export const useIsEditing = () => useRecoilState(messageState.isEditing);
export const useIsEditingValue = () => useRecoilValue(messageState.isEditing);
