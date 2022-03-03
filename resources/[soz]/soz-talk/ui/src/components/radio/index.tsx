import {FunctionalComponent} from 'preact';
import radio from '../../assets/img/radio-sr.png';
import style from './style.module.css';
import Screen from "@components/screen";
import {useCallback, useEffect, useState} from "preact/hooks";
import {Ear, Frequency, FrequencyType} from "../../types/RadioScreen";
import fetchAPI from "../../hooks/fetchAPI";
import {TalkMessageData} from "../../types/TalkMessageEvent";

const Radio: FunctionalComponent = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const [enabled, setEnabled] = useState<boolean>(false);
    const [currentFrequency, setCurrentFrequency] = useState<FrequencyType>('primary');
    const [primaryFrequency, setPrimaryFrequency] = useState<Frequency>({frequency: 0.0, volume: 100, ear: Ear.Both});
    const [secondaryFrequency, setSecondaryFrequency] = useState<Frequency>({frequency: 0.0, volume: 100, ear: Ear.Both});

    const toggleRadio = useCallback(() => {
        fetchAPI('/radio/enable', {state: !enabled}, () => {
            setEnabled(s => !s)
        })
    }, [enabled, setEnabled])
    const handleCurrentFrequency = useCallback((type: FrequencyType) => {
        setCurrentFrequency(type)
    }, [setCurrentFrequency])
    const handleMixChange = useCallback(() => {
        const ear = (currentFrequency === 'primary' ? primaryFrequency.ear : secondaryFrequency.ear)
        let targetEar = Ear[ear+1] !== undefined ? ear+1 : 0

        fetchAPI('/radio/change_ear', {[currentFrequency]: targetEar}, () => {
            if (currentFrequency === 'primary') {
                setPrimaryFrequency(s => ({...s, ...{ear: targetEar}}))
            } else {
                setSecondaryFrequency(s => ({...s, ...{ear: targetEar}}))
            }
        })
    }, [currentFrequency, primaryFrequency, secondaryFrequency, setPrimaryFrequency, setSecondaryFrequency])
    const handleVolumeChange = useCallback((volume: number) => {
        if (volume >= 0 && volume <= 100) {
            fetchAPI('/radio/change_volume', {[currentFrequency]: volume}, () => {
                if (currentFrequency === 'primary') {
                    setPrimaryFrequency(s => ({...s, ...{volume: volume}}))
                } else {
                    setSecondaryFrequency(s => ({...s, ...{volume: volume}}))
                }
            })
        }
    }, [currentFrequency, setPrimaryFrequency, setSecondaryFrequency])
    const handleFrequencyChange = useCallback(() => {
        const frequency = (currentFrequency === 'primary' ? primaryFrequency.frequency : secondaryFrequency.frequency) * 10
        if (frequency >= 1000 && frequency <= 9999) {
            fetchAPI('/radio/change_frequency', {
                [currentFrequency]: frequency
            }, () => {})
        }
    }, [currentFrequency, primaryFrequency, secondaryFrequency])

    /*
    * Events handlers
    */
    const onMessageReceived = useCallback((event: MessageEvent) => {
        const {type, action} = event.data as TalkMessageData;

        if (type === 'radio') {
            if (action === 'open') {
                setDisplay(true)
            } else if (action === 'close') {
                setDisplay(false)
            }
        }
    }, [])

    const onEscapeFunction = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            fetchAPI('/radio/toggle', {state: false}, () => {
                setDisplay(false)
            })
        }
    }, [])

    useEffect(() => {
        window.addEventListener('message', onMessageReceived)
        window.addEventListener('keydown', onEscapeFunction)

        return () => {
            window.removeEventListener('message', onMessageReceived)
            window.removeEventListener('keydown', onEscapeFunction)
        }
    }, []);

    return (
        <div class={`${style.container} ${display ? style.container_show : style.container_hide}`}>
            <img class={style.radio} src={radio} alt="Radio"/>
            <div class={style.screen}>
                <Screen
                    enabled={enabled}
                    currentFrequency={currentFrequency}
                    primaryFrequency={primaryFrequency}
                    setPrimaryFrequency={setPrimaryFrequency}
                    secondaryFrequency={secondaryFrequency}
                    setSecondaryFrequency={setSecondaryFrequency}
                />
            </div>
            <div class={style.actions}>
                <div class={style.action_enable} onClick={toggleRadio}/>
                <div class={style.action_validate} onClick={handleFrequencyChange}/>
                <div class={style.action_mix} onClick={handleMixChange}/>

                <div class={style.action_volume_up}
                     onClick={() => handleVolumeChange(currentFrequency === 'primary' ? primaryFrequency.volume + 10 : secondaryFrequency.volume + 10)}/>
                <div class={style.action_volume_down}
                     onClick={() => handleVolumeChange(currentFrequency === 'primary' ? primaryFrequency.volume - 10 : secondaryFrequency.volume - 10)}/>

                <div class={style.action_freq_primary} onClick={() => handleCurrentFrequency('primary')}/>
                <div class={style.action_freq_secondary} onClick={() => handleCurrentFrequency('secondary')}/>
            </div>
        </div>
    )
};

export default Radio;
