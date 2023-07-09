import { FunctionComponent, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';

import { NuiEvent } from '../../../shared/event';
import { Control } from '../../../shared/input';
import { Ear, Radio, RadioChannelType } from '../../../shared/voip';
import { fetchNui } from '../../fetch';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import CloseIcon from '../../icons/voip/close.svg';
import HeadphoneIcon from '../../icons/voip/headphone.svg';
import VolumeIcon from '../../icons/voip/volume.svg';
import { displayEar, RadioButton } from './Common';

export const RadioVehicleApp: FunctionComponent = () => {
    const [radio, setRadio] = useState<Radio>(null);
    const [display, setDisplay] = useState(false);
    const [currentChannelType, setCurrentChannelType] = useState<RadioChannelType>(RadioChannelType.Primary);
    const { control, handleSubmit, setValue } = useForm();

    useNuiEvent('radio_vehicle', 'Open', setRadio);
    useNuiEvent(
        'radio_vehicle',
        'Update',
        radioUpdate => {
            if (radio) {
                setRadio(radioUpdate);
            }
        },
        [radio]
    );
    useNuiEvent('radio_vehicle', 'Close', () => setRadio(null));
    useNuiFocus(
        radio !== null,
        radio !== null,
        radio !== null,
        radio !== null ? [Control.Attack, Control.NextCamera] : []
    );

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
                bottom: '40vh',
                left: display ? '1vw' : '-80vw',
                transition: 'left .3s',
            }}
        >
            <form
                onSubmit={handleSubmit(data => {
                    const frequency = parseInt(data.frequency.toString().replace(/\./g, ''));

                    if (frequency >= 10000 && frequency <= 99999) {
                        fetchNui(NuiEvent.VoipUpdateRadioVehicleChannel, {
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

                        setValue('frequency', frequency.toString().replace(/\./g, '').padEnd(5, '0'));
                    }
                })}
            >
                <img
                    className="relative"
                    style={{ width: '40vw', zIndex: 5, height: '21vh' }}
                    src="/public/images/radio/vehicle.png"
                    alt="radio"
                />
                <div
                    className="absolute"
                    style={{
                        bottom: '6vh',
                        left: '17.3vw',
                        height: '13.2vh',
                        width: '15vw',
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
                    <input
                        type="submit"
                        value=""
                        className="absolute cursor-pointer bg-transparent hover:bg-white/50"
                        style={{
                            WebkitMaskImage: 'radial-gradient(black, rgba(0,0,0,.1), transparent)',
                            maskImage: 'radial-gradient(black, rgba(0,0,0,.1), transparent)',
                            transition: 'background-color .2s',
                            bottom: '2.5vh',
                            left: '10.8vw',
                            height: '7vh',
                            width: '4.5vw',
                        }}
                    />
                    <RadioButton
                        style={{
                            bottom: '13vh',
                            left: '35vw',
                            height: ' 7vh',
                            width: '5vw',
                        }}
                        onClick={() => {
                            fetchNui(NuiEvent.VoipEnableRadioVehicle, { enable: !radio.enabled });
                        }}
                    />
                    <RadioButton
                        style={{
                            bottom: '2vh',
                            left: '17.45vw',
                            height: '2.2vh',
                            width: '2.6vw',
                        }}
                        onClick={() => {
                            const ear =
                                currentChannelType === RadioChannelType.Primary
                                    ? radio.primary.ear
                                    : radio.secondary.ear;
                            const nextEar = ear === Ear.Left ? Ear.Both : ear === Ear.Both ? Ear.Right : Ear.Left;

                            fetchNui(NuiEvent.VoipUpdateRadioVehicleChannel, {
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
                            bottom: '22vh',
                            left: '39vw',
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
                            bottom: '2vh',
                            left: '26.6vw',
                            height: '2.2vh',
                            width: '2.6vw',
                        }}
                        onClick={() => {
                            fetchNui(NuiEvent.VoipUpdateRadioVehicleChannel, {
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
                            bottom: '2vh',
                            left: '29.7vw',
                            height: '2.2vh',
                            width: '2.6vw',
                        }}
                        onClick={() => {
                            fetchNui(NuiEvent.VoipUpdateRadioVehicleChannel, {
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
                            bottom: '2vh',
                            left: '20.5vw',
                            height: '2.2vh',
                            width: '2.6vw',
                        }}
                        onClick={() => {
                            setCurrentChannelType(RadioChannelType.Primary);
                        }}
                    />
                    <RadioButton
                        style={{
                            bottom: '2vh',
                            left: '23.6vw',
                            height: '2.2vh',
                            width: '2.6vw',
                        }}
                        onClick={() => {
                            setCurrentChannelType(RadioChannelType.Secondary);
                        }}
                    />
                </div>
            </form>
        </div>
    );
};
