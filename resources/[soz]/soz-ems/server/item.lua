QBCore = exports["qb-core"]:GetCoreObject()

--- item

QBCore.Functions.CreateUseableItem("mouchoir", function(source)
    TriggerClientEvent("lsmc:client:mouchoir", source)
end)

QBCore.Functions.CreateUseableItem("pommade", function(source)
    TriggerClientEvent("lsmc:client:pommade", source)
end)

QBCore.Functions.CreateUseableItem("antibiotique", function(source)
    TriggerClientEvent("lsmc:client:antibiotique", source)
end)
