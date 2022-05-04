import radio_sr from '../../assets/img/radio-sr.png';
import radio_lr from '../../assets/img/radio-lr.png';
import radioStyle from './radio.module.css';
import cibiStyle from './cibi.module.css';
import Screen from "@components/screen";
import {useCallback, useEffect, useState} from "react";
import {Ear, Frequency, FrequencyType} from "../../types/RadioScreen";
import fetchAPI from "../../hooks/fetchAPI";
import {TalkMessageData} from "../../types/TalkMessageEvent";

const CloseIcon: React.FC<any> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
    </svg>
)

const Radio: React.FC<{type: 'radio' | 'cibi'}> = (props) => {
    const [display, setDisplay] = useState<boolean>(false)
    const [enabled, setEnabled] = useState<boolean>(false);
    const [currentFrequency, setCurrentFrequency] = useState<FrequencyType>('primary');
    const [primaryFrequency, setPrimaryFrequency] = useState<Frequency>({frequency: 0.0, volume: 100, ear: Ear.Both});
    const [secondaryFrequency, setSecondaryFrequency] = useState<Frequency>({frequency: 0.0, volume: 100, ear: Ear.Both});

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
                    setPrimaryFrequency(s => ({...s, ...{volume: volume}}))
                } else {
                    setSecondaryFrequency(s => ({...s, ...{volume: volume}}))
                }
            })
        }
    }, [currentFrequency, setPrimaryFrequency, setSecondaryFrequency])
    const handleFrequencyChange = useCallback(() => {
        const frequency = (currentFrequency === 'primary' ? primaryFrequency.frequency : secondaryFrequency.frequency) * 100
        if (frequency >= 10000 && frequency <= 99999) {
            fetchAPI(`/${props.type}/change_frequency`, {
                [currentFrequency]: frequency
            }, () => {})
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
            if (action === 'open') {
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
                    } else {
                        setSecondaryFrequency(s => ({...s, ...{frequency: frequency/100}}))
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

    useEffect(() => {
        window.addEventListener('message', onMessageReceived)

        return () => {
            window.removeEventListener('message', onMessageReceived)
        }
    }, []);

    return (
        <div className={`${style.container} ${display ? style.container_show : style.container_hide}`}>
            <img className={style.radio} src={radio} alt="Radio"/>
            <div className={style.screen}>
                <Screen
                    enabled={enabled}
                    currentFrequency={currentFrequency}
                    primaryFrequency={primaryFrequency}
                    setPrimaryFrequency={setPrimaryFrequency}
                    secondaryFrequency={secondaryFrequency}
                    setSecondaryFrequency={setSecondaryFrequency}
                />
            </div>
            <div className={style.actions}>
                <div className={style.action_enable} onClick={toggleRadio}/>
                <div className={style.action_validate} onClick={handleFrequencyChange}/>
                <div className={style.action_mix} onClick={handleMixChange}/>
                <CloseIcon className={style.action_close} onClick={handleClose}/>

                <div className={style.action_volume_up}
                     onClick={() => handleVolumeChange(currentFrequency === 'primary' ? primaryFrequency.volume + 10 : secondaryFrequency.volume + 10)}/>
                <div className={style.action_volume_down}
                     onClick={() => handleVolumeChange(currentFrequency === 'primary' ? primaryFrequency.volume - 10 : secondaryFrequency.volume - 10)}/>

                <div className={style.action_freq_primary} onClick={() => handleCurrentFrequency('primary')}/>
                <div className={style.action_freq_secondary} onClick={() => handleCurrentFrequency('secondary')}/>
            </div>
        </div>
    )
};

export default Radio;
