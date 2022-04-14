RegisterNetEvent("hud:client:DrawNewsBanner", function(type, message, reporter)
    SendNUIMessage({action = "draw_news_banner", type = type, message = message, reporter = reporter})
end)
