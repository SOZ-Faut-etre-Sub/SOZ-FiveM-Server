local function TwitchNewsCameraState(state)
    SendNUIMessage({action = "set_twitch_news_overlay", state = state})
end

exports("EnableTwitchNewsOverlay", function()
    TwitchNewsCameraState(true)
end)
exports("DisableTwitchNewsOverlay", function()
    TwitchNewsCameraState(false)
end)
