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
        color = StonkConfig.Blip.Color,
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

    -- CLOAKROOM
    exports["qb-target"]:AddBoxZone("stonk:cloakroomL", vector2(-24.1, -708.6), 0.8, 8.0, {
        heading = 295.0,
        minZ = 45.0,
        maxZ = 47.2,
    }, {
        options = {
            targeticon = "fas fa-box",
            icon = "fas fa-tshirt",
            event = "jobs:client:stonk:OpenCloakroomMenu",
            label = "Se changer",
            job = "cash-transfer",
        },
    })
    exports["qb-target"]:AddBoxZone("stonk:cloakroomR", vector2(-20.75, -706.325), 0.8, 8.0, {
        heading = 295.0,
        minZ = 45.0,
        maxZ = 47.2,
    }, {
        options = {
            targeticon = "fas fa-box",
            icon = "fas fa-tshirt",
            event = "jobs:client:stonk:OpenCloakroomMenu",
            label = "Se changer",
            job = "cash-transfer",
        },
    })
end)

---
--- MENU
---
local function PropsEntity(menu)
    menu:AddSlider({
        icon = "🚧",
        label = "Poser un objet",
        value = nil,
        values = {
            {label = "Cone de circulation", value = {item = "cone", props = "prop_roadcone02a"}},
            {label = "Barrière", value = {item = "police_barrier", props = "prop_barrier_work05"}},
        },
        select = function(_, value)
            TriggerServerEvent("job:server:placeProps", value.item, value.props)
        end,
    })
    menu:AddButton({
        label = "Vestiaire",
        select = function()
            TriggerEvent("jobs:client:stonk:OpenCloakroomMenu")
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

RegisterNetEvent("jobs:client:stonk:OpenCloakroomMenu", function()
    --- @type Menu
    local menu = StonkJob.Menus["cash-transfer"].menu
    menu:ClearItems()

    menu:AddButton({
        label = "Tenue civile",
        value = nil,
        select = function()
            TriggerEvent("soz-character:Client:ApplyCurrentClothConfig")
        end,
    })

    menu:AddButton({
        label = "Tenue de travail",
        value = nil,
        select = function()
            TriggerEvent("soz-character:Client:ApplyTemporaryClothSet", StonkConfig.Cloakroom[PlayerData.skin.Model.Hash])
        end,
    })

    menu:Open()
end)

---
--- PERMISSIONS
---
local function isOnDuty()
    return PlayerData.job.onduty
end

StonkJob.Permissions.CanBagsBeCollected = function(shopId)
    local hasJobPermission = SozJobCore.Functions.HasPermission(SozJobCore.JobPermission.CashTransfer.CollectBags)

    if hasJobPermission then
        local shop = StonkJob.CollectedShops[shopId]
        if not shop then
            return isOnDuty()
        end

        local remainingBags = shop["remaining-bags"]
        if type(remainingBags) == "number" and remainingBags > 0 then
            return isOnDuty()
        end

        local lastCollect = shop["last-collection"]
        if lastCollect then
            local now = GetGameTimer()
            return lastCollect + StonkConfig.Collection.Cooldown < now
        end
    end

    return isOnDuty() and hasJobPermission
end
exports("CanBagsBeCollected", StonkJob.Permissions.CanBagsBeCollected)

StonkJob.Permissions.CanBagsBeResold = function()
    local hasJobPermission = SozJobCore.Functions.HasPermission(SozJobCore.JobPermission.CashTransfer.ResaleBags)

    return isOnDuty() and hasJobPermission
end
exports("CanBagsBeResold", StonkJob.Permissions.CanBagsBeResold)

---
--- FARM
---
-- BAG COLLECTION
local collectedBags = 0
StonkJob.Functions.CollectBags = function(currentShop, nBags)
    if nBags < 1 then
        Citizen.Wait(500)
        exports["soz-hud"]:DrawNotification(string.format("Vous avez collecté ~g~%d sacs d'argent", collectedBags))
        StonkJob.CollectedShops[currentShop]["last-collection"] = GetGameTimer()
        return
    end

    QBCore.Functions.Progressbar("stonk-collect-bag", "Vous collectez 1 sac d'argent", StonkConfig.Collection.Duration, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = false,
        disableMouse = false,
        disableCombat = false,
    }, {}, {}, {}, function(wasCancelled)
        if not wasCancelled then
            TriggerServerEvent("soz-jobs:server:stonk-collect-bag", currentShop)
            collectedBags = collectedBags + 1
            local remaining = nBags - 1
            StonkJob.CollectedShops[currentShop]["remaining-bags"] = remaining
            StonkJob.Functions.CollectBags(currentShop, remaining)
        else
            exports["soz-hud"]:DrawNotification("~r~Vous n'avez pas collecté les sacs d'argent")
        end
    end)
end

AddEventHandler("soz-jobs:client:stonk-collect-bag", function()
    Citizen.CreateThread(function()
        local currentShop = exports["soz-shops"]:GetCurrentShop()

        local nBags

        local shop = StonkJob.CollectedShops[currentShop]
        if shop then
            if type(shop["remaining-bags"]) == "number" and shop["remaining-bags"] > 0 then
                nBags = shop["remaining-bags"]
            end
        else
            StonkJob.CollectedShops[currentShop] = {}
        end

        if not nBags then
            local range = StonkConfig.Collection.Range
            nBags = math.random(range.min, range.max)
        end

        StonkJob.CollectedShops[currentShop]["remaining-bags"] = nBags
        collectedBags = 0
        StonkJob.Functions.CollectBags(currentShop, nBags)
    end)
end)

-- BAG RESALE
local playerInsideZone = false
Citizen.CreateThread(function()
    local ResaleZone = BoxZone:Create(vector3(-20.78, -709.35, 39.73), 224.0, 14.5, {
        name = "stonk_resale",
        heading = 25.0,
        minZ = 39.8,
        maxZ = 43.8,
    })

    ResaleZone:onPlayerInOut(function(isInside)
        playerInsideZone = isInside
    end)

    for _, modelHash in ipairs(StonkConfig.Resale.TargetEntities) do
        exports["qb-target"]:AddTargetModel(modelHash, {
            options = {
                {
                    event = "soz-jobs:client:stonk-resale-bag",
                    icon = "fas fa-dollar-sign",
                    label = "Déposer des sacs d'argent",
                    canInteract = function()
                        return playerInsideZone and StonkJob.Permissions.CanBagsBeResold()
                    end,
                },
            },
            distance = 2.5,
        })
    end
end)

local bagsSold = 0
StonkJob.Functions.ResaleBags = function()

    local function DisplayBagsSold(count)
        exports["soz-hud"]:DrawNotification(string.format("~g~Vous avez déposé ~g~%d sacs d'argent", tonumber(count)))
    end

    if not QBCore.Functions.HasItem(StonkConfig.Collection.BagItem) then
        if bagsSold > 0 then
            DisplayBagsSold(bagsSold)
            return
        else
            exports["soz-hud"]:DrawNotification("~r~Vous n'avez pas de sacs d'argent sur vous")
            return
        end
    end

    QBCore.Functions.Progressbar("stonk-resale-bag", "Vous déposez 1 sac d'argent", StonkConfig.Resale.Duration, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = false,
        disableMouse = false,
        disableCombat = false,
    }, {}, {}, {}, function(wasCancelled)
        if not wasCancelled then
            TriggerServerEvent("soz-jobs:server:stonk-resale-bag")
            bagsSold = bagsSold + 1
            StonkJob.Functions.ResaleBags()
        else
            if bagsSold > 0 then
                DisplayBagsSold(bagsSold)
            else
                exports["soz-hud"]:DrawNotification("~r~Vous n'avez pas déposé les sacs d'argent")
            end
        end
    end)
end

AddEventHandler("soz-jobs:client:stonk-resale-bag", function()
    bagsSold = 0
    StonkJob.Functions.ResaleBags()
end)
