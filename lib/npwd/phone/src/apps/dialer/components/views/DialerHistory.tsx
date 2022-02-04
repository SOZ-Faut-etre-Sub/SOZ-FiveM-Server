import React, { useCallback } from 'react';
import { List } from '@ui/components/List';
import { ListItem } from '@ui/components/ListItem';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { CallHistoryItem } from '@typings/call';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useDialHistory } from '../../hooks/useDialHistory';
import { useCall } from '@os/call/hooks/useCall';
import { useContacts } from '../../../contacts/hooks/state';
import {Menu, Transition} from "@headlessui/react";
import {Button} from "@ui/components/Button";
import {ChatIcon, PencilAltIcon, PhoneIcon, PhoneIncomingIcon, PhoneMissedCallIcon, PhoneOutgoingIcon, UserAddIcon} from "@heroicons/react/solid";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime)


export const DialerHistory: React.FC = () => {
  const myNumber = useMyPhoneNumber();
  const { getDisplayByNumber, getPictureByNumber } = useContactActions();
  const { initializeCall } = useCall();
  const calls = useDialHistory();
  const contacts = useContacts();
  const history = useHistory();
  const [t] = useTranslation();

  const handleCall = (phoneNumber) => {
    initializeCall(phoneNumber);
  };

  // To display the name, force a re-render when we get contacts | issue #432
  const getDisplay = useCallback(
    (number: string) => (contacts.length ? getDisplayByNumber(number) : number),
    [contacts, getDisplayByNumber],
  );

  if (Object.keys(calls).length === 0) {
    return (
      <div className="flex h-full justify-center items-center text-white">
        <p>
          {t('DIALER.NO_HISTORY')}
        </p>
      </div>
    );
  }

  return (
      <nav className="pb-10 h-full overflow-y-auto" aria-label="Directory">
          {Object.keys(calls).sort().map((date) => (
              <div key={date} className="relative">
                  <div className="sticky top-0 pt-4 bg-black px-6 py-1 text-sm font-medium text-gray-400">
                      <h3>{date}</h3>
                  </div>
                  <ul role="list" className="relative divide-y divide-gray-700">
                      {calls[date].map((call: CallHistoryItem) => (
                          <Menu key={call.id} as="li" className="bg-black w-full">
                              <Menu.Button className="w-full">
                                  <div className="relative px-6 py-2 flex items-center space-x-3 hover:bg-gray-900">
                                      <div className="flex-shrink-0">
                                          {getPictureByNumber(call.transmitter === myNumber ? call.receiver : call.transmitter) ? (
                                              <img className="h-10 w-10 bg-gray-700 rounded-full" src={getPictureByNumber(call.transmitter === myNumber ? call.receiver : call.transmitter)} alt=""/>
                                          ) : (
                                              <div className="h-10 w-10 bg-gray-700 rounded-full"/>
                                          )}
                                      </div>
                                      <div className="flex flex-1 min-w-0 cursor-pointer">
                                          {call.is_accepted ? (
                                              <PhoneMissedCallIcon className="h-5 w-5 text-red-500 mr-3" />
                                          ) : (
                                              call.transmitter === myNumber ? (
                                                <PhoneOutgoingIcon className="h-5 w-5 text-green-500 mr-3" />
                                              ) : (
                                                <PhoneIncomingIcon className="h-5 w-5 text-green-700 mr-3" />
                                              )
                                          )}
                                          <p className="text-left text-sm font-medium text-gray-100">{getDisplay(call.transmitter === myNumber ? call.receiver : call.transmitter)}</p>
                                      </div>
                                      <div className="text-gray-500 text-sm">
                                        {dayjs(call.start).fromNow(true)}
                                      </div>
                                  </div>
                              </Menu.Button>
                              <Transition
                                  enter="transition duration-100 ease-out"
                                  enterFrom="transform scale-95 opacity-0"
                                  enterTo="transform scale-100 opacity-100"
                                  leave="transition duration-75 ease-out"
                                  leaveFrom="transform scale-100 opacity-100"
                                  leaveTo="transform scale-95 opacity-0"
                              >
                                  <Menu.Items
                                      className="absolute z-30 right-0 w-64 mt-2 origin-top-right bg-white bg-opacity-20 divide-y divide-gray-600 divide-opacity-50 rounded-md shadow-lg focus:outline-none">
                                      <Menu.Item>
                                          <Button
                                              className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                              onClick={() => handleCall(call.transmitter === myNumber ? call.receiver : call.transmitter)}
                                          >
                                              <PhoneIcon className="mx-3 h-5 w-5"/> Appeler
                                          </Button>
                                      </Menu.Item>
                                      {getDisplay(call.receiver) === call.receiver && myNumber !== call.receiver &&
                                          <Menu.Item>
                                              <Button
                                                  className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                                  onClick={() => history.push(`/contacts/-1?addNumber=${call.receiver}&referal=/phone/contacts`)}
                                              >
                                                  <UserAddIcon className="mx-3 h-5 w-5"/> Ajouter le contact
                                              </Button>
                                          </Menu.Item>
                                      }
                                      {getDisplay(call.transmitter) === call.transmitter && myNumber !== call.transmitter &&
                                          <Menu.Item>
                                              <Button
                                                  className="flex items-center w-full text-gray-300 px-2 py-2 hover:text-gray-500"
                                                  onClick={() => history.push(`/contacts/-1?addNumber=${call.transmitter}&referal=/phone/contacts`)}
                                              >
                                                  <UserAddIcon className="mx-3 h-5 w-5"/> Ajouter le contact
                                              </Button>
                                          </Menu.Item>
                                      }
                                  </Menu.Items>
                              </Transition>
                          </Menu>
                      ))}
                  </ul>
              </div>
          ))}
      </nav>



    // <List disablePadding>

    //   {calls.map((call: CallHistoryItem) =>
    //     call.transmitter === myNumber ? (
    //       <ListItem key={call.id}>
    //         {/*{getDisplay(call.receiver) === call.receiver && (*/}
    //         {/*  <IconButton*/}
    //         {/*    onClick={() =>*/}
    //         {/*      history.push(`/contacts/-1?addNumber=${call.receiver}&referal=/phone/contacts`)*/}
    //         {/*    }*/}
    //         {/*    size="large"*/}
    //         {/*  >*/}
    //         {/*    <PersonAddIcon />*/}
    //         {/*  </IconButton>*/}
    //         {/*)}*/}
    //       </ListItem>
    //     ) : (
    //       <ListItem key={call.id}>
    //         {/*{getDisplay(call.transmitter) === call.transmitter && (*/}
    //         {/*  <IconButton*/}
    //         {/*    onClick={() =>*/}
    //         {/*      history.push(`/contacts/-1?addNumber=${call.transmitter}&referal=/phone/contacts`)*/}
    //         {/*    }*/}
    //         {/*    size="large"*/}
    //         {/*  >*/}
    //         {/*    /!*<PersonAddIcon />*!/*/}
    //         {/*  </IconButton>*/}
    //         {/*)}*/}
    //       </ListItem>
    //     ),
    //   )}
    // </List>
  );
};
