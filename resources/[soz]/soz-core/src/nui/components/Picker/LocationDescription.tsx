import { animated, useTransition } from '@react-spring/web';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { MapPickerLocation } from '../../../shared/picker';
import { fetchNui } from '../../fetch';

export const LocationDescription: FunctionComponent<{ id: string; description?: MapPickerLocation['description'] }> = ({
    id,
    description,
}) => {
    const transitions = useTransition(description, {
        from: { transform: 'translateY(-2rem)', opacity: 0 },
        enter: { transform: 'translateY(0rem)', opacity: 1 },
        leave: { transform: 'translateY(-2rem)', opacity: 0 },
    });

    const handleClick = () => fetchNui(NuiEvent.PickerSelect, id);

    return transitions((style, display) => {
        if (!display) return null;

        return (
            <animated.main className="fixed p-5 z-20" style={style}>
                <section className="mt-[5vh] w-[22vw]">
                    <div
                        className="w-full aspect-[16/9] bg-cover outline outline-1 outline-[#46EA18] outline-offset-[-1px]"
                        style={{ backgroundImage: `url(${description.image})` }}
                    />
                    <h3 className="m-0 p-2 text-2xl text-center bg-white">{description.title}</h3>
                    <h4 className="relative m-0 p-4 min-h-[5vh] text-white bg-black/50 z-[1]">
                        {description.description}
                    </h4>

                    <div
                        className="relative p-[0.3rem] my-[1vh] mx-[0.4rem] h-12 transition-all duration-500"
                        style={{
                            opacity: display ? 1 : 0,
                            top: display ? '0vh' : '-10vh',
                        }}
                    >
                        <div className="pointer-events-none absolute top-0 left-0 w-full h-[calc(50%-0.4rem)] border border-[rgba(236,232,225,.5)] border-b-0" />
                        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-[calc(50%-0.4rem)] border border-[rgba(236,232,225,.5)] border-t-0" />

                        <div
                            className="relative flex w-full h-full justify-center items-center text-white bg-[#46EA18] cursor-pointer z-[2] hover:bg-[#3FD215]"
                            onClick={handleClick}
                        >
                            Choisir ce point de démarrage
                        </div>
                    </div>
                </section>
            </animated.main>
        );
    });
};
