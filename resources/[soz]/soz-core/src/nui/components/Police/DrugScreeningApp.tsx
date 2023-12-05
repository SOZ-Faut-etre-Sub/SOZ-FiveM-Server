import { useBackspace } from '@public/nui/hook/control';
import { FunctionComponent, useState } from 'react';

import { useNuiEvent, useNuiFocus } from '../../hook/nui';

export const DrugScreeningApp: FunctionComponent = () => {
    const [positive, setPositive] = useState<boolean>(null);
    const [open, setOpen] = useState<boolean>(false);

    useNuiFocus(open, open, false);

    useNuiEvent('police', 'OpenScreeningTest', positiveTest => {
        setPositive(positiveTest);
        setOpen(true);
    });

    useBackspace(() => {
        setOpen(false);
    });

    if (!open) {
        return;
    }

    return (
        <div
            onClick={() => setOpen(false)}
            className="font-mono font-thin tracking-tight text-lg relative bg-contain bg-no-repeat"
            style={{
                backgroundImage: `${
                    positive
                        ? 'url(/public/images/police/DrugTestPositif.webp)'
                        : 'url(/public/images/police/DrugTestNegatif.webp)'
                }`,
                width: '342px',
                height: '418px',
                top: '50px',
                right: '20px',
                position: 'absolute',
            }}
        />
    );
};
