StonkJob = {}
StonkJob.Functions = {}
StonkJob.Functions.Menu = {}
StonkJob.Menus = {}
StonkJob.Permissions = {}
StonkJob.CollectedShops = {} -- In-memory, player-based save

Citizen.CreateThread(function()
    -- BLIP
    QBCore.Functions.CreateBlip("stonk-dep", {
        name = StonkConfig.Blip.Name,
        coords = StonkConfig.Blip.Coords,
        sprite = StonkConfig.Blip.Icon,
        scale = StonkConfig.Blip.Scale,
    })

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

    -- BOSS STORAGE
    exports["qb-target"]:AddBoxZone("stonk:shop", vector2(-15.5, -708.83), 0.6, 2.6, {
        name = "food:shop",
        heading = 25.0,
        minZ = 45.02,
        maxZ = 48.02,
    }, {options = SozJobCore.Functions.GetBossShopActions("cash-transfer", "stonk:client:bossShop"), distance = 2.5})
end)

---
--- MENU
---
local function PropsEntity(menu)
    menu:AddSlider({
        icon = "🚧",
        label = "Poser un objet",
        value = nil,
        values = {{label = "Cone de circulation", value = {item = "cone", props = "prop_roadcone02a"}}},
        select = function(_, value)
            TriggerServerEvent("job:server:placeProps", value.item, value.props)
        end,
    })
end

StonkJob.Functions.Menu.GenerateMenu = function(job, cb)
    if not StonkJob.Functions.Menu.MenuAccessIsValid(job) then
        return
    end

    --- @type Menu
    local menu = StonkJob.Menus[job].menu
    menu:ClearItems()

    cb(menu)

    if menu.IsOpen then
        MenuV:CloseAll(function()
            menu:Close()
        end)
    else
        MenuV:CloseAll(function()
            menu:Open()
        end)
    end
end

StonkJob.Functions.Menu.GenerateJobMenu = function(job)
    StonkJob.Functions.Menu.GenerateMenu(job, function(menu)
        if PlayerData.job.onduty then
            PropsEntity(menu)
        else
            menu:AddButton({label = "Tu n'es pas en service !", disabled = true})
        end
    end)
end

--- Events
RegisterNetEvent("stonk:client:OpenSocietyMenu", function()
    StonkJob.Functions.Menu.GenerateJobMenu(PlayerData.job.id)
end)

StonkJob.Functions.Menu.MenuAccessIsValid = function(job)
    if PlayerData.job.id == "cash-transfer" then
        return true
    end
    return false
end

RegisterNetEvent("jobs:client:stonk:OpenCloakroomMenu", function(storageId)
    --- @type Menu
    local menu = StonkJob.Menus["cash-transfer"].menu

    SozJobCore.Functions.OpenCloakroomMenu(menu, StonkConfig.Cloakroom, storageId)

    menu:AddButton({
        label = "Tenue de service",
        value = nil,
        select = function()
            TriggerEvent("stonk:client:applyDutyClothing")
        end,
    })
end)

---
--- PERMISSIONS
---
local function isOnDuty()
    return PlayerData.job.onduty
end

StonkJob.Permissions.CanBagsBeCollected = function(shopId)
    local hasJobPermission = SozJobCore.Functions.HasPermission("cash-transfer", SozJobCore.JobPermission.CashTransfer.CollectBags)

    if hasJobPermission then
        local lastCollect = StonkJob.CollectedShops[shopId]
        if lastCollect then
            local now = GetGameTimer()
            return isOnDuty() and lastCollect + StonkConfig.Collection.Cooldown < now
        end
    end

    return isOnDuty() and hasJobPermission
end
exports("CanBagsBeCollected", StonkJob.Permissions.CanBagsBeCollected)

StonkJob.Permissions.CanBagsBeResold = function()
    local hasJobPermission = SozJobCore.Functions.HasPermission("cash-transfer", SozJobCore.JobPermission.CashTransfer.ResaleBags)

    return isOnDuty() and hasJobPermission
end
exports("CanBagsBeResold", StonkJob.Permissions.CanBagsBeResold)

StonkJob.Permissions.CanFillIn = function()
    local hasJobPermission = SozJobCore.Functions.HasPermission("cash-transfer", SozJobCore.JobPermission.CashTransfer.FillIn)
    return isOnDuty() and hasJobPermission
end
exports("CanFillIn", StonkJob.Permissions.CanFillIn)

---
--- FARM
---
-- BAG COLLECTION
StonkJob.Functions.CollectBags = function(currentShop, nBags)
    local duration = StonkConfig.Collection.Duration * nBags
    QBCore.Functions.Progressbar("stonk-collect-bag", "Vous collectez des sacs d'argent", duration, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = false,
        disableMouse = false,
        disableCombat = false,
    }, {animDict = "anim@mp_radio@garage@low", anim = "action_a"}, {}, {}, function(wasCancelled)
        if not wasCancelled then
            local success = QBCore.Functions.TriggerRpc("soz-jobs:server:stonk-collect-bag", nBags)
            if success then
                TriggerServerEvent("monitor:server:event", "job_stonk_collect_bag", {}, {
                    quantity = nBags,
                    position = GetEntityCoords(PlayerPedId()),
                }, true)

                StonkJob.CollectedShops[currentShop] = GetGameTimer()
            end
        else
            exports["soz-hud"]:DrawNotification("Vous n'avez pas collecté les sacs d'argent", "error")
        end
    end)
