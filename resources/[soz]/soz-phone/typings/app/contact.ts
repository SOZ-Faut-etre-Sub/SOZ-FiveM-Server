import { CSSProperties } from 'react';

import { Contact, ContactSeparator } from '../contact';

export type ContactItemProps = {
    index: number;
    style: CSSProperties;

    data: (Contact | ContactSeparator)[];
};
