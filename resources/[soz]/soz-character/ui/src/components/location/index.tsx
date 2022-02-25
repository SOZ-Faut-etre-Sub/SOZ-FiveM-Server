import style from './style.module.css'
import {useCallback, useContext} from "preact/hooks";
import {SpawnContext} from "../../context/spawn";
import SpawnList from "../../config/spawn";
import fetchAPI from "../../hooks/fetchAPI";
import {ComponentProps, FunctionalComponent} from "preact";

const LocationPicker = () => {
    const {updateSpawn} = useContext(SpawnContext)

    return (
        <div>
            {SpawnList.filter(s => s.identifier !== 'default').map(s => (
                <div class={style.icon} style={s.waypoint && {top: s.waypoint.top, left: s.waypoint.left}} onClick={() => updateSpawn(s)}>
                    <svg height='2rem' width='2rem' fill='currentColor' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path d="M168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2H168.3zM192 256C227.3 256 256 227.3 256 192C256 156.7 227.3 128 192 128C156.7 128 128 156.7 128 192C128 227.3 156.7 256 192 256z"/>
                    </svg>
                </div>
            ))}
        </div>
    );
}

const LocationPreview: FunctionalComponent<ComponentProps<any>> = (props) => {
    const {spawn} = useContext(SpawnContext)

    const ValidateSpawn = useCallback(() => {
        fetchAPI('/SpawnPlayer', {SpawnId: spawn.identifier})
    }, [spawn, fetchAPI])

    return (
        <section class={style.container} style={props.style}>
            <div class={style.preview} style={{backgroundImage: `url(${spawn.image})`}} />
            <h3 class={style.title}>{spawn.name}</h3>
            <h4 class={style.description}>{spawn.description}</h4>
            <div class={style.button} style={{
                transition: "all .5s",
                opacity: spawn.identifier !== 'default' ? '1' : '0',
                top: spawn.identifier !== 'default' ? '0vh' : '-10vh'
            }}>
                <div onClick={ValidateSpawn}>Choisir ce point de démarrage</div>
            </div>
        </section>
    );
}

export {LocationPreview, LocationPicker}
