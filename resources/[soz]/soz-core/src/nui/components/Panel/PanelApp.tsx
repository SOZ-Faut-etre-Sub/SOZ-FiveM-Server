import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import { useBackspace } from '../../hook/control';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { useOutside } from '../../hook/outside';
import { usePrevious } from '../../hook/previous';

export const PanelApp: FunctionComponent = () => {
    const [showPanel, setShowPanel] = useState<string>(null);
    useNuiFocus(showPanel !== null, showPanel !== null, false);
    const wasShowPanel = usePrevious(showPanel);
    const refOutside = useOutside({
        click: () => setShowPanel(null),
    });

    useNuiEvent('panel', 'ShowPanel', url => {
        setShowPanel(url);
    });

    useBackspace(() => {
        setShowPanel(null);
    });

    useEffect(() => {
        if (!showPanel && wasShowPanel !== null) {
            fetchNui(NuiEvent.PanelClosed);
        }
    }, [showPanel]);

    if (showPanel === null) {
        return null;
    }

    return (
        <div className="flex flex-col h-full w-full p-40">
            <div
                style={{
                    height: '97px',
                }}
                className="flex flex-row items-center"
            >
                <div
                    style={{ width: '99px', backgroundImage: `url(/public/images/panel/top-left.png)` }}
                    className="h-full z-20"
                ></div>
                <div
                    style={{ backgroundImage: `url(/public/images/panel/top.png)` }}
                    className="grow h-full bg-center z-20"
                ></div>
                <div
                    style={{ width: '103px', backgroundImage: `url(/public/images/panel/top-right.png)` }}
                    className="h-full z-20"
                ></div>
            </div>
            <div className="flex flex-row items-center grow">
                <div
                    style={{ width: '99px', backgroundImage: `url(/public/images/panel/left.png)` }}
                    className="h-full bg-center z-20"
                ></div>
                <div ref={refOutside} className="grow h-full relative z-0">
                    <div
                        className="absolute z-10"
                        style={{
                            zIndex: -1,
                            width: 'calc(100% + 60px)',
                            height: 'calc(100% + 60px)',
                            top: '-30px',
                            left: '-30px',
                        }}
                    >
                        <iframe
                            src={showPanel}
                            style={{
                                width: '100%',
                                height: '100%',
                                overflow: 'hidden',
                            }}
                            height="100%"
                            width="100%"
                        ></iframe>
                    </div>
                </div>
                <div
                    style={{ width: '103px', backgroundImage: `url(/public/images/panel/right.png)` }}
                    className="h-full bg-center  z-20"
                ></div>
            </div>
            <div
                style={{
                    height: '101px',
                }}
                className="flex flex-row items-center  z-20"
            >
                <div
                    style={{ width: '99px', backgroundImage: `url(/public/images/panel/bottom-left.png)` }}
                    className="h-full  z-20"
                ></div>
                <div
                    style={{ backgroundImage: `url(/public/images/panel/bottom.png)` }}
                    className="h-full grow bg-center z-20"
                ></div>
                <div
                    style={{ width: '103px', backgroundImage: `url(/public/images/panel/bottom-right.png)` }}
                    className="h-full z-20"
                ></div>
            </div>
        </div>
    );
};
