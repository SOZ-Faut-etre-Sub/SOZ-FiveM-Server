QBCore = exports["qb-core"]:GetCoreObject()

local JobVehicle = false

exports["qb-target"]:AddBoxZone("Véhicule taxi", vector3(890.69, -149.87, 76.89), 1, 1, {
    name = "Véhicule taxi",
    heading = 0,
    debugPoly = false,
    minZ = 75.69,
    maxZ = 77.89
}, {
    options = {
        {
            type = "client",
            event = "taxi:client:vehicle",
            icon = "fas fa-sign-in-alt",
            label = "Sortir le véhicule de service",
            job = {["taxi"] = 0},
            canInteract = function()
                return not JobVehicle
            end,
        },
        {
            type = "client",
            event = "taxi:client:remove_vehicle",
            icon = "fas fa-sign-in-alt",
            label = "Ranger le véhicule de service",
            job = {["taxi"] = 0},
            canInteract = function()
                return JobVehicle
            end,
        },
    },
    distance = 2.5,
})

RegisterNetEvent("taxi:client:vehicle")
AddEventHandler("taxi:client:vehicle", function()
    JobVehicle = true

    local ModelHash = "taxi"
    local model = GetHashKey(ModelHash)
    if not IsModelInCdimage(model) then
        return
    end
    RequestModel(model)
    while not HasModelLoaded(model) do
        Citizen.Wait(10)
    end
    vehicule_taxi = CreateVehicle(model, Config.vehicule_position.x, Config.vehicule_position.y, Config.vehicule_position.z,
                                      Config.vehicule_position.w, true, false)
    SetModelAsNoLongerNeeded(model)
    VehPlate = QBCore.Functions.GetPlate(vehicule_taxi)
    TriggerServerEvent("vehiclekeys:server:SetVehicleOwner", VehPlate)
end)

RegisterNetEvent("taxi:client:remove_vehicle")
AddEventHandler("taxi:client:remove_vehicle", function()
    JobVehicle = false

    QBCore.Functions.DeleteVehicle(vehicule_taxi)
end)