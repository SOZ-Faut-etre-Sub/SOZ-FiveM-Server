local QBCore = exports["qb-core"]:GetCoreObject()

function DeleteVehicule(vehicule)
    SetEntityAsMissionEntity(vehicule, true, true)
    DeleteVehicle(vehicule)
end
