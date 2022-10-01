RegisterNetEvent("admin:skin:UpdateClothes", function(skin)
    --if not SozAdmin.Functions.IsPlayerAdmin(source) then
    --    return
    --end

    local Player = QBCore.Functions.GetPlayer(source)
    local clothConfig = Player.PlayerData.cloth_config

    clothConfig["BaseClothSet"] = skin
    Player.Functions.SetClothConfig(clothConfig, false)
    TriggerClientEvent("hud:client:DrawNotification", source, "Tenue sauvegardée")
end)
