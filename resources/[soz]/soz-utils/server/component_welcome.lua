QBCore.Functions.CreateUseableItem("welcome_book", function(source, item)
    TriggerClientEvent("soz-utils:welcome-show", source)
end)
QBCore.Functions.CreateUseableItem("health_book", function(source, item)
    TriggerClientEvent("soz-utils:health-book", source)
end)

QBCore.Functions.CreateUseableItem("lsmc_calendar_2023", function(source, item)
    TriggerClientEvent("soz-utils:lsmc-calender-2023", source)
end)
