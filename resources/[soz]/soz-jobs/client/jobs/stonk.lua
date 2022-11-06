StonkJob = {}
StonkJob.Functions = {}
StonkJob.Functions.Menu = {}
StonkJob.Menus = {}
StonkJob.Permissions = {}
StonkJob.CollectedShops = {} -- In-memory, player-based save

Citizen.CreateThread(function()
    -- MENU
    StonkJob.Menus["cash-transfer"] = {
        menu = MenuV:CreateMenu(nil, "Stonk Depository", "menu_job_carrier", "soz", "stonk:menu"),
    }
    -- DUTY
    exports["qb-target"]:AddBoxZone("stonk:duty", vector2(-18.74, -707.44), 0.2, 0.5, {
        heading = 200.0,
        minZ = 45.9,
        maxZ = 46.45,
    }, {
        options = {
            {
                icon = "fas fa-sign-in-alt",
                label = "Prise de service",
                type = "server",
                event = "QBCore:ToggleDuty",
                canInteract = function()
                    return not PlayerData.job.onduty
                end,
            },
            {
                icon = "fas fa-sign-out-alt",
                label = "Fin de service",
                type = "server",
                event = "QBCore:ToggleDuty",
                canInteract = function()
                    return PlayerData.job.onduty
                end,
            },
        },
    })
end)

--- Events
RegisterNetEvent("jobs:client:stonk:OpenCloakroomMenu", function(storageId)
    --- @type Menu
    local menu = StonkJob.Menus["cash-transfer"].menu

    SozJobCore.Functions.OpenCloakroomMenu(menu, StonkConfig.Cloakroom, storageId)

    menu:AddButton({
        label = "Tenue de service",
        value = nil,
        select = function()
            if storageId then
                TriggerServerEvent("soz-core:server:job:use-work-clothes", storageId)
            end
            TriggerEvent("stonk:client:applyDutyClothing")
        end,
    })
end)

--- Duty clothings
RegisterNetEvent("stonk:client:applyDutyClothing", function()
    local clothesConfig = {Components = {}, Props = {}}

    for id, component in pairs(StonkConfig.DutyOutfit[PlayerData.skin.Model.Hash].Components) do
        clothesConfig.Components[id] = component
    end
    for id, prop in pairs(StonkConfig.DutyOutfit[PlayerData.skin.Model.Hash].Props) do
        clothesConfig.Props[id] = prop
    end

    QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
        disableMovement = true,
        disableCombat = true,
    }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
        TriggerServerEvent("soz-character:server:SetPlayerJobClothes", clothesConfig, true)
    end)
end)

exports("WearVIPClothes", function()
    local ped = PlayerPedId()

    for id, component in pairs(StonkConfig.Cloakroom[PlayerData.skin.Model.Hash]["Tenue VIP"].Components) do
        local drawable = GetPedDrawableVariation(ped, id)

        if drawable ~= component.Drawable then
            return false
        end
    end

    return true
end)
