import { CSSProperties } from 'react';
import { CellMeasurerCache } from 'react-virtualized';
import { MeasuredCellParent } from 'react-virtualized/dist/es/CellMeasurer';

import { Contact } from '../contact';

export type ContactItemProps = {
    index: number;
    parent: MeasuredCellParent;
    cache: CellMeasurerCache;

    contact: Contact;
    style: CSSProperties;
};
