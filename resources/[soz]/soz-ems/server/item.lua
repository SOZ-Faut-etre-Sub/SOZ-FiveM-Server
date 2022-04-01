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

QBCore.Functions.CreateUseableItem("ifaks", function(source)
    TriggerClientEvent("lsmc:client:ifaks", source)
end)

QBCore.Functions.CreateUseableItem("défibrillateur", function(source)
    TriggerClientEvent("lsmc:client:défibrillateur", source)
end)
