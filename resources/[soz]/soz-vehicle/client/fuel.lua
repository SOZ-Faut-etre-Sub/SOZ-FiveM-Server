local QBCore = exports["qb-core"]:GetCoreObject()
local isNearPump = false
local isFueling = false
local currentFuel = 0.0
local currentmoney = 0
local fuelSynced = false

function FindNearestFuelPump()
    local coords = GetEntityCoords(PlayerPedId())
    local fuelPumps = {}
    local handle, object = FindFirstObject()
    local success
    repeat
        if Config.PumpModels[GetEntityModel(object)] then
            table.insert(fuelPumps, object)
        end
        success, object = FindNextObject(handle, object)
    until not success
    EndFindObject(handle)
    local pumpObject = 0
    local pumpDistance = 1000
    for _, fuelPumpObject in pairs(fuelPumps) do
        local dstcheck = #(coords - GetEntityCoords(fuelPumpObject))
        if dstcheck < pumpDistance then
            pumpDistance = dstcheck
            pumpObject = fuelPumpObject
        end
    end
    return pumpObject, pumpDistance
end

function ManageFuelUsage(vehicle)
    if not DecorExistOn(vehicle, Config.FuelDecor) then
        SetFuel(vehicle, math.random(200, 800) / 10)
    elseif not fuelSynced then
        SetFuel(vehicle, GetFuel(vehicle))
        fuelSynced = true
    end
    if IsVehicleEngineOn(vehicle) then
        SetFuel(vehicle, GetVehicleFuelLevel(vehicle) - Config.FuelUsage[Round(GetVehicleCurrentRpm(vehicle), 1)] *
                    (Config.Classes[GetVehicleClass(vehicle)] or 1.0) / 10)
    end
end

CreateThread(function()
    DecorRegister(Config.FuelDecor, 1)
    while true do
        Wait(1000)
        local ped = PlayerPedId()
        if IsPedInAnyVehicle(ped) then
            local vehicle = GetVehiclePedIsIn(ped)
            if GetPedInVehicleSeat(vehicle, -1) == ped then
                ManageFuelUsage(vehicle)
            end
        else
            if fuelSynced then
                fuelSynced = false
            end
        end
    end
end)

CreateThread(function()
    while true do
        Wait(250)
        local pumpObject, pumpDistance = FindNearestFuelPump()
        if pumpDistance < 2.5 then
            isNearPump = pumpObject
            currentmoney = QBCore.Functions.GetPlayerData().money["money"]
        else
            isNearPump = false
            Wait(math.ceil(pumpDistance * 20))
        end
    end
end)

AddEventHandler("fuel:refuelFromPump", function(pumpObject, ped, vehicle)

    currentFuel = GetVehicleFuelLevel(vehicle)
    local fueldiff = (100 - currentFuel) / 100
    local cout = math.floor(fueldiff * Config.RefillCost)
    local fuelinputcout = exports["soz-hud"]:Input(("Combien d'argent mettre? (max %s $)"):format(cout), 2, cout)
    if not fuelinputcout == nil then
        if (tonumber(currentmoney) >= tonumber(fuelinputcout)) then
            if (tonumber(fuelinputcout) <= cout) then
                TaskTurnPedToFaceEntity(ped, vehicle, 1000)
                Wait(1000)
                SetCurrentPedWeapon(ped, -1569615261, true)
                LoadAnimDict("timetable@gardener@filling_can")
                TaskPlayAnim(ped, "timetable@gardener@filling_can", "gar_ig_5_filling_can", 2.0, 8.0, -1, 50, 0, 0, 0, 0)

                local newFuel = currentFuel + ((fuelinputcout / Config.RefillCost) * 100)
                SetFuel(vehicle, newFuel)

                if pumpObject then
                    TriggerServerEvent("fuel:pay", tonumber(fuelinputcout), GetPlayerServerId(PlayerId()))
                end
                QBCore.Functions.Progressbar("plein_vehicle", "Plein en cours..", (fuelinputcout * 500), false, false, {
                    disableMovement = true,
                    disableCarMovement = true,
                    disableMouse = false,
                    disableCombat = true,
                }, {}, {}, {}, function()
                    ClearPedTasks(ped)
                    RemoveAnimDict("timetable@gardener@filling_can")
                    isFueling = false
                end, function()
                    QBCore.Functions.Notify("Echec", "error")
                    isFueling = false
                end)
                while isFueling do
                    if DoesEntityExist(GetPedInVehicleSeat(vehicle, -1)) or (isNearPump and GetEntityHealth(pumpObject) <= 0) then
                        isFueling = false
                    end
                    Wait(0)
                end
            else
                TriggerEvent("QBCore:Notify", "Vous avez mis trop d'argent", "error")
                isFueling = false
            end
        else
            TriggerEvent("QBCore:Notify", "Pas assez d'argent", "error")
            isFueling = false
        end
    end
end)

