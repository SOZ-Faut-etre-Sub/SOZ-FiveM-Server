local function DrawNewsBanner(type, message)
    SendNUIMessage({action = "draw_news_banner", type = type, message = message})
end

RegisterNetEvent("hud:client:DrawNewsBanner", function(type, message)
    DrawNewsBanner(type, message)
end)
