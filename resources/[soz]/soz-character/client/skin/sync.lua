PlayerData = QBCore.Functions.GetPlayerData()

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

-- Mettre un ensemble de vetement temporaire pour le joueur (donnes non persisté, pour tester avant sauvegarde)
-- Cette ensemble est mergé avec la configuration persisté
RegisterNetEvent("soz-character:Client:ApplyTemporaryClothSet", function(clothSet)
    local baseClothSet = ClothConfigComputeToClothSet(PlayerData.cloth_config)
    local applyClothSet = MergeClothSet(baseClothSet, clothSet)

    ApplyPlayerClothSet(PlayerId(), applyClothSet)
end)

-- Mettre un skin temporaire pour le joueur (donnes non persisté, pour tester avant sauvegarde
RegisterNetEvent("soz-character:Client:ApplyTemporarySkin", function(skin)
    ApplyPlayerBodySkin(PlayerId(), skin)
end)

-- Apply la configuration de vetements du joueur (données persisté)
RegisterNetEvent("soz-character:Client:ApplyCurrentClothConfig", function()
    ApplyPlayerClothConfig(PlayerId(), PlayerData.cloth_config)
end)

-- Apply le skin du joueur (données persisté)
RegisterNetEvent("soz-character:Client:ApplyCurrentSkin", function()
    ApplyPlayerBodySkin(PlayerId(), PlayerData.skin)
end)

-- Mettre nue un personnage sans que ce soit persisté en bdd (pour les tatooes par exemple)
RegisterNetEvent("soz-character:Client:SetTemporaryNaked", function()
    local tempClothConfig = Clone(PlayerData.cloth_config)
    tempClothConfig.Config.Naked = true

    ApplyPlayerClothConfig(PlayerId(), tempClothConfig)
end)

exports("ReApplyHeadConfig", function()
    local clothSet = ClothConfigComputeToClothSet(PlayerData.cloth_config)
    local ped = PlayerPedId()

    local prop = clothSet.Props[tostring(PropType.Head)] or clothSet.Components[PropType.Head]
    if prop then
        if prop == nil or prop.Clear == true then
            ClearPedProp(ped, PropType.Head)
        else
            SetPedPropIndex(ped, PropType.Head, prop.Drawable, prop.Texture or 0, prop.Palette or 0)
        end
    end
end)
