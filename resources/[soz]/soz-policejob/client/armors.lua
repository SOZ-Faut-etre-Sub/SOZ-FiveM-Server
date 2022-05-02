RegisterNetEvent("police:client:setupArmor", function(armorType)
    local armour = Config.Armors[PlayerData.skin.Model.Hash][armorType]
    if armour == nil then
        return
    end

    QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
        disableMovement = true,
        disableCombat = true,
    }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
        TriggerEvent("soz-character:Client:ApplyTemporaryClothSet", {Components = {[9] = armour}, Props = {}})
    end)
end)
