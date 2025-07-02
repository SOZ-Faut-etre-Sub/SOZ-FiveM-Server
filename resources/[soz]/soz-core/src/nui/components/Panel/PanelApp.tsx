import { FunctionComponent, useEffect, useRef, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import { useAssetPath } from '../../hook/assets';
import { useBackspace } from '../../hook/control';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { useOutside } from '../../hook/outside';
import { usePrevious } from '../../hook/previous';

export const PanelApp: FunctionComponent = () => {
    const embedRef = useRef<HTMLIFrameElement>();
    const [showPanel, setShowPanel] = useState<string>(null);

    const wasShowPanel = usePrevious(showPanel);
    const { getPath } = useAssetPath();

    const refOutside = useOutside({
        click: () => {
            fetchNui(NuiEvent.PanelUpdateItemUrl, embedRef.current?.contentWindow.location.href);
            setShowPanel(null);
        },
    });

    useNuiFocus(showPanel !== null, showPanel !== null, false);

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

    const aspectRatio = window.innerWidth / window.innerHeight;
    const leftOffset = () => {
        if (aspectRatio > 3.5 && window.innerWidth > 5000) {
            return '79vh';
        } else if (aspectRatio > 3.5 && window.innerWidth < 5000) {
            return '79vh';
        } else {
            return '0vh';
        }
    };

    const width = () => {
        if (aspectRatio > 3.5 && window.innerWidth > 5000) {
            return '200vh';
        } else if (aspectRatio > 3.5 && window.innerWidth < 5000) {
            return '200vh';
        } else {
            return '100%';
        }
    };

    return (
        <div className="fixed h-full p-[8rem] z-30" style={{ left: leftOffset(), width: width() }}>
            <div ref={refOutside} className="flex flex-col h-full">
                <div
                    style={{
                        height: '97px',
                    }}
                    className="flex flex-row items-start"
                >
                    <div
                        style={{
                            width: '99px',
                            backgroundImage: `url(${getPath(`images/panel/top-left.webp`)})`,
                        }}
                        className="h-full z-30"
                    />
                    <div
                        style={{ backgroundImage: `url(${getPath(`images/panel/top.webp`)})` }}
                        className="grow h-[73px] bg-center z-30"
                    />
                    <div
                        style={{
                            width: '103px',
                            backgroundImage: `url(${getPath(`images/panel/top-right.webp`)})`,
                        }}
                        className="h-full z-30"
                    />
                </div>
                <div className="flex flex-row items-center grow">
                    <div
                        style={{
                            width: '73px',
                            backgroundImage: `url(${getPath(`images/panel/left.webp`)})`,
                        }}
                        className="h-full bg-center z-30"
                    />
                    <div className="grow h-full relative z-20">
                        <div
                            className="absolute z-30"
                            style={{
                                zIndex: -1,
                                width: 'calc(100% + 60px)',
                                height: 'calc(100% + 60px)',
                                top: '-30px',
                                left: '-30px',
                                paddingInline: '20px',
                            }}
                        >
                            <iframe
                                ref={embedRef}
                                src={showPanel}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    overflow: 'hidden',
                                    background: '#161616',
                                }}
                                height="100%"
                                width="100%"
                            />
                        </div>
                    </div>
                    <div
                        style={{
                            width: '77px',
                            backgroundImage: `url(${getPath(`images/panel/right.webp`)})`,
                        }}
                        className="h-full bg-center  z-30"
                    />
                </div>
                <div
                    style={{
                        height: '101px',
                    }}
                    className="flex flex-row items-end"
                >
                    <div
                        style={{
                            width: '99px',
                            backgroundImage: `url(${getPath(`images/panel/bottom-left.webp`)})`,
                        }}
                        className="h-full  z-30"
                    />
                    <div
                        style={{ backgroundImage: `url(${getPath(`images/panel/bottom.webp`)})` }}
                        className="h-[76px] grow bg-center z-30"
                    />
                    <div
                        style={{
                            width: '103px',
                            backgroundImage: `url(${getPath(`images/panel/bottom-right.webp`)})`,
                        }}
                        className="h-full z-30"
                    />
                </div>
            </div>
        </div>
    );
};