local GasModels = {
    -469694731,
    -462817101,
    -462817101,
    -462817101,
    -462817101,
    -469694731,
    -469694731,
    -164877493,
    1694452750,
    1339433404,
    -469694731,
    1339433404,
    1933174915,
    1339433404,
    -2007231801,
    1933174915,
    -2007231801,
    1933174915,
    -2007231801,
    1339433404,
    1339433404,
    1933174915,
    1694452750,
    1339433404,
    1339433404,
    1694452750,
    1339433404,
    -462817101,
}

local zones = {
    BoxZone:Create(vector3(49.4187, 2778.793, 57.043), 15, 15, {
        name = "Fuel1",
        heading = 60.0,
        debugPoly = true,
        minZ = 57.0,
        maxZ = 61.0,
    }),
    BoxZone:Create(vector3(263.894, 2606.463, 43.983), 15, 15, {
        name = "Fuel2",
        heading = 280.0,
        debugPoly = true,
        minZ = 43.9,
        maxZ = 47.9,
    }),
    BoxZone:Create(vector3(1039.958, 2671.134, 38.550), 25, 25, {
        name = "Fuel3",
        heading = 260.0,
        debugPoly = true,
        minZ = 38.5,
        maxZ = 42.5,
    }),
    BoxZone:Create(vector3(1207.260, 2660.175, 36.899), 15, 15, {
        name = "Fuel4",
        heading = 40.0,
        debugPoly = true,
        minZ = 36.8,
        maxZ = 40.8,
    }),
    BoxZone:Create(vector3(2539.685, 2594.192, 36.944), 15, 15, {
        name = "Fuel5",
        heading = 20.0,
        debugPoly = true,
        minZ = 36.9,
        maxZ = 40.9,
    }),
    BoxZone:Create(vector3(2679.858, 3263.946, 54.240), 15, 15, {
        name = "Fuel6",
        heading = 150.0,
        debugPoly = true,
        minZ = 54.2,
        maxZ = 58.2,
    }),
    BoxZone:Create(vector3(2005.055, 3773.887, 31.403), 20, 20, {
        name = "Fuel7",
        heading = 120.0,
        debugPoly = true,
        minZ = 31.4,
        maxZ = 35.4,
    }),
    BoxZone:Create(vector3(1687.156, 4929.392, 41.078), 15, 15, {
        name = "Fuel8",
        heading = 320.0,
        debugPoly = true,
        minZ = 41.0,
        maxZ = 45.0,
    }),
    BoxZone:Create(vector3(1701.314, 6416.028, 31.763), 20, 20, {
        name = "Fuel9",
        heading = 60.0,
        debugPoly = true,
        minZ = 31.7,
        maxZ = 35.7,
    }),
    BoxZone:Create(vector3(179.857, 6602.839, 30.868), 30, 30, {
        name = "Fuel10",
        heading = 5.0,
        debugPoly = true,
        minZ = 30.8,
        maxZ = 34.8,
    }),
    BoxZone:Create(vector3(-94.4619, 6419.594, 30.489), 15, 15, {
        name = "Fuel11",
        heading = 310.0,
        debugPoly = true,
        minZ = 30.4,
        maxZ = 34.4,
    }),
    BoxZone:Create(vector3(-2554.996, 2334.40, 32.078), 15, 35, {
        name = "Fuel12",
        heading = 270.0,
        debugPoly = true,
        minZ = 32.0,
        maxZ = 36.0,
    }),
    BoxZone:Create(vector3(-1800.375, 803.661, 137.651), 25, 35, {
        name = "Fuel13",
        heading = 40.0,
        debugPoly = true,
        minZ = 137.6,
        maxZ = 141.6,
    }),
    BoxZone:Create(vector3(-1437.622, -276.747, 45.207), 20, 20, {
        name = "Fuel14",
        heading = 37.0,
        debugPoly = true,
        minZ = 45.2,
        maxZ = 49.2,
    }),
    BoxZone:Create(vector3(-2096.243, -320.286, 12.168), 30, 35, {
        name = "Fuel15",
        heading = 170.0,
        debugPoly = true,
        minZ = 12.1,
        maxZ = 16.1,
    }),
    BoxZone:Create(vector3(-724.619, -935.1631, 18.213), 20, 30, {
        name = "Fuel16",
        heading = 0.0,
        debugPoly = true,
        minZ = 18.2,
        maxZ = 22.2,
    }),
    BoxZone:Create(vector3(-526.019, -1211.003, 17.184), 20, 20, {
        name = "Fuel17",
        heading = 60.0,
        debugPoly = true,
        minZ = 17.1,
        maxZ = 21.1,
    }),
    BoxZone:Create(vector3(-70.2148, -1761.792, 28.534), 25, 35, {
        name = "Fuel18",
        heading = 160.0,
        debugPoly = true,
        minZ = 28.5,
        maxZ = 32.5,
    }),
    BoxZone:Create(vector3(265.648, -1261.309, 28.292), 30, 35, {
        name = "Fuel19",
        heading = 0.0,
        debugPoly = true,
        minZ = 28.2,
        maxZ = 32.2,
    }),
    BoxZone:Create(vector3(819.653, -1028.846, 25.403), 25, 25, {
        name = "Fuel20",
        heading = 175.0,
        debugPoly = true,
        minZ = 25.4,
        maxZ = 29.4,
    }),
    BoxZone:Create(vector3(1208.951, -1402.567, 34.224), 15, 15, {
        name = "Fuel21",
        heading = 133.0,
        debugPoly = true,
        minZ = 34.2,
        maxZ = 38.2,
    }),
    BoxZone:Create(vector3(1181.381, -330.847, 68.316), 20, 35, {
        name = "Fuel22",
        heading = 95.0,
        debugPoly = true,
        minZ = 68.3,
        maxZ = 72.3,
    }),
    BoxZone:Create(vector3(620.843, 269.100, 102.089), 25, 35, {
        name = "Fuel23",
        heading = 178.0,
        debugPoly = true,
        minZ = 102.0,
        maxZ = 106.0,
    }),
    BoxZone:Create(vector3(2581.321, 362.039, 107.468), 25, 35, {
        name = "Fuel24",
        heading = 178.0,
        debugPoly = true,
        minZ = 107.4,
        maxZ = 111.4,
    }),
    BoxZone:Create(vector3(176.631, -1562.025, 28.263), 20, 20, {
        name = "Fuel25",
        heading = 130.0,
        debugPoly = true,
        minZ = 28.2,
        maxZ = 32.2,
    }),
    BoxZone:Create(vector3(-319.292, -1471.715, 29.549), 20, 35, {
        name = "Fuel26",
        heading = 28.0,
        debugPoly = true,
        minZ = 29.5,
        maxZ = 33.5,
    }),
    BoxZone:Create(vector3(-66.48, -2532.57, 5.14), 15, 15, {
        name = "Fuel27",
        heading = 52.0,
        debugPoly = true,
        minZ = 5.1,
        maxZ = 9.1,
    }),
    BoxZone:Create(vector3(1784.324, 3330.55, 40.253), 15, 15, {
        name = "Fuel28",
        heading = 28.0,
        debugPoly = true,
        minZ = 40.2,
        maxZ = 44.2,
    }),
}

