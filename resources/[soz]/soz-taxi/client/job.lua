QBCore = exports["qb-core"]:GetCoreObject()

local HorodateurOpen = False

local HorodateurData = {
    TarifActuelle = 0,
    Distance = 0,
}

local function ValidVehicle()
    local ped = PlayerPedId()
    local vehicle = GetEntityModel(GetVehiclePedIsIn(ped))
    local retval = false

    if vehicle == GetHashKey("taxi") then
        retval = true
    end

    return retval
end

RegisterNetEvent('taxi:client:toggleHorodateur', function()
    if ValidVehicle() then
        if not HorodateurOpen then
            SendNUIMessage({
                action = "openMeter",
                toggle = true,
                meterData = Config.Horodateur
            })
            HorodateurOpen = true
        else
            SendNUIMessage({
                action = "openMeter",
                toggle = false
            })
            HorodateurOpen = false
        end
    end
end)

RegisterCommand('Horodateur-Taxi', function()
    TriggerEvent("taxi:client:toggleHorodateur")
end)

RegisterKeyMapping('Horodateur-Taxi', 'Horodateur Taxi', 'keyboard', 'y')