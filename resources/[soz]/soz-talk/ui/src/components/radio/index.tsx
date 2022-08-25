import radio_sr from '../../assets/img/radio-sr.png';
import radio_lr from '../../assets/img/radio-lr.png';
import radioStyle from './radio.module.css';
import cibiStyle from './cibi.module.css';
import screen from './screen.module.css';
import {useCallback, useEffect, useState} from "react";
import {Ear, Frequency, FrequencyType} from "../../types/RadioScreen";
import fetchAPI from "../../hooks/fetchAPI";
import {TalkMessageData} from "../../types/TalkMessageEvent";
import { useForm, Controller } from "react-hook-form";
import NumberFormat from "react-number-format";

const CloseIcon: React.FC<any> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
    </svg>
)

const VolumeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
              clipRule="evenodd"/>
    </svg>
)

const HeadphoneIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
        <path d="M512 287.9l-.0042 112C511.1 444.1 476.1 480 432 480c-26.47 0-48-21.56-48-48.06V304.1C384 277.6 405.5 256 432 256c10.83 0 20.91 2.723 30.3 6.678C449.7 159.1 362.1 80.13 256 80.13S62.29 159.1 49.7 262.7C59.09 258.7 69.17 256 80 256C106.5 256 128 277.6 128 304.1v127.9C128 458.4 106.5 480 80 480c-44.11 0-79.1-35.88-79.1-80.06L0 288c0-141.2 114.8-256 256-256c140.9 0 255.6 114.5 255.1 255.3C511.1 287.5 511.1 287.7 512 287.9z"/>
    </svg>
)

const displayEar = (ear: Ear) => {
    switch (ear) {
        case Ear.Left:
            return 'L'
        case Ear.Both:
            return 'L/R'
        case Ear.Right:
            return 'R'
    }
}

