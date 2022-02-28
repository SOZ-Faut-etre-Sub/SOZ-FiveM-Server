import {useCallback, useEffect, useState} from "preact/hooks";
import PlayerNeeds from "./playerNeeds";
import SpeedoMeter from "./speedometer";
import VoiceIndicator from "./voiceIndicator";
import VoiceModeProvider from "../context/voice";
import VehicleDataProvider from "../context/vehicle";
import PlayerProvider from "../context/player";
import GameProvider from "../context/game";
import Minimap from "./hud/minimap";
import Notifications from "./hud/notifications";


const App = () => {
    const [displayHUD, setDisplayHUD] = useState<boolean>(false)

    const onMessageReceived = useCallback((event: MessageEvent) => {
        if (event.data.action === 'display') setDisplayHUD(event.data.show)
    }, [])

    useEffect(() => {
        window.addEventListener('message', onMessageReceived)

        return () => window.removeEventListener('message', onMessageReceived)
    }, []);

    return (
        <GameProvider>
            <PlayerProvider>
                <VoiceModeProvider>
                    <VehicleDataProvider>
                        <main style={{transition: "opacity .5s", opacity: displayHUD ? 1.0 : 0.0}}>
                            <Notifications />
                            <Minimap />
                            <VoiceIndicator />
                            <PlayerNeeds />
                            <SpeedoMeter />
                        </main>
                    </VehicleDataProvider>
                </VoiceModeProvider>
            </PlayerProvider>
        </GameProvider>
    )
}

export default App;
