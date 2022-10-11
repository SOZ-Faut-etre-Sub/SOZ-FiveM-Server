QBCore.Functions.CreateCallback("soz-vehicle:server:GetVehiclesOfDealership", function(_, cb, dealershipId)
    local models = MySQL.Sync.fetchAll(
                       "SELECT vehicles.model AS model, name, price, vehicles.category AS category, required_licence, size, job_name, stock FROM vehicles LEFT JOIN concess_storage ON vehicles.model = concess_storage.model WHERE dealership_id = ? AND stock IS NOT NULL;",
                       {dealershipId})
    cb(models)
end)