for int = 1, 28 do
    zones[int]:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
        if isPointInside then
            exports["qb-target"]:AddTargetModel(GasModels[int], {
                options = {
                    {
                        type = "client",
                        icon = "fa fa-car",
                        label = "Faire le plein",
                        targeticon = "fas fa-gas-pump",
                        action = function(entity)
                            if IsPedAPlayer(entity) then
                                return false
                            end
                            isFueling = true
                            local ped = PlayerPedId()
                            local vehicle = GetPlayersLastVehicle()
                            TriggerEvent("fuel:refuelFromPump", GasModels[int], ped, vehicle)
                        end,
                        canInteract = function(entity)
                            if IsPedAPlayer(entity) then
                                return false
                            end
                            local ped = PlayerPedId()
                            if not isFueling then
                                if not IsPedInAnyVehicle(ped) then
                                    local vehicle = GetPlayersLastVehicle()
                                    local vehicleCoords = GetEntityCoords(vehicle)
                                    if DoesEntityExist(vehicle) and #(GetEntityCoords(ped) - vehicleCoords) < 2.5 then
                                        if not DoesEntityExist(GetPedInVehicleSeat(vehicle, -1)) then
                                            if GetVehicleFuelLevel(vehicle) < 95 then
                                                return true
                                            else
                                                TriggerEvent("QBCore:Notify", "Le réservoir est plein", "error")
                                                Citizen.Wait(5000)
                                                return false
                                            end
                                        else
                                            return false
                                        end
                                    else
                                        return false
                                    end
                                else
                                    return false
                                end
                            else
                                return false
                            end
                        end,
                    },
                },
                distance = 2.5,
            })
        else
            exports["qb-target"]:RemoveTargetModel(-2007231801, "Faire le plein")
        end
    end)
