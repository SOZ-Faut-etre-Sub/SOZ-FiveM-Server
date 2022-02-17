import {FunctionalComponent} from 'preact';
import {RadioScreen} from "../../types/RadioScreen";
import style from './style.module.css';

const VolumeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
              clip-rule="evenodd"/>
    </svg>
)

const Screen: FunctionalComponent<RadioScreen> = ({ enabled, currentFrequency, primaryFrequency, secondaryFrequency }) => (
    <div class={`${style.screen} ${enabled ? style.enabled : ''}`}>
        {enabled && (
            <>
                <div className={style.frequency}>
                    <span>{currentFrequency === 'primary' ? 'F1' : 'F2'}</span>
                    <span>{(currentFrequency === 'primary' ? primaryFrequency.frequency : secondaryFrequency.frequency).toFixed(1)}</span>
                </div>
                <span className={style.volume}>
                    <VolumeIcon />
                    {currentFrequency === 'primary' ? primaryFrequency.volume : secondaryFrequency.volume}%
                </span>
            </>
        )}
    </div>
)

export default Screen;
