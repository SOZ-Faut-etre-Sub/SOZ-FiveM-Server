local isFueling = false
local fuelSynced = false

local pistol = {model = "prop_cs_fuel_nozle", pistolObject = nil, rope = nil}
local stationPistolInUse = false
local playerIsInsideStationZone = false

---
--- Vehicle Oil (always provide the virtual oil, the methods will calculate the oil for GTA
---
function GetOil(vehicle)
    return Entity(vehicle).state.oilLevel or GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume")
end

function SetOil(vehicle, oil)
    if type(oil) == "number" and oil >= 0 and oil <= GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume") then
        SetVehicleOilLevel(vehicle, oil + 0.0)
        Entity(vehicle).state:set("oilLevel", GetVehicleOilLevel(vehicle), true)
    elseif type(oil) == "number" and oil <= 0 then
        SetVehicleOilLevel(vehicle, 0.0)
        Entity(vehicle).state:set("oilLevel", GetVehicleOilLevel(vehicle), true)
    end
end

function GetOilForHud(vehicle)
    if GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume") == 0 then
        return 100
    end
    return (GetOil(vehicle) / GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume")) * 100
end
exports("GetOil", GetOil)
exports("SetOil", SetOil)
exports("GetOilForHud", GetOilForHud)
---
--- Vehicle Fuel
---
function ManageFuelUsage(vehicle)
    if Entity(vehicle).state.fuel == nil then
        SetFuel(vehicle, math.random(200, 800) / 10)
    elseif not fuelSynced then
        SetFuel(vehicle, GetFuel(vehicle))
        fuelSynced = true
    end
    if IsVehicleEngineOn(vehicle) and Config.Classes[GetVehicleClass(vehicle)] > 0 then
        local consumption = Config.FuelUsage[QBCore.Shared.Round(GetVehicleCurrentRpm(vehicle), 1)] * (Config.Classes[GetVehicleClass(vehicle)] or 1.0) / 10
        SetFuel(vehicle, GetVehicleFuelLevel(vehicle) - consumption)
        if GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume") > 0 then
            SetOil(vehicle, GetVehicleOilLevel(vehicle) - (consumption / Config.oilDivider))
        end
    end
    if GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume") > 0 and GetOil(vehicle) <= 0 and IsVehicleEngineOn(vehicle) then
        local newEngine = 0
        if (GetVehicleEngineHealth(vehicle) - 50) > 0 then
            newEngine = GetVehicleEngineHealth(vehicle) - 50
        end
        SetVehicleEngineHealth(vehicle, newEngine)
    end
    if GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume") > 0 and GetOil(vehicle) <= 0 then
        SetVehicleEngineOn(vehicle, false, true, true)
    end
end

CreateThread(function()
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
        Wait(1000)
        for vehicle in exports["soz-vehicle"]:EnumerateVehicles() do
            if GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume") > 0 and
                ((IsVehicleEngineOn(vehicle) and GetOil(vehicle) <= 0.5) or GetOil(vehicle) <= 0) then
                exports["soz-vehicle"]:showLoopParticleAtBone("core", "exp_grd_bzgas_smoke", vehicle, GetEntityBoneIndexByName(vehicle, "engine"), 1.5, 1000)
            end
        end
    end
end)
function HasFuel(vehicle)
    return Config.Classes[GetVehicleClass(vehicle)] > 0
end

function GetFuel(vehicle)
    return Entity(vehicle).state.fuel or GetVehicleFuelLevel(vehicle)
end

function SetFuel(vehicle, fuel)
    if type(fuel) == "number" and fuel >= 0 and fuel <= 100 then
        SetVehicleFuelLevel(vehicle, fuel + 0.0)
        Entity(vehicle).state:set("fuel", GetVehicleFuelLevel(vehicle), true)
    end
end

RegisterNetEvent("soz-fuel:client:SetFuel", function(net, newFuel)
    local veh = NetworkGetEntityFromNetworkId(net)
    SetFuel(veh, newFuel)
end)

exports("HasFuel", HasFuel)
exports("GetFuel", GetFuel)
exports("SetFuel", SetFuel)

---
--- Fuel Stations
---
Citizen.CreateThread(function()
    local stations = QBCore.Functions.TriggerRpc("fuel:server:GetStations")

    for _, s in pairs(stations) do
        --- @type FuelStation
        local station = FuelStation:new(s.id, s.station, s.fuel, s.type, s.owner, s.stock, s.price, s.position, s.model, s.zone)

        if station:IsPublic() then
            QBCore.Functions.CreateBlip("station_" .. station.id, {
                name = Config.FuelStations.Blip.Name,
                coords = station:GetCoordinates(),
                sprite = Config.FuelStations.Blip.Sprite,
                color = Config.FuelStations.Blip.Color,
                alpha = Config.FuelStations.Blip.Alpha,
            })
        end

        BoxZone:Create(station:GetPolyZoneConfiguration()):onPlayerInOut(function(isPointInside, _)
            playerIsInsideStationZone = isPointInside
            if isPointInside then
                TriggerEvent("locations:zone:enter", "fueler_petrol_station", station:GetIdentifier(), station:IsKerosene())

                exports["qb-target"]:AddTargetModel(station:GetModel(), {
                    options = {
                        {
                            label = "Remplir la station d'essence",
                            color = "oil",
                            icon = "c:fuel/pistolet.png",
                            event = "jobs:client:fueler:StartStationRefill",
                            canInteract = function()
                                return LocalPlayer.state.hasTankerPipe and PlayerData.job.onduty and station:IsEssence()
                            end,
                            job = "oil",
                            blackoutGlobal = true,
                            blackoutJob = true,
                        },
                        {
                            label = "Remplir la station de kérosène",
                            color = "oil",
                            icon = "c:fuel/pistolet.png",
                            event = "jobs:client:fueler:StartKeroseneStationRefill",
                            canInteract = function()
                                return PlayerData.job.onduty and station:IsKerosene()
                            end,
                            item = "kerosene",
                            job = "oil",
                            blackoutGlobal = true,
                            blackoutJob = true,
                        },
                    },
                    distance = 3.0,
                })


            else
                TriggerEvent("locations:zone:exit", "fueler_petrol_station", station:GetIdentifier(), station:IsKerosene())
                exports["qb-target"]:RemoveTargetEntity(GetPlayersLastVehicle(), "Remplir")
            end
        end)

    end
end)


---
--- Utils
---