end

CreateThread(function()
    local currentGasBlip = 0
    while true do
        local coords = GetEntityCoords(PlayerPedId())
        local closest = 1000
        local closestCoords
        for _, gasStationCoords in pairs(Config.GasStations) do
            local dstcheck = #(coords - gasStationCoords)
            if dstcheck < closest then
                closest = dstcheck
                closestCoords = gasStationCoords
            end
        end
        if DoesBlipExist(currentGasBlip) then
            RemoveBlip(currentGasBlip)
        end
        currentGasBlip = CreateBlip(closestCoords)
        Wait(10000)
    end
end)

function GetFuel(vehicle)
    return DecorGetFloat(vehicle, Config.FuelDecor)
end

function SetFuel(vehicle, fuel)
    if type(fuel) == "number" and fuel >= 0 and fuel <= 100 then
        SetVehicleFuelLevel(vehicle, fuel + 0.0)
        DecorSetFloat(vehicle, Config.FuelDecor, GetVehicleFuelLevel(vehicle))
    end
end

function LoadAnimDict(dict)
    if not HasAnimDictLoaded(dict) then
        RequestAnimDict(dict)
        while not HasAnimDictLoaded(dict) do
            Wait(1)
        end
    end
end

function Round(num, numDecimalPlaces)
    local mult = 10 ^ (numDecimalPlaces or 0)
    return math.floor(num * mult + 0.5) / mult
end

function CreateBlip(coords)
    local blip = AddBlipForCoord(coords)
    SetBlipSprite(blip, 361)
    SetBlipScale(blip, 0.6)
    SetBlipColour(blip, 4)
    SetBlipDisplay(blip, 4)
    SetBlipAsShortRange(blip, true)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentString("Station essence")
    EndTextCommandSetBlipName(blip)
    return blip
end
