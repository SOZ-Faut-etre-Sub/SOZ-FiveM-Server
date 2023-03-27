RegisterNetEvent("admin:skin:UpdateClothes", function(cloth)
    if not SozAdmin.Functions.IsPlayerStaff(source) then
        return
    end

    local Player = QBCore.Functions.GetPlayer(source)
    local skin = Player.PlayerData.skin
    skin.Hair.HairType = cloth.Components["2"].Drawable
    Player.Functions.SetSkin(skin, false)

    local clothConfig = Player.PlayerData.cloth_config
    clothConfig["BaseClothSet"] = cloth
    Player.Functions.SetClothConfig(clothConfig, false)

    TriggerClientEvent("hud:client:DrawNotification", source, "Tenue sauvegardée")
end)
