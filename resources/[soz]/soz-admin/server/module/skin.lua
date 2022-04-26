RegisterNetEvent("admin:skin:UpdateClothes", function(skin)
    local Player = QBCore.Functions.GetPlayer(source)
    local clothConfig = Player.PlayerData.cloth_config

    clothConfig["BaseClothSet"] = skin
    Player.Functions.SetClothConfig(clothConfig, false)
    TriggerClientEvent("hud:client:DrawNotification", source, "Tenue sauvegardée")
end)
