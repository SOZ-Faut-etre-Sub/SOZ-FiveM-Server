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
            {
                targeticon = "fas fa-box",
                icon = "fas fa-tshirt",
                event = "jobs:client:stonk:OpenCloakroomMenu",
                label = "Se changer",
                job = "cash-transfer",
            },
        },
    })
    exports["qb-target"]:AddBoxZone("stonk:cloakroomR", vector2(-20.75, -706.325), 0.8, 8.0, {
        heading = 295.0,
        minZ = 45.0,
        maxZ = 47.2,
    }, {
        options = {
            {
                targeticon = "fas fa-box",
                icon = "fas fa-tshirt",
                event = "jobs:client:stonk:OpenCloakroomMenu",
                label = "Se changer",
                job = "cash-transfer",
            },
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
    local hasJobPermission = SozJobCore.Functions.HasPermission("cash-transfer", SozJobCore.JobPermission.CashTransfer.CollectBags)

    if hasJobPermission then
        local lastCollect = StonkJob.CollectedShops[shopId]
        if lastCollect then
            local now = GetGameTimer()
            return lastCollect + StonkConfig.Collection.Cooldown < now
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

---
--- FARM
---
-- BAG COLLECTION
StonkJob.Functions.CollectBags = function(currentShop, nBags)
    local animDict = "anim@mp_radio@garage@low"
    QBCore.Functions.RequestAnimDict(animDict)
    TaskPlayAnim(PlayerPedId(), animDict, "action_a", 8.0, 8.0, -1, 1, 1, true, false, true)

    local duration = StonkConfig.Collection.Duration * nBags
    QBCore.Functions.Progressbar("stonk-collect-bag", "Vous collectez des sacs d'argent", duration, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = false,
        disableMouse = false,
        disableCombat = false,
    }, {}, {}, {}, function(wasCancelled)
        if not wasCancelled then
            QBCore.Functions.TriggerCallback("soz-jobs:server:stonk-collect-bag", function(success)
                if success then
                    StonkJob.CollectedShops[currentShop] = GetGameTimer()
                end
            end, nBags)
        else
            exports["soz-hud"]:DrawNotification("Vous n'avez pas collecté les sacs d'argent", "error")
        end
        ClearPedTasksImmediately(PlayerPedId())
    end)
end

AddEventHandler("soz-jobs:client:stonk-collect-bag", function()
    Citizen.CreateThread(function()
        local currentShop = exports["soz-shops"]:GetCurrentShop()
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

StonkJob.Functions.ResaleBags = function()
    local count = StonkJob.Functions.GetItemCountFromInventory()
    if not count or count < 1 then
        exports["soz-hud"]:DrawNotification("Vous n'avez pas de sacs d'argent sur vous", "error")
        return
    elseif count >= StonkConfig.Resale.Quantity then
        count = StonkConfig.Resale.Quantity
    end

    local animDict = "anim@mp_radio@garage@low"
    QBCore.Functions.RequestAnimDict(animDict)
    TaskPlayAnim(PlayerPedId(), animDict, "action_a", 8.0, 8.0, -1, 1, 1, true, false, true)

    QBCore.Functions.Progressbar("stonk-resale-bag", string.format("Vous déposez %d sacs d'argent", count), StonkConfig.Resale.Duration * count, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = false,
        disableMouse = false,
        disableCombat = false,
    }, {}, {}, {}, function(wasCancelled)
        if not wasCancelled then
            Citizen.CreateThread(function()
                TriggerServerEvent("soz-jobs:server:stonk-resale-bag", count)
                exports["soz-hud"]:DrawNotification(string.format("Vous avez déposé ~g~%d sacs d'argent", tonumber(count)))
                Citizen.Wait(1000)
                StonkJob.Functions.ResaleBags()
            end)
        else
            exports["soz-hud"]:DrawNotification("Vous n'avez pas déposé les sacs d'argent", "error")
        end
        ClearPedTasksImmediately(PlayerPedId())
    end)
end

AddEventHandler("soz-jobs:client:stonk-resale-bag", function()
    Citizen.CreateThread(function()
        StonkJob.Functions.ResaleBags()
    end)
end)
