import { CSSProperties, FunctionComponent, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import NumberFormat, { PatternFormat } from 'react-number-format';

import { NuiEvent } from '../../../shared/event';
import { Ear, Radio, RadioChannelType } from '../../../shared/voip';
import { fetchNui } from '../../fetch';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import CloseIcon from '../../icons/voip/close.svg';
import HeadphoneIcon from '../../icons/voip/headphone.svg';
import VolumeIcon from '../../icons/voip/volume.svg';

const displayEar = (ear: Ear) => {
    switch (ear) {
        case Ear.Left:
            return 'L';
        case Ear.Both:
            return 'L/R';
        case Ear.Right:
            return 'R';
    }
};

export const RadioApp: FunctionComponent = () => {
    const [radio, setRadio] = useState<Radio>(null);
    const [display, setDisplay] = useState(false);
    const [currentChannelType, setCurrentChannelType] = useState<RadioChannelType>(RadioChannelType.Primary);
    const { control, handleSubmit, setValue } = useForm();

    useNuiEvent('radio', 'Open', setRadio);
    useNuiEvent(
        'radio',
        'Update',
        radioUpdate => {
            if (radio) {
                setRadio(radioUpdate);
            }
        },
        [radio]
    );
    useNuiEvent('radio', 'Close', () => setRadio(null));
    useNuiFocus(radio !== null, radio !== null, radio !== null);

    useEffect(() => {
        if (!radio) {
            setDisplay(false);
        } else {
            setDisplay(true);
        }
    }, [radio]);

    useEffect(() => {
        if (radio) {
            const frequency =
                currentChannelType === RadioChannelType.Primary ? radio.primary.frequency : radio.secondary.frequency;
            setValue('frequency', frequency);
        }
    }, [radio, currentChannelType]);

    if (!radio) {
        return null;
    }

    return (
        <div
            className="absolute"
            style={{
                bottom: display ? '1vh' : '-50vh',
                left: '1vw',
                transition: 'bottom .3s',
            }}
        >
            <img
                className="relative"
                style={{ height: '40vh', zIndex: 5 }}
                src="/public/images/radio/radio.png"
                alt="radio"
            />
            <div
                className="absolute"
                style={{
                    bottom: '16.5vh',
                    left: '2vw',
                    height: '7vh',
                    width: '5vw',
                }}
            >
                <div
                    className="flex flex-col justify-around w-full h-full"
                    style={{
                        background: radio.enabled ? 'rgb(157, 150, 28)' : 'rgb(133, 141, 122)',
                        padding: '0.5vh 0vw',
                    }}
                >
                    {radio.enabled && (
                        <>
                            <div
                                className="flex justify-between items-center"
                                style={{
                                    padding: '0 .55vw',
                                }}
                            >
                                <span className="text-xl">
                                    {currentChannelType === RadioChannelType.Primary ? 'F1' : 'F2'}
                                </span>
                                <form
                                    onSubmit={handleSubmit(data => {
                                        const frequency = parseInt(data.frequency.toString().replace(/\./g, ''));

                                        if (frequency >= 10000 && frequency <= 99999) {
                                            fetchNui(NuiEvent.VoipUpdateRadioChannel, {
                                                type: currentChannelType,
                                                channel: {
                                                    frequency,
                                                },
                                            });
                                        } else {
                                            const frequency =
                                                currentChannelType === RadioChannelType.Primary
                                                    ? radio.primary.frequency
                                                    : radio.secondary.frequency;

                                            setValue(
                                                'frequency',
                                                frequency.toString().replace(/\./g, '').padEnd(5, '0')
                                            );
                                        }
                                    })}
                                >
                                    <Controller
                                        control={control}
                                        name="frequency"
                                        render={({ field: { onChange, name, value } }) => (
                                            <PatternFormat
                                                className="z-20 relative text-xl bg-transparent text-right border-0 outline-none w-full"
                                                style={{
                                                    fontFamily: 'VT323, sans-serif',
                                                }}
                                                format="###.##"
                                                defaultValue="000.00"
                                                allowEmptyFormatting
                                                mask="#"
                                                name={name}
                                                value={value}
                                                onChange={onChange}
                                            />
                                        )}
                                    />
                                </form>
                            </div>
                            <div
                                className="grid grid-rows-2 gap-2"
                                style={{
                                    padding: '0 .6vw',
                                    fontSize: '0.8rem',
                                }}
                            >
                                <div className="flex items-center">
                                    <VolumeIcon
                                        style={{
                                            height: '1.2vh',
                                            width: '1.2vh',
                                            marginRight: '0.2rem',
                                        }}
                                    />
                                    {currentChannelType === RadioChannelType.Primary
                                        ? radio.primary.volume
                                        : radio.secondary.volume}
                                    %
                                </div>
                                <div className="flex items-center">
                                    <HeadphoneIcon
                                        style={{
                                            height: '1.2vh',
                                            width: '1.2vh',
                                            marginRight: '0.2rem',
                                        }}
                                    />
                                    {currentChannelType === RadioChannelType.Primary
                                        ? displayEar(radio.primary.ear)
                                        : displayEar(radio.secondary.ear)}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="relative z-10">
                <RadioButton
                    style={{
                        bottom: '26.5vh',
                        left: '1.2vw',
                        height: ' 4vh',
                        width: '2vw',
                    }}
                    onClick={() => {
                        fetchNui(NuiEvent.VoipEnableRadio, { enable: !radio.enabled });
                    }}
                />
                <RadioButton
                    style={{
                        bottom: '13.8vh',
                        left: '3.7vw',
                        height: '2vh',
                        width: '1.6vw',
                    }}
                    onClick={() => {
                        const ear =
                            currentChannelType === RadioChannelType.Primary ? radio.primary.ear : radio.secondary.ear;
                        const nextEar = ear === Ear.Left ? Ear.Both : ear === Ear.Both ? Ear.Right : Ear.Left;

                        fetchNui(NuiEvent.VoipUpdateRadioChannel, {
                            type: currentChannelType,
                            channel: {
                                ear: nextEar,
                            },
                        });
                    }}
                />
                <CloseIcon
                    className="absolute text-white cursor-pointer bg-black/0.5 border border-black/60 rounded"
                    style={{
                        bottom: '25vh',
                        left: '8vw',
                        height: '.7rem',
                        width: '.7rem',
                    }}
                    onClick={() => {
                        fetchNui(NuiEvent.VoipCloseRadio);
                        setRadio(null);
                    }}
                />
                <RadioButton
                    style={{
                        bottom: '13.5vh',
                        left: '1.4vw',
                        height: '2vh',
                        width: '1.5vw',
                    }}
                    onClick={() => {
                        fetchNui(NuiEvent.VoipUpdateRadioChannel, {
                            type: currentChannelType,
                            channel: {
                                volume: Math.min(
                                    currentChannelType === RadioChannelType.Primary
                                        ? radio.primary.volume + 10
                                        : radio.secondary.volume + 10,
                                    100
                                ),
                            },
                        });
                    }}
                />
                <RadioButton
                    style={{
                        bottom: '13.5vh',
                        left: '6vw',
                        height: '2vh',
                        width: '1.5vw',
                    }}
                    onClick={() => {
                        fetchNui(NuiEvent.VoipUpdateRadioChannel, {
                            type: currentChannelType,
                            channel: {
                                volume: Math.max(
                                    currentChannelType === RadioChannelType.Primary
                                        ? radio.primary.volume - 10
                                        : radio.secondary.volume - 10,
                                    0
                                ),
                            },
                        });
                    }}
                />
                <RadioButton
                    style={{
                        bottom: '11.3vh',
                        left: '2.5vw',
                        height: '2vh',
                        width: '1.5vw',
                    }}
                    onClick={() => {
                        setCurrentChannelType(RadioChannelType.Primary);
                    }}
                />
                <RadioButton
                    style={{
                        bottom: '11.3vh',
                        left: '4.8vw',
                        height: '2vh',
                        width: '1.5vw',
                    }}
                    onClick={() => {
                        setCurrentChannelType(RadioChannelType.Secondary);
                    }}
                />
            </div>
        </div>
    );
};

type RadioButtonProps = {
    onClick: () => void;
    style?: CSSProperties;
};

const RadioButton: FunctionComponent<RadioButtonProps> = ({ onClick, style }) => {
    return (
        <div
            className="absolute cursor-pointer bg-transparent hover:bg-white/50"
            style={{
                WebkitMaskImage: 'radial-gradient(black, rgba(0,0,0,.1), transparent)',
                maskImage: 'radial-gradient(black, rgba(0,0,0,.1), transparent)',
                transition: 'background-color .2s',
                ...style,
            }}
            onClick={onClick}
        />
    );
};