const Radio: React.FC<{type: 'radio' | 'cibi'}> = (props) => {
    const [display, setDisplay] = useState<boolean>(false)
    const [enabled, setEnabled] = useState<boolean>(false);
    const [currentFrequency, setCurrentFrequency] = useState<FrequencyType>('primary');
    const [primaryFrequency, setPrimaryFrequency] = useState<Frequency>({frequency: 0.0, volume: 100, ear: Ear.Both});
    const [secondaryFrequency, setSecondaryFrequency] = useState<Frequency>({frequency: 0.0, volume: 100, ear: Ear.Both});

    const {control, handleSubmit, formState: { errors }, setValue} = useForm();

    /* Design */
    const radio = props.type === 'radio' ? radio_sr : radio_lr
    const style = props.type === 'radio' ? radioStyle : cibiStyle

    const toggleRadio = useCallback(() => {
        fetchAPI(`/${props.type}/enable`, {state: !enabled}, () => {
            setEnabled(s => !s)
        })
    }, [enabled, setEnabled])
    const handleCurrentFrequency = useCallback((type: FrequencyType) => {
        setCurrentFrequency(type)
    }, [setCurrentFrequency])
    const handleMixChange = useCallback(() => {
        const ear = (currentFrequency === 'primary' ? primaryFrequency.ear : secondaryFrequency.ear)
        let targetEar = Ear[ear+1] !== undefined ? ear+1 : 0

        fetchAPI(`/${props.type}/change_ear`, {[currentFrequency]: targetEar}, () => {
            if (currentFrequency === 'primary') {
                setPrimaryFrequency(s => ({...s, ...{ear: targetEar}}))
            } else {
                setSecondaryFrequency(s => ({...s, ...{ear: targetEar}}))
            }
        })
    }, [currentFrequency, primaryFrequency, secondaryFrequency, setPrimaryFrequency, setSecondaryFrequency])
    const handleVolumeChange = useCallback((volume: number) => {
        if (volume >= 0 && volume <= 100) {
            fetchAPI(`/${props.type}/change_volume`, {[currentFrequency]: volume}, () => {
                if (currentFrequency === 'primary') {
                    setPrimaryFrequency(s => ({...s, ...{volume}}))
                } else {
                    setSecondaryFrequency(s => ({...s, ...{volume}}))
                }
            })
        }
    }, [currentFrequency, setPrimaryFrequency, setSecondaryFrequency])
    const handleFrequencyChange = useCallback((data: any) => {
        const input = currentFrequency === 'primary' ? data.primaryFrequency : data.secondaryFrequency
        const frequency = parseInt(input.toString().replace(/\./g, ''))
        if (frequency >= 10000 && frequency <= 99999) {
            fetchAPI(`/${props.type}/change_frequency`, {
                [currentFrequency]: frequency
            }, () => {
                if (currentFrequency === 'primary') {
                    setPrimaryFrequency(s => ({...s, ...{frequency: frequency}}))
                } else {
                    setSecondaryFrequency(s => ({...s, ...{frequency: frequency}}))
                }
            })
        } else {
            if (currentFrequency === 'primary') {
                setValue('primaryFrequency', primaryFrequency.frequency.toString().replace(/\./g, '').padEnd(5, '0'))
            } else {
                setValue('secondaryFrequency', secondaryFrequency.frequency.toString().replace(/\./g, '').padEnd(5, '0'))
            }
        }
    }, [currentFrequency, primaryFrequency, secondaryFrequency])
    const handleClose = useCallback(() => {
        fetchAPI(`/${props.type}/toggle`, {state: false}, () => {
            setDisplay(false)
        })
    }, [setDisplay])

    /*
    * Events handlers
    */
    const onMessageReceived = useCallback((event: MessageEvent) => {
        const {type, action, frequency, volume, ear, isPrimary, isEnabled} = event.data as TalkMessageData;

        if (type === props.type) {
            if (action === 'reset') {
                setDisplay(false)
                setEnabled(false)
                setCurrentFrequency('primary')
                setPrimaryFrequency({frequency: 0.0, volume: 100, ear: Ear.Both})
                setSecondaryFrequency({frequency: 0.0, volume: 100, ear: Ear.Both})
                setValue('primaryFrequency', '00000')
                setValue('secondaryFrequency', '00000')
            } else if (action === 'open') {
                setDisplay(true)
            } else if (action === 'close') {
                setDisplay(false)
            } else if (action === 'enabled') {
                if (isEnabled !== undefined) {
                    setEnabled(isEnabled)
                }
            } else if (action === 'frequency_change') {
                if (frequency) {
                    if (isPrimary) {
                        setPrimaryFrequency(s => ({...s, ...{frequency: frequency/100}}))
                        setValue('primaryFrequency', frequency)
                    } else {
                        setSecondaryFrequency(s => ({...s, ...{frequency: frequency/100}}))
                        setValue('secondaryFrequency', frequency)
                    }
                }
            } else if (action === 'volume_change') {
                if (volume) {
                    if (isPrimary) {
                        setPrimaryFrequency(s => ({...s, ...{volume}}))
                    } else {
                        setSecondaryFrequency(s => ({...s, ...{volume}}))
                    }
                }
            } else if (action === 'ear_change') {
                if (ear) {
                    if (isPrimary) {
                        setPrimaryFrequency(s => ({...s, ...{ear}}))
                    } else {
                        setSecondaryFrequency(s => ({...s, ...{ear}}))
                    }
                }
            }
        }
    }, [])
    const onKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Tab') event.preventDefault();
    }, [])

    useEffect(() => {
        window.addEventListener('message', onMessageReceived)
        window.addEventListener('keydown', onKeyDown)

        return () => {
            window.removeEventListener('message', onMessageReceived)
            window.removeEventListener('keydown', onKeyDown)
        }
    }, []);

    return (
        <div className={`${style.container} ${display ? style.container_show : style.container_hide}`}>
            <form onSubmit={handleSubmit(handleFrequencyChange)}>
                <img className={style.radio} src={radio} alt="Radio"/>
                <div className={style.screen}>
                    <div className={`${screen.screen} ${enabled ? screen.enabled : ''}`}>
                        {enabled && (
                            <>
                                <div className={screen.frequency}>
                                    <span>{currentFrequency === 'primary' ? 'F1' : 'F2'}</span>
                                        {currentFrequency === 'primary' && <Controller
                                            control={control}
                                            name="primaryFrequency"
                                            render={({field: {onChange, name, value}}) => (
                                                <NumberFormat
                                                    format="###.##"
                                                    defaultValue="000.00"
                                                    name={name}
                                                    value={value}
                                                    onChange={onChange}
                                                />
                                            )}
                                        />}
                                        {currentFrequency === 'secondary' && <Controller
                                            control={control}
                                            name="secondaryFrequency"
                                            render={({field: {onChange, name, value}}) => (
                                                <NumberFormat
                                                    format="###.##"
                                                    defaultValue="000.00"
                                                    name={name}
                                                    value={value}
                                                    onChange={onChange}
                                                />
                                            )}
                                        />}
                                </div>
                                <span className={screen.meta}>
                            <div>
                                <VolumeIcon/>
                                {currentFrequency === 'primary' ? primaryFrequency.volume : secondaryFrequency.volume}%
                            </div>
                            <div>
                                <HeadphoneIcon />
                                {currentFrequency === 'primary' ? displayEar(primaryFrequency.ear) : displayEar(secondaryFrequency.ear)}
                            </div>
                        </span>
                            </>
                        )}
                    </div>
                </div>
                <div className={style.actions}>
                    <input type="submit" value="" className={style.action_validate}/>
                    <div className={style.action_enable} onClick={toggleRadio}/>
                    <div className={style.action_mix} onClick={handleMixChange}/>
                    <CloseIcon className={style.action_close} onClick={handleClose}/>

                    <div className={style.action_volume_up}
                         onClick={() => handleVolumeChange(currentFrequency === 'primary' ? primaryFrequency.volume + 10 : secondaryFrequency.volume + 10)}/>
                    <div className={style.action_volume_down}
                         onClick={() => handleVolumeChange(currentFrequency === 'primary' ? primaryFrequency.volume - 10 : secondaryFrequency.volume - 10)}/>

                    <div className={style.action_freq_primary} onClick={() => handleCurrentFrequency('primary')}/>
                    <div className={style.action_freq_secondary} onClick={() => handleCurrentFrequency('secondary')}/>
                </div>
            </form>
        </div>
    )
};

export default Radio;
