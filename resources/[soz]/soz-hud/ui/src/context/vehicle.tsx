import {createContext, useCallback, useMemo, useState, FunctionComponent, PropsWithChildren} from "react";

export const VehicleDataContext = createContext({
    speed: 0,
    fuel: 0,
    engine: 0,
    oil: 0,
    lock: false,
    seatbelt: false,
    lightState: 0,
    hasFuel: false,
    fuelType: 'essence',
    updateSpeed: (s: number) => {},
    updateFuel: (f: number) => {},
    updateEngine: (e: number) => {},
    updateOil: (o: number) => {},
    updateLock: (l: boolean) => {},
    updateSeatbelt: (s: boolean) => {},
    updateLightState: (l: number) => {},
    updateHasFuel: (f: boolean) => {},
    updateFuelType: (s: string) => {}
})

const VehicleDataProvider: FunctionComponent<PropsWithChildren<{}>> = ({children}) => {
    const [speed, setSpeed] = useState<number>(0)
    const [fuel, setFuel] = useState<number>(0)
    const [engine, setEngine] = useState<number>(1000)
    const [oil, setOil] = useState<number>(100)
    const [lock, setLock] = useState<boolean>(false)
    const [seatbelt, setSeatbelt] = useState<boolean>(false)
    const [lightState, setLightState] = useState<number>(0)
    const [hasFuel, setHasFuel] = useState<boolean>(false)
    const [fuelType, setFuelType] = useState<string>('essence')

    const updateSpeed = useCallback((s: number) => setSpeed(s), [setSpeed])
    const updateFuel = useCallback((f: number) => setFuel(f), [setFuel])
    const updateEngine = useCallback((e: number) => setEngine(e), [setEngine])
    const updateOil = useCallback((o: number) => setOil(o), [setOil])
    const updateLock = useCallback((l: boolean) => setLock(l), [setLock])
    const updateSeatbelt = useCallback((s: boolean) => setSeatbelt(s), [setSeatbelt])
    const updateLightState = useCallback((l: number) => setLightState(l), [setLightState])
    const updateHasFuel = useCallback((s: boolean) => setHasFuel(s), [setHasFuel])
    const updateFuelType = useCallback((s: string) => setFuelType(s), [setFuelType])

    const value = useMemo(function () {
        return {
            speed, fuel, engine, oil, lock, seatbelt, lightState, hasFuel, fuelType,
            updateSpeed, updateFuel, updateEngine, updateOil, updateLock, updateSeatbelt, updateLightState, updateHasFuel, updateFuelType
        }
    }, [speed, fuel, engine, lock, seatbelt, lightState, hasFuel, fuelType, updateSpeed, updateFuel, updateEngine, updateLock, updateSeatbelt, updateLightState, updateHasFuel, updateFuelType])

    return (
        <VehicleDataContext.Provider value={value} >
            { children }
        </VehicleDataContext.Provider>
    )
}

export default VehicleDataProvider;
