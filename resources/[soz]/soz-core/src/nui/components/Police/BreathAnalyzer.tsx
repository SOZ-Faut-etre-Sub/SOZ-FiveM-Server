import { useBackspace } from '@public/nui/hook/control';
import { FunctionComponent, useState } from 'react';

import { useNuiEvent, useNuiFocus } from '../../hook/nui';

export const BreathAnalyzerApp: FunctionComponent = () => {
    const [level, setLevel] = useState<string>(null);
    const [open, setOpen] = useState<boolean>(false);

    useNuiFocus(open, open, false);

    useNuiEvent('police', 'OpenBreathAnalyzer', level => {
        setLevel(null);
        setOpen(true);
        setTimeout(() => setLevel(`${level.toFixed(2)} g/L`), 5000);
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
            style={{
                backgroundImage: `url(/public/images/police/alcootest.webp)`,
                width: '342px',
                height: '418px',
                top: '50px',
                right: '20px',
                position: 'absolute',
            }}
            className="font-mono font-thin tracking-tight text-lg relative bg-contain bg-no-repeat"
        >
            <div
                style={{
                    paddingTop: '95px',
                    paddingLeft: '165px',
                    height: '161px',
                }}
                className="text-green-500 text-center"
            >
                {level != null ? (
                    <div
                        style={{
                            width: '92px',
                            verticalAlign: 'middle',
                        }}
                        className="text-green-500 text-center"
                    >
                        {level}
                    </div>
                ) : (
                    <div
                        style={{
                            width: '92px',
                            lineHeight: 'normal',
                        }}
                        className="text-green-500 text-center"
                    >
                        <div>ANALYSE</div>
                        <div>EN</div>
                        <div>COURS</div>
                    </div>
                )}
            </div>
        </div>
    );
};
