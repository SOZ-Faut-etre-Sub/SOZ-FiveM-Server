import {FunctionalComponent} from 'preact';
import {Ear, RadioScreen} from "../../types/RadioScreen";
import style from './style.module.css';
import {useCallback} from "preact/hooks";

const VolumeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
              clip-rule="evenodd"/>
    </svg>
)

const HeadphoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
        <path d="M512 287.9l-.0042 112C511.1 444.1 476.1 480 432 480c-26.47 0-48-21.56-48-48.06V304.1C384 277.6 405.5 256 432 256c10.83 0 20.91 2.723 30.3 6.678C449.7 159.1 362.1 80.13 256 80.13S62.29 159.1 49.7 262.7C59.09 258.7 69.17 256 80 256C106.5 256 128 277.6 128 304.1v127.9C128 458.4 106.5 480 80 480c-44.11 0-79.1-35.88-79.1-80.06L0 288c0-141.2 114.8-256 256-256c140.9 0 255.6 114.5 255.1 255.3C511.1 287.5 511.1 287.7 512 287.9z"/>
    </svg>
)

const Screen: FunctionalComponent<RadioScreen> = ({
    enabled,
    currentFrequency,
    primaryFrequency,
    setPrimaryFrequency,
    secondaryFrequency,
    setSecondaryFrequency
}) => {
    const handleFrequencyChange = useCallback((e: any) => { // TODO find better type
        let frequencyValue = currentFrequency === 'primary' ? primaryFrequency.frequency : secondaryFrequency.frequency
        if (/^[0-9]{3}\.[0-9]$/.test(e.target.value)) {
            frequencyValue = parseFloat(e.target.value)
        }
        if (currentFrequency === 'primary') {
            setPrimaryFrequency(s => ({...s, ...{frequency: frequencyValue}}))
        } else {
            setSecondaryFrequency(s => ({...s, ...{frequency: frequencyValue}}))
        }
    }, [currentFrequency, setPrimaryFrequency, setSecondaryFrequency])

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

    return (
        <div class={`${style.screen} ${enabled ? style.enabled : ''}`}>
            {enabled && (
                <>
                    <div className={style.frequency}>
                        <span>{currentFrequency === 'primary' ? 'F1' : 'F2'}</span>
                        <input
                            type="text"
                            maxLength={5}
                            value={(currentFrequency === 'primary' ? primaryFrequency.frequency : secondaryFrequency.frequency).toFixed(1)}
                            onChange={handleFrequencyChange}
                        />
                    </div>
                    <span className={style.meta}>
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
    )
}

export default Screen;
