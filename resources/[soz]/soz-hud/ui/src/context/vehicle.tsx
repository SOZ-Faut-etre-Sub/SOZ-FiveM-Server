import {createContext, useCallback, useMemo, useState, FunctionComponent, PropsWithChildren} from "react";

export const VehicleDataContext = createContext({
    speed: 0,
    fuel: 0,
    seatbelt: false,
    lightState: 0,
    updateSpeed: (s: number) => {},
    updateFuel: (f: number) => {},
    updateSeatbelt: (s: boolean) => {},
    updateLightState: (l: number) => {}
})

const VehicleDataProvider: FunctionComponent<PropsWithChildren<{}>> = ({children}) => {
    const [speed, setSpeed] = useState<number>(0)
    const [fuel, setFuel] = useState<number>(0)
    const [seatbelt, setSeatbelt] = useState<boolean>(false)
    const [lightState, setLightState] = useState<number>(0)

    const updateSpeed = useCallback((s: number) => setSpeed(s), [setSpeed])
    const updateFuel = useCallback((f: number) => setFuel(f), [setFuel])
    const updateSeatbelt = useCallback((s: boolean) => setSeatbelt(s), [setSeatbelt])
    const updateLightState = useCallback((l: number) => setLightState(l), [setLightState])

    const value = useMemo(function () {
        return {
            speed, fuel, seatbelt, lightState,
            updateSpeed, updateFuel, updateSeatbelt, updateLightState
        }
    }, [speed, fuel, seatbelt, lightState, updateSpeed, updateFuel, updateSeatbelt, updateLightState])

    return (
        <VehicleDataContext.Provider value={value} >
            { children }
        </VehicleDataContext.Provider>
    )
}

export default VehicleDataProvider;
