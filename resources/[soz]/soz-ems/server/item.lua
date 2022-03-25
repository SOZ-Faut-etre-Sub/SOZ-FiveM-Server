QBCore = exports["qb-core"]:GetCoreObject()

--- item

QBCore.Functions.CreateUseableItem("mouchoir", function(source)
    TriggerClientEvent("lsmc:client:mouchoir", source)
end)