end

AddEventHandler("soz-jobs:client:stonk-collect-bag", function()
    local currentShop = exports["soz-shops"]:GetCurrentShop()

    if not StonkJob.Permissions.CanBagsBeCollected(currentShop) then
        return
    end

    Citizen.CreateThread(function()
        local range = StonkConfig.Collection.Range
        local nBags = math.random(range.min, range.max)
        StonkJob.Functions.CollectBags(currentShop, nBags)
    end)
end)

-- BAG RESALE
StonkJob.Functions.GetItemCountFromInventory = function()
    for _, item in pairs(PlayerData.items or {}) do
        if item.name == StonkConfig.Collection.BagItem then
            return item.amount
        end
    end
end

StonkJob.Functions.ResaleBags = function()
    local count = StonkJob.Functions.GetItemCountFromInventory()
    if not count or count < 1 then
        exports["soz-hud"]:DrawNotification("Vous n'avez pas de sacs d'argent sur vous", "error")
        return
    elseif count >= StonkConfig.Resale.Quantity then
        count = StonkConfig.Resale.Quantity
    end

    QBCore.Functions.Progressbar("stonk-resale-bag", string.format("Vous déposez %d sacs d'argent", count), StonkConfig.Resale.Duration * count, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "anim@mp_radio@garage@low", anim = "action_a"}, {}, {}, function(wasCancelled)
        if not wasCancelled then
            local success = QBCore.Functions.TriggerRpc("soz-jobs:server:stonk-resale-bag", count)
            if success then
                exports["soz-hud"]:DrawNotification(string.format("Vous avez déposé ~g~%d sacs d'argent", tonumber(count)))

                TriggerServerEvent("monitor:server:event", "job_stonk_resale_bag", {}, {
                    quantity = tonumber(count),
                    position = GetEntityCoords(PlayerPedId()),
                }, true)

                Citizen.Wait(1000)
                StonkJob.Functions.ResaleBags()
            end
        else
            exports["soz-hud"]:DrawNotification("Vous n'avez pas déposé les sacs d'argent", "error")
        end
    end, function()
        exports["soz-hud"]:DrawNotification("Vous avez ~r~interrompu~s~ la revente de sacs d'argent", "error")
    end)
end

AddEventHandler("soz-jobs:client:stonk-resale-bag", function()
    Citizen.CreateThread(function()
        StonkJob.Functions.ResaleBags()
    end)
end)

-- FILL IN
StonkJob.Functions.FillIn = function(data)
    QBCore.Functions.Progressbar("stonk_fill_in", "Vous remplissez...", StonkConfig.FillIn.Duration, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "anim@mp_radio@garage@low", anim = "action_a"}, {}, {}, function()
        local payload = {}
        if data.isBank then
            local currentBank = exports["soz-bank"]:GetCurrentBank()
            payload["bank"] = currentBank.bank
        else
            payload["coords"] = GetEntityCoords(data.entity)
            payload["atmType"] = data.atmType
        end

        local res = QBCore.Functions.TriggerRpc("soz-jobs:server:stonk-fill-in", payload)
        if not res.success then
            local messages = {
                ["invalid_quantity"] = "Vous n'avez pas de sacs d'argent sur vous",
                ["invalid_money"] = "Ce compte est déjà plein",
            }
            local message = messages[res.reason]
            if messages[res.reason] == nil then
                message = string.format("Il y a eu une erreur: %s", res.reason)
            end
            exports["soz-hud"]:DrawNotification(message, "error")
        else
            exports["soz-hud"]:DrawNotification("Remplissage OK")
            StonkJob.Functions.FillIn(data)
        end
    end, function()
        exports["soz-hud"]:DrawNotification("Vous avez interrompu le remplissage", "warning")
    end)
end

AddEventHandler("soz-jobs:client:stonk-fill-in", function(data)
    StonkJob.Functions.FillIn(data)
end)

RegisterNetEvent("stonk:client:bossShop", function()
    if not SozJobCore.Functions.HasPermission("cash-transfer", SozJobCore.JobPermission.SocietyShop) then
        return
    end

    shopMenu:ClearItems()
    for itemID, item in pairs(StonkConfig.BossShop) do
        shopMenu:AddButton({
            label = item.amount .. "x " .. QBCore.Shared.Items[item.name].label,
            rightLabel = "$" .. item.price,
            value = itemID,
            select = function(btn)
                TriggerServerEvent("jobs:shop:server:buy", btn.Value)
            end,
        })
    end

    shopMenu:Open()
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
