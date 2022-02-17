import {FunctionalComponent} from 'preact';
import {RoutableProps} from "preact-router";
import radio from '../../assets/img/radio-sr.png';
import style from './style.module.css';
import Screen from "@components/screen";
import {useCallback, useState} from "preact/hooks";
import {Frequency, FrequencyType} from "../../types/RadioScreen";
import fetchAPI from "../../hooks/fetchAPI";


const Radio: FunctionalComponent<RoutableProps> = () => {
    const [enabled, setEnabled] = useState<boolean>(false);
    const [currentFrequency, setCurrentFrequency] = useState<FrequencyType>('primary');
    const [primaryFrequency, setPrimaryFrequency] = useState<Frequency>({frequency: 100.0, volume: 100});
    const [secondaryFrequency, setSecondaryFrequency] = useState<Frequency>({frequency: 100.0, volume: 100});

    const toggleRadio = useCallback(() => {
        fetchAPI('/toggle', {}, () => {
            setEnabled(s => !s)
        })
    }, [])

    const updateCurrentFrequency = useCallback((type) => {
        fetchAPI('/current_frequency', {}, () => {
            setCurrentFrequency(type)
        })
    }, [])

    return (
        <div class={style.container}>
            <img class={style.radio} src={radio} alt="Radio"/>
            <div class={style.screen}>
                <Screen enabled={enabled} currentFrequency={currentFrequency} primaryFrequency={primaryFrequency} secondaryFrequency={secondaryFrequency} />
            </div>
            <div class={style.action_enable} onclick={toggleRadio} />
            <div class={style.action_freq_primary} onclick={() => updateCurrentFrequency('primary')} />
            <div class={style.action_freq_secondary} onclick={() => updateCurrentFrequency('secondary')} />
        </div>
    )
};

export default Radio;
