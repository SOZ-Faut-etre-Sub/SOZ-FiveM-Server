SozVehicle = SozVehicle or {}

exports("GetCoreObject", function()
    return SozVehicle
end)

function SozVehicle:GetVehicle(vehicle)
    return MySQL.Sync.fetchSingle("SELECT * FROM vehicles WHERE model = ?", {vehicle})
end
QBCore.Functions.CreateCallback("soz-vehicle:server:GetVehicle", function(_, cb, vehicle)
    cb(GetVehicle(vehicle))
end)

function SozVehicle:GetAllVehicles()
    return MySQL.Sync.fetchAll("SELECT * FROM vehicles")
end
QBCore.Functions.CreateCallback("soz-vehicle:server:GetAllVehicles", function(_, cb)
    cb(GetAllVehicles())
end)
