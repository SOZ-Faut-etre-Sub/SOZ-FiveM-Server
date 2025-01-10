import React, { FunctionComponent } from 'react';

import { NewsMessage } from '../../../../../../shared/phone/apps/news';
import { isActivePoliceMessage } from '../utils/isPolice';

export const PoliceContent: FunctionComponent<NewsMessage> = ({ type, message }) => {
    if (!isActivePoliceMessage(type)) {
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
            <strong className="uppercase">555-{type}</strong>.
        </>
    );
};
