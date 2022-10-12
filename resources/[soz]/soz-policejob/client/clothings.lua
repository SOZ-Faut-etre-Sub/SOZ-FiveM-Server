--- Duty clothings
RegisterNetEvent("police:client:applyDutyClothing", function(clotheType)
    local clothesConfig = {Components = {}, Props = {}}

    for grade, clothes in pairs(Config.DutyOutfit[clotheType]) do
        if tonumber(grade) == 0 or tonumber(grade) == tonumber(PlayerData.job.grade) then
            for id, component in pairs(clothes[PlayerData.skin.Model.Hash].Components) do
                clothesConfig.Components[id] = component
            end
            for id, prop in pairs(clothes[PlayerData.skin.Model.Hash].Props) do
                clothesConfig.Props[id] = prop
            end
        end
    end

    QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
        disableMovement = true,
        disableCombat = true,
    }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
        TriggerServerEvent("soz-character:server:SetPlayerJobClothes", clothesConfig, true)
    end)
end)

--- Armors
RegisterNetEvent("police:client:setupArmor", function(armorType)
    local armour = Config.Armors[PlayerData.skin.Model.Hash][armorType]
    if armour == nil then
        return
    end

    QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
        disableMovement = true,
        disableCombat = true,
    }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
        TriggerServerEvent("soz-character:server:SetPlayerJobClothes", {Components = {[9] = armour}, Props = {}}, false)
    end)
end)
