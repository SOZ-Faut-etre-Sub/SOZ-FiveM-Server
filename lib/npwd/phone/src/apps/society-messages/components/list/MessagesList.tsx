import React from 'react';
import {useMessagesValue} from "../../hooks/state";
import {fetchNui} from "@utils/fetchNui";
import {ServerPromiseResp} from "@typings/common";
import {MessageEvents} from "@typings/messages";
import LogDebugEvent from "@os/debug/LogDebugEvents";
import {useCall} from "@os/call/hooks/useCall";
import {SocietyEvents} from "@typings/society";
import dayjs from "dayjs";
import { ListItem } from '@ui/components/ListItem';
import { List } from '@ui/components/List';
import { Button } from '@ui/components/Button';

const MessagesList = (): any => {
  const societyMessages = useMessagesValue();
  const { initializeCall } = useCall();

  const startCall = (number: string) => {
    LogDebugEvent({
      action: 'Emitting `Start Call` to Scripts',
      level: 2,
      data: true,
    });
    initializeCall(number);
  };

  const setWaypoint = (pos) => {
    let position = JSON.parse(pos);

    fetchNui<ServerPromiseResp<void>>(MessageEvents.SET_WAYPOINT, {
      x: position.x,
      y: position.y,
    })
  };

  const setMessageState = (id, take, done) => {
    fetchNui<ServerPromiseResp<void>>(SocietyEvents.UPDATE_SOCIETY_MESSAGE, {
      id, take, done,
    })
  };

  return (
    <List>
      {societyMessages.map((message) => (
        <ListItem key={message.conversation_id} alignItems="flex-start">

          {message.source_phone !== '' && <Button style={{ marginRight: -15 }} onClick={() => startCall(message.source_phone)}>
            {/*<PhoneIcon color="action" />*/}
          </Button>}
          {message.position && <Button onClick={() => setWaypoint(message.position)}>
              {/*<LocationOnIcon color="info" />*/}
            </Button>}
          {message.isDone ? (
            <Button style={{ marginLeft: -15, marginRight: -15 }}>
              {/*<DoneAllIcon color="success" />*/}
            </Button>
          ) : (
            message.isTaken ? (
              <Button style={{ marginLeft: -15, marginRight: -15 }} onClick={() => setMessageState(message.id, true, true)}>
                {/*<DoneIcon color="warning" />*/}
              </Button>
            ) : (
              <Button style={{ marginLeft: -15, marginRight: -15 }} onClick={() => setMessageState(message.id, true, false)}>
                {/*<ClearIcon color="error" />*/}
              </Button>
            )
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default MessagesList;
