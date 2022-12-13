import { FunctionComponent } from 'react';

export const PanelApp: FunctionComponent = () => {
    return (
        <div className="flex flex-col h-full w-full">
            <div
                style={{
                    height: '97px',
                }}
                className="flex flex-row items-center"
            >
                <div
                    style={{ width: '99px', backgroundImage: `url(/images/panel/top-left.png)` }}
                    className="h-full  z-20"
                ></div>
                <div style={{ backgroundImage: `url(/images/panel/top.png)` }} className="grow  h-full  z-20"></div>
                <div
                    style={{ width: '103px', backgroundImage: `url(/images/panel/top-right.png)` }}
                    className="h-full  z-20"
                ></div>
            </div>
            <div className="flex flex-row items-center grow">
                <div
                    style={{ width: '99px', backgroundImage: `url(/images/panel/left.png)` }}
                    className="h-full bg-center z-20"
                ></div>
                <div className="grow h-full relative z-0">
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
                            src="https://soz.zerator.com"
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
                    style={{ width: '103px', backgroundImage: `url(/images/panel/right.png)` }}
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
                    style={{ width: '99px', backgroundImage: `url(/images/panel/bottom-left.png)` }}
                    className="h-full  z-20"
                ></div>
                <div
                    style={{ backgroundImage: `url(/images/panel/bottom.png)` }}
                    className="h-full grow bg-center  z-20"
                ></div>
                <div
                    style={{ width: '103px', backgroundImage: `url(/images/panel/bottom-right.png)` }}
                    className="h-full  z-20"
                ></div>
            </div>
        </div>
    );
};
