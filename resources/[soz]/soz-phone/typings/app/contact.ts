import { CSSProperties } from 'react';

import { Contact } from '../contact';

export type ContactItemProps = {
    index: number;
    style: CSSProperties;

    data: Contact[];
};
