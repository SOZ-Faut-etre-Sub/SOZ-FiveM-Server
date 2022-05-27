import {useCallback, useEffect, useState} from "react";
import style from '../style/app.module.css';
import SpawnProvider from "../context/spawn";
import {LocationPicker, LocationPreview} from "./location";


const App = () => {
    const [display, setDisplay] = useState<boolean>(false);

    const onMessageReceived = useCallback((event: MessageEvent) => {
        if (event.data.action === 'open') setDisplay(true);
        if (event.data.action === 'close') setDisplay(false);
    }, [])

    useEffect(() => {
        window.addEventListener('message', onMessageReceived);

        return () => window.removeEventListener('message', onMessageReceived);
    }, []);

    return (
        <SpawnProvider>
            <main className={style.app} style={{transition: "opacity .5s", opacity: display ? 1.0 : 0.0}}>
                <header className={style.header} style={{transition: "transform .5s", transform: display ? 'translateY(0)' : 'translateY(1vh)'}}>
                    <h1>Démarrage</h1>
                    <h2>Los Santos</h2>
                </header>
                <LocationPreview style={{position: 'relative', transition: "transform .5s", transform: display ? 'translateY(0)' : 'translateY(-1vh)'}} />
                <LocationPicker />
                <footer className={style.footer}>
                    <div className={style.corner_top_right}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="71.927" height="71.126" viewBox="0 0 71.927 71.126">
                            <path id="Path_7" data-name="Path 7" d="M61.5,959.681l-2.171,3.894v9.506l-1.374,5.612v24.51l-2.291,4.925v22.678H83.037l3.894-1.947H120.6l6.987-2.291H61.5Z" transform="translate(127.591 1030.807) rotate(180)" fill="#46ea18"/>
                        </svg>
                    </div>
                    <div className={style.corner_bottom_left}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="71.927" height="71.126" viewBox="0 0 71.927 71.126">
                            <path id="Path_4" data-name="Path 4" d="M61.5,959.681l-2.171,3.894v9.506l-1.374,5.612v24.51l-2.291,4.925v22.678H83.037l3.894-1.947H120.6l6.987-2.291H61.5Z" transform="translate(-55.664 -959.681)" fill="#46ea18"/>
                        </svg>
                    </div>
                </footer>
            </main>
        </SpawnProvider>
    )
}

export default App;
