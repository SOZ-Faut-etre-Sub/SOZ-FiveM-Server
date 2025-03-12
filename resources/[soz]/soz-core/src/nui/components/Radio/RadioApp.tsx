import './Radio.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';

import { NuiEvent } from '../../../shared/event';
import { Control } from '../../../shared/input';
import { Ear, RadioChannelType, RadioWithVolumeClick } from '../../../shared/voip';
import { fetchNui } from '../../fetch';
import { useAssetPath } from '../../hook/assets';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import CloseIcon from '../../icons/voip/close.svg';
import HeadphoneIcon from '../../icons/voip/headphone.svg';
import VolumeIcon from '../../icons/voip/volume.svg';
import { playSound } from '../../utils/sound';
import { displayEar, RadioButton } from './Common';

export const RadioApp: FunctionComponent = () => {
    const [radio, setRadio] = useState<RadioWithVolumeClick>(null);
    const [display, setDisplay] = useState(false);
    const [currentChannelType, setCurrentChannelType] = useState<RadioChannelType>(RadioChannelType.Primary);
    const [inVolumeClickMode, setInVolumeClickMode] = useState(false);
    const { control, handleSubmit, setValue } = useForm<{ frequency: string }, any, { frequency: string }>();

    const { getPath } = useAssetPath();

    useNuiEvent('radio', 'Open', radio => {
        setRadio(radio);

        setTimeout(() => {
            setDisplay(true);
        }, 0);
    });
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
    useNuiEvent('radio', 'Close', () => {
        setDisplay(false);

        setTimeout(() => {
            setRadio(null);
        }, 300);
    });

    useNuiFocus(
        radio !== null,
        radio !== null,
        radio !== null,
        radio !== null ? [Control.Attack, Control.NextCamera] : []
    );

    useEffect(() => {
        if (radio) {
            const frequency =
                currentChannelType === RadioChannelType.Primary ? radio.primary.frequency : radio.secondary.frequency;
            setValue('frequency', frequency.toString());
        }
    }, [radio, currentChannelType]);

    if (!radio) {
        return null;
    }

    const aspectRatio = window.innerWidth / window.innerHeight;
    const rightOffset = () => {
        if (aspectRatio > 3.5 && window.innerWidth > 5000) {
            return '20vw';
        } else {
            return '25vw';
        }
    };

    return (
        <div
            className="absolute font-digital7"
            style={{
                bottom: display ? '2vh' : '-50vh',
                right: rightOffset(),
                transition: 'bottom .3s',
                zIndex: 30,
                width: '20vh',
                aspectRatio: '696/1453',
                fontSize: '1.7vh',
                color: '#0000009c',
            }}
        >
            <form
                onSubmit={handleSubmit(data => {
                    const frequency = parseInt(data.frequency.toString().replace(/\./g, ''));
                    const volume =
                        currentChannelType === RadioChannelType.Primary ? radio.primary.volume : radio.secondary.volume;

                    if (frequency >= 10000 && frequency <= 99999) {
                        fetchNui(NuiEvent.VoipUpdateRadioChannel, {
                            type: currentChannelType,
                            channel: {
                                frequency,
                            },
                        });
                        playSound('click', volume / 100);
                    } else {
                        const frequency =
                            currentChannelType === RadioChannelType.Primary
                                ? radio.primary.frequency
                                : radio.secondary.frequency;

                        setValue('frequency', frequency.toString().replace(/\./g, '').padEnd(5, '0'));
                    }
                })}
            >
                <img
                    className="absolute w-full h-full"
                    style={{ zIndex: 5 }}
                    src={getPath('images/radio/radio.webp')}
                    alt="radio"
                />
                <div
                    className="absolute"
                    style={{
                        bottom: '60.8%',
                        left: '18%',
                        height: '12%',
                        width: '66%',
                        zIndex: 11,
                    }}
                >
                    <div
                        className="flex flex-col justify-between w-full h-full"
                        style={{
                            background: radio.enabled ? 'rgba(254,204,56,255)' : 'rgb(133, 141, 122)',
                            padding: '0.5% 0.5%',
                            borderRadius: '2%',
                            boxShadow: radio.enabled ? '0px 0px 20px 6px rgba(218,126,56,255)' : 'none',
                        }}
                    >
                        {radio.enabled && (
                            <>
                                <div
                                    className="flex justify-between items-center"
                                    style={{
                                        padding: '0 .2%',
                                        lineHeight: '1.2vh',
                                    }}
                                >
                                    <span>{currentChannelType === RadioChannelType.Primary ? 'F1' : 'F2'}</span>
                                    <Controller
                                        control={control}
                                        name="frequency"
                                        render={({ field: { onChange, name, value } }) => (
                                            <PatternFormat
                                                className="z-20 relative bg-transparent text-right border-0 outline-none w-full"
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
                                </div>
                                {!inVolumeClickMode && (
                                    <div
                                        className="flex items-center justify-between"
                                        style={{
                                            padding: '0 .1vw',
                                            lineHeight: '1.2vh',
                                        }}
                                    >
                                        <div className="flex items-center">
                                            <VolumeIcon
                                                style={{
                                                    height: '1vh',
                                                    width: '1vh',
                                                }}
                                            />
                                            <span className="ml-1">Voice</span>
                                        </div>
                                        <span>
                                            {currentChannelType === RadioChannelType.Primary
                                                ? radio.primary.volume
                                                : radio.secondary.volume}
                                            %
                                        </span>
                                    </div>
                                )}
                                {inVolumeClickMode && (
                                    <div
                                        className="flex items-center justify-between"
                                        style={{
                                            padding: '0 .1vw',
                                            lineHeight: '1.2vh',
                                        }}
                                    >
                                        <div className="flex items-center">
                                            <VolumeIcon
                                                style={{
                                                    height: '1vh',
                                                    width: '1vh',
                                                }}
                                            />
                                            <span className="ml-1">Click</span>
                                        </div>
                                        <span>
                                            {currentChannelType === RadioChannelType.Primary
                                                ? radio.primaryClickVolume
                                                : radio.secondaryClickVolume}
                                            %
                                        </span>
                                    </div>
                                )}
                                <div
                                    className="flex items-center justify-between"
                                    style={{
                                        padding: '0 .1vw',
                                        lineHeight: '1.2vh',
                                    }}
                                >
                                    <HeadphoneIcon
                                        style={{
                                            height: '1vh',
                                            width: '1vh',
                                        }}
                                    />
                                    {currentChannelType === RadioChannelType.Primary
                                        ? displayEar(radio.primary.ear)
                                        : displayEar(radio.secondary.ear)}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="absolute z-10 w-full h-full">
                    <input
                        type="submit"
                        value=""
                        className="absolute cursor-pointer bg-transparent hover:bg-white/50"
                        style={{
                            WebkitMaskImage: 'radial-gradient(black, rgba(0,0,0,0.01), transparent)',
                            maskImage: 'radial-gradient(black, rgba(0,0,0,0.01), transparent)',
                            transition: 'background-color .2s',
                            bottom: '46.2%',
                            left: '12%',
                            height: '9%',
                            width: '24%',
                        }}
                    />
                    <RadioButton
                        style={{
                            bottom: '72%',
                            right: '6%',
                            height: '20%',
                            width: '35%',
                        }}
                        onClick={() => {
                            fetchNui(NuiEvent.VoipEnableRadio, { enable: !radio.enabled });
                            playSound('radio/toggle', 0.2);
                        }}
                    />
                    <RadioButton
                        style={{
                            bottom: '28.7%',
                            right: '11%',
                            height: '6%',
                            width: '13%',
                        }}
                        onClick={() => {
                            setInVolumeClickMode(!inVolumeClickMode);
                            playSound('radio/toggle', 0.2);
                        }}
                    />
                    <RadioButton
                        style={{
                            bottom: '28.7%',
                            left: '18%',
                            height: '6.5%',
                            width: '16%',
                        }}
                        onClick={() => {
                            const ear =
                                currentChannelType === RadioChannelType.Primary
                                    ? radio.primary.ear
                                    : radio.secondary.ear;
                            const volume =
                                currentChannelType === RadioChannelType.Primary
                                    ? radio.primary.volume
                                    : radio.secondary.volume;
                            const nextEar = ear === Ear.Left ? Ear.Both : ear === Ear.Both ? Ear.Right : Ear.Left;

                            fetchNui(NuiEvent.VoipUpdateRadioChannel, {
                                type: currentChannelType,
                                channel: {
                                    ear: nextEar,
                                },
                            });
                            playSound('click', volume / 100);
                        }}
                    />
                    <CloseIcon
                        className="absolute text-white cursor-pointer bg-black/0.5 border border-black/60 rounded"
                        style={{
                            bottom: '75%',
                            right: '0vw',
                            height: '.7rem',
                            width: '.7rem',
                        }}
                        onClick={() => {
                            fetchNui(NuiEvent.VoipCloseRadio);
                            setDisplay(false);

                            setTimeout(() => {
                                setRadio(null);
                            }, 300);
                        }}
                    />
                    <RadioButton
                        style={{
                            bottom: '21.5%',
                            left: '31%',
                            height: '5%',
                            width: '18%',
                        }}
                        onClick={() => {
                            if (inVolumeClickMode) {
                                fetchNui(NuiEvent.VoipUpdateRadioVolumeClick, {
                                    type: currentChannelType,
                                    volume: Math.min(
                                        currentChannelType === RadioChannelType.Primary
                                            ? radio.primaryClickVolume + 10
                                            : radio.secondaryClickVolume + 10,
                                        100
                                    ),
                                });
                            } else {
                                const volume = Math.min(
                                    currentChannelType === RadioChannelType.Primary
                                        ? radio.primary.volume + 10
                                        : radio.secondary.volume + 10,
                                    100
                                );

                                fetchNui(NuiEvent.VoipUpdateRadioChannel, {
                                    type: currentChannelType,
                                    channel: {
                                        volume,
                                    },
                                });

                                playSound('click', volume / 100);
                            }
                        }}
                    />
                    <RadioButton
                        style={{
                            bottom: '21.5%',
                            left: '51%',
                            height: '5%',
                            width: '18%',
                        }}
                        onClick={() => {
                            if (inVolumeClickMode) {
                                fetchNui(NuiEvent.VoipUpdateRadioVolumeClick, {
                                    type: currentChannelType,
                                    volume: Math.max(
                                        currentChannelType === RadioChannelType.Primary
                                            ? radio.primaryClickVolume - 10
                                            : radio.secondaryClickVolume - 10,
                                        0
                                    ),
                                });
                            } else {
                                const volume = Math.max(
                                    currentChannelType === RadioChannelType.Primary
                                        ? radio.primary.volume - 10
                                        : radio.secondary.volume - 10,
                                    0
                                );

                                fetchNui(NuiEvent.VoipUpdateRadioChannel, {
                                    type: currentChannelType,
                                    channel: {
                                        volume,
                                    },
                                });

                                playSound('click', volume / 100);
                            }
                        }}
                    />
                    <RadioButton
                        style={{
                            bottom: '21.5%',
                            left: '13%',
                            height: '5%',
                            width: '18%',
                        }}
                        onClick={() => {
                            setCurrentChannelType(RadioChannelType.Primary);
                            playSound('click', radio.primary.volume / 100);
                        }}
                    />
                    <RadioButton
                        style={{
                            bottom: '21.5%',
                            left: '70%',
                            height: '5%',
                            width: '18%',
                        }}
                        onClick={() => {
                            setCurrentChannelType(RadioChannelType.Secondary);
                            playSound('click', radio.secondary.volume / 100);
                        }}
                    />
                </div>
            </form>
        </div>
    );
};
