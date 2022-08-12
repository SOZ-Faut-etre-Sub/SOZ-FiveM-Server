import React, { FunctionComponent } from 'react';

import { TwitchNewsMessage } from '../../../../../typings/twitch-news';
import { isActivePoliceMessage } from '../utils/isPolice';

export const PoliceContent: FunctionComponent<TwitchNewsMessage> = ({ type, message }: TwitchNewsMessage) => {
    if (isActivePoliceMessage(type)) {
        return (
            <>
                Les forces de l'ordre ont arrêté <strong>{message}</strong>.
            </>
        );
    }

    return (
        <>
            Les forces de l'ordre sont à la recherche de <strong>{message}</strong>.
            <br />
            Si vous avez des informations sur cette personne, veuillez les communiquer au{' '}
            <strong style={{ textTransform: 'uppercase' }}>555-{type}</strong>.
        </>
    );
};
