import { FunctionComponent, useState } from 'react';

import { useBackspace } from '../../hook/control';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { useOutside } from '../../hook/outside';

export const SceneSearchPropApp: FunctionComponent = () => {
    const [showWebApp, setShowWebApp] = useState<string>(null);
    useNuiFocus(showWebApp !== null, showWebApp !== null, false);
    const refOutside = useOutside({
        click: () => setShowWebApp(null),
    });

    useNuiEvent('scene', 'ShowSearch', url => {
        setShowWebApp(url);
    });

    useBackspace(() => {
        setShowWebApp(null);
    });

    if (showWebApp === null) {
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
        <div className="absolute h-full p-[8rem] z-30" style={{ left: leftOffset(), width: width() }}>
            <div ref={refOutside} className="flex flex-col h-full">
                <div
                    style={{
                        height: '97px',
                    }}
                    className="flex flex-row items-start"
                >
                    <div
                        style={{ width: '99px', backgroundImage: `url(/public/images/panel/top-left.webp)` }}
                        className="h-full z-30"
                    ></div>
                    <div
                        style={{ backgroundImage: `url(/public/images/panel/top.webp)` }}
                        className="grow h-[73px] bg-center z-30"
                    ></div>
                    <div
                        style={{ width: '103px', backgroundImage: `url(/public/images/panel/top-right.webp)` }}
                        className="h-full z-30"
                    ></div>
                </div>
                <div className="flex flex-row items-center grow">
                    <div
                        style={{ width: '73px', backgroundImage: `url(/public/images/panel/left.webp)` }}
                        className="h-full bg-center z-30"
                    ></div>
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
                                src="https://gtahash.ru/"
                                referrerPolicy="no-referrer"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    overflow: 'auto',
                                    background: '#161616',
                                }}
                                height="100%"
                                width="100%"
                            ></iframe>
                        </div>
                    </div>
                    <div
                        style={{ width: '77px', backgroundImage: `url(/public/images/panel/right.webp)` }}
                        className="h-full bg-center  z-30"
                    ></div>
                </div>
                <div
                    style={{
                        height: '101px',
                    }}
                    className="flex flex-row items-end"
                >
                    <div
                        style={{ width: '99px', backgroundImage: `url(/public/images/panel/bottom-left.webp)` }}
                        className="h-full  z-30"
                    ></div>
                    <div
                        style={{ backgroundImage: `url(/public/images/panel/bottom.webp)` }}
                        className="h-[76px] grow bg-center z-30"
                    ></div>
                    <div
                        style={{ width: '103px', backgroundImage: `url(/public/images/panel/bottom-right.webp)` }}
                        className="h-full z-30"
                    ></div>
                </div>
            </div>
        </div>
    );
};
