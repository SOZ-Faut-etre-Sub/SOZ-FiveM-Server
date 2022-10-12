FoodJob = {}
FoodJob.Functions = {}
FoodJob.Menu = MenuV:CreateMenu(nil, "", "menu_job_food", "soz", "food:menu")
FoodJob.Zones = {}

local currentField
local currentFieldHealth
local inKitchen = false

local function SpawnFieldZones()
    for zoneName, points in pairs(FoodConfig.Zones) do
        local minZ, maxZ
        for i = 1, #points, 1 do
            if minZ == nil or points[i].z < minZ then
                minZ = points[i].z
            end
            if maxZ == nil or points[i].z > maxZ then
                maxZ = points[i].z
            end
        end

        exports["qb-target"]:AddPolyZone(zoneName, points, {
            name = zoneName,
            minZ = minZ - 2.0,
            maxZ = maxZ + 2.0,
            onPlayerInOut = function(isIn)
                if isIn and PlayerData.job.id == SozJobCore.JobType.Food and PlayerData.job.onduty then
                    currentField = zoneName
                    QBCore.Functions.TriggerCallback("soz-jobs:server:food:getFieldHealth", function(health)
                        currentFieldHealth = health
                        DisplayFieldHealth(true, currentField, currentFieldHealth)
                    end, zoneName)
                else
                    currentField = nil
                    currentFieldHealth = nil
                    DisplayFieldHealth(false)
                end
            end,
        }, {
            options = {
                {
                    label = "Récolter",
                    color = "food",
                    icon = "c:food/collecter.png",
                    event = "soz-jobs:client:food-collect-ingredients",
                    blackoutGlobal = true,
                    blackoutJob = "food",
                    canInteract = function(entity)
                        local hasPermission = SozJobCore.Functions.HasPermission("food", SozJobCore.JobPermission.Food.Harvest)
                        return hasPermission and PlayerData.job.onduty and currentField and not IsEntityAVehicle(entity) and not IsEntityAPed(entity)
                    end,
                },
            },
            distance = 1.5,
        })
        table.insert(FoodJob.Zones, zoneName)
    end
end

local function SpawnJobZones()
    -- BOSS SHOP
    exports["qb-target"]:AddBoxZone("food:shop", vector2(-1881.68, 2058.03), 0.8, 2.15, {
        name = "food:shop",
        heading = 70.0,
        minZ = 140.0,
        maxZ = 143.0,
    }, {
        options = SozJobCore.Functions.GetBossShopActions("food", "food:client:bossShop"),
        distance = 2.5,
        job = "food",
        blackoutGlobal = true,
        blackoutJob = "food",
        canInteract = function()
            return PlayerData.job.onduty
        end,
    })

    -- CRAFTING
    -- CreateObjectNoOffset(GetHashKey("prop_copper_pan"), -1882.63, 2069.25, 141.0, false, false, false)
    -- exports["qb-target"]:AddBoxZone("food:craft", vector2(-1882.67, 2069.31), 0.75, 0.75, {
    --    heading = 250.0,
    --    minZ = 141.0,
    --    maxZ = 141.5,
    -- }, {
    --    options = {
    --        {
    --            icon = "c:food/cuisiner.png",
    --            color = "food",
    --            event = "jobs:client:food:OpenCraftingMenu",
    --            label = "Cuisiner",
    --            job = "food",
    --            blackoutGlobal = true,
    --            blackoutJob = "food",
    --            canInteract = function()
    --                return PlayerData.job.onduty
    --            end,
    --        },
    --    },
    -- })

    local kitchen = BoxZone:Create(vector2(-1881.59, 2068.93), 7.5, 5.5, {heading = 70.0, minZ = 140.0, maxZ = 142.5})
    kitchen:onPlayerInOut(function(isInside)
        inKitchen = isInside
    end)

    -- MILK
    exports["qb-target"]:AddBoxZone("food:milk_harvest", vector2(2416.83, 4994.29), 1.0, 5.0, {
        heading = 133.3,
        minZ = 45.5,
        maxZ = 49.5,
    }, {
        options = {
            {
                icon = "c:food/collecter.png",
                color = "food",
                event = "jobs:client:food-harvest-milk",
                label = "Récupérer",
                job = "food",
                blackoutGlobal = true,
                blackoutJob = "food",
                canInteract = function()
                    return PlayerData.job.onduty
                end,
            },
        },
    })
end

local function InitJob()
    Citizen.CreateThread(function()
        SpawnJobZones()
        SpawnFieldZones()
    end)
end

local function DestroyJob()
    local zoneNames = {"food:cloakroom", "food:craft", "food:milk_harvest", table.unpack(FoodJob.Zones)}
    for _, name in ipairs(zoneNames) do
        exports["qb-target"]:RemoveZone(name)
    end
end

-- ON STARTUP
Citizen.CreateThread(function()
    -- BLIP
    QBCore.Functions.CreateBlip("food", {
        name = FoodConfig.Blip.Name,
        coords = FoodConfig.Blip.Coords,
        sprite = FoodConfig.Blip.Icon,
        scale = FoodConfig.Blip.Scale,
    })

    -- DUTY
    exports["qb-target"]:AddBoxZone("food:duty", vector2(-1876.2, 2059.5), 0.6, 0.7, {
        heading = 70.25,
        minZ = 140.75,
        maxZ = 141.5,
    }, {
        options = {
            {
                type = "server",
                icon = "fas fa-sign-in-alt",
                label = "Prise de service",
                event = "QBCore:ToggleDuty",
                canInteract = function()
                    return PlayerData.job.id == SozJobCore.JobType.Food and not PlayerData.job.onduty
                end,
            },
            {
                type = "server",
                icon = "fas fa-sign-out-alt",
                label = "Fin de service",
                event = "QBCore:ToggleDuty",
                canInteract = function()
                    return PlayerData.job.id == SozJobCore.JobType.Food and PlayerData.job.onduty
                end,
            },
        },
    })
end)

RegisterNetEvent("QBCore:Client:SetDuty", function(duty)
    if duty then
        InitJob()
    else
        DestroyJob()
    end
end)

---
--- MENUS
---
RegisterNetEvent("jobs:client:food:OpenCloakroomMenu", function()
    SozJobCore.Functions.OpenCloakroomMenu(FoodJob.Menu, FoodConfig.Cloakroom)
end)

---
--- FARM
---
AddEventHandler("soz-jobs:client:food-collect-ingredients", function()
    Citizen.CreateThread(function()
        local field = currentField
        FoodJob.Functions.CollectIngredients(field)
    end)
end)

FoodJob.Functions.CollectIngredients = function(field)
    if IsPedInAnyVehicle(PlayerPedId(), false) then
        return
    end

    QBCore.Functions.Progressbar("food-collect-ingredients", "Vous récoltez des ingrédients", FoodConfig.Collect.Grape.Duration, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = false,
    }, {
        animDict = "anim@amb@business@weed@weed_inspecting_lo_med_hi@",
        anim = "weed_stand_checkingleaves_kneeling_01_inspector",
    }, {}, {}, function(wasCancelled)
        if not wasCancelled then
            QBCore.Functions.TriggerCallback("soz-jobs:server:food-collect-ingredients", function(items, newHealth)
                currentFieldHealth = newHealth
                if next(items) then
                    local messages = {}
                    local position = GetEntityCoords(PlayerPedId())

                    for itemId, n in pairs(items) do
                        local item = QBCore.Shared.Items[itemId]
                        table.insert(messages, string.format("%d %s", n, item.label))

                        TriggerServerEvent("monitor:server:event", "job_cm_food_collect", {item_id = itemId},
                                           {item_label = item.label, quantity = tonumber(n), position = position}, true)
                    end

                    local joined = table.concat(messages, ", ")
                    exports["soz-hud"]:DrawNotification(string.format("Vous avez récolté ~g~%s", joined))

                    if currentFieldHealth == 0 then
                        exports["soz-hud"]:DrawNotification("Le champ est épuisé...", "warning")
                    else
                        TriggerEvent("soz-jobs:client:food-collect-ingredients")
                    end
                end
                DisplayFieldHealth(true, currentField, currentFieldHealth)
            end, field)
        else
            exports["soz-hud"]:DrawNotification("Vous n'avez pas récolté d'ingrédients", "error")
        end
    end)
end

AddEventHandler("jobs:client:food-harvest-milk", function()
    QBCore.Functions.Progressbar("food-harvest-milk", "Vous récupérez des pots de lait", FoodConfig.Collect.Milk.Duration, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "anim@mp_radio@garage@low", anim = "action_a"}, {}, {}, function()
        QBCore.Functions.TriggerCallback("soz-jobs:server:food-collect-milk", function(success, count, item)
            if success then
                exports["soz-hud"]:DrawNotification(string.format("Vous avez récupéré ~g~%s pots de lait~s~", count))
                Citizen.Wait(1000)

                TriggerServerEvent("monitor:server:event", "job_cm_food_collect", {item_id = item},
                                   {
                    item_label = "Pot de lait",
                    quantity = tonumber(count),
                    position = GetEntityCoords(PlayerPedId()),
                }, true)

                TriggerEvent("jobs:client:food-harvest-milk")
            end
        end, GetClockHours())
    end, function()
        exports["soz-hud"]:DrawNotification("Vous avez ~r~interrompu~s~ la collecte de pot de lait", "error")
    end)
end)

FoodJob.Functions.GetItemCountFromInventory = function(itemName)
    local amount = 0
    for _, item in pairs(PlayerData.items or {}) do
        if item.name == itemName then
            if not exports["soz-utils"]:ItemIsExpired(item) then
                amount = amount + item.amount
            end
        end
    end
    return amount
end

FoodJob.Functions.CraftItem = function(itemId, item)
    if not inKitchen then
        exports["soz-hud"]:DrawNotification("Vous n'êtes pas dans la cuisine", "error")
        return
    end

    local recipe = FoodConfig.Recipes[itemId]
    if recipe == nil then
        exports["soz-hud"]:DrawNotification("Recette invalide", "error")
        return
    end

    local ingredients = recipe.ingredients
    for ingId, count in pairs(ingredients) do
        local ingredient = QBCore.Shared.Items[ingId]
        if ingredient == nil then
            exports["soz-hud"]:DrawNotification("Ingérdient invalide", "error")
            return
        end
        local countInInv = FoodJob.Functions.GetItemCountFromInventory(ingId) or 0
        if countInInv < count then
            exports["soz-hud"]:DrawNotification("Il vous manque des ingrédients", "error")
            return
        end
    end

    Citizen.CreateThread(function()
        QBCore.Functions.Progressbar("food-craft-item", string.format("Vous préparez %s", item.label),
                                     FoodConfig.CraftDuration[recipe.category] or FoodConfig.CraftDuration["default"], false, true,
                                     {
            disableMovement = true,
            disableCarMovement = true,
            disableMouse = false,
            disableCombat = true,
        }, {}, {}, {}, function(wasCancelled)
            if not wasCancelled then
                QBCore.Functions.TriggerCallback("soz-jobs:server:food-craft", function(success, reason)
                    if success then
                        exports["soz-hud"]:DrawNotification(string.format("Vous avez préparé ~g~%s", item.label))

                        TriggerServerEvent("monitor:server:event", "job_cm_food_craft", {item_id = itemId},
                                           {
                            item_label = item.label,
                            quantity = 1,
                            position = GetEntityCoords(PlayerPedId()),
                        }, true)

                        FoodJob.Functions.CraftItem(itemId, item)
                    else
                        if reason == nil then
                            return
                        elseif reason == "invalid_ingredient" then
                            exports["soz-hud"]:DrawNotification("Il vous manque des ingrédients...", "error")
                        else
                            exports["soz-hud"]:DrawNotification(string.format("Vous n'avez pas terminé votre préparation. Il y a eu une erreur : %s", reason),
                                                                "error")
                        end
                    end
                end, itemId)
            else
                exports["soz-hud"]:DrawNotification("Vous n'avez pas terminé votre préparation", "error")
            end
        end)
    end)
end

AddEventHandler("soz-jobs:client:food-craft-item", function(itemId)
    local item = QBCore.Shared.Items[itemId]
    if item == nil then
        return item
    end

    FoodJob.Functions.CraftItem(itemId, item)
end)

---
--- Hunting
---
local function PlayerHasKnifeEquiped()
    local ped = PlayerPedId()
    return GetSelectedPedWeapon(ped) == FoodConfig.HuntingWeapon
end

for animal, _ in pairs(FoodConfig.AnimalAllowedToHunt) do
    exports["qb-target"]:AddTargetModel(animal, {
        options = {
            {
                label = "Dépecer",
                icon = "c:food/depecer.png",
                event = "jobs:client:food:hunting",
                blackoutGlobal = true,
                blackoutJob = "food",
                canInteract = function(entity)
                    return not IsPedAPlayer(entity) and IsEntityDead(entity) and PlayerHasKnifeEquiped()
                end,
            },
        },
        distance = 2.5,
    })
end

RegisterNetEvent("jobs:client:food:hunting", function(data)
    if not DoesEntityExist(data.entity) or not IsEntityDead(data.entity) then
        return
    end

    if HasEntityBeenDamagedByAnyVehicle(data.entity) then
        exports["soz-hud"]:DrawNotification("L'animal est tout écrabouillé, on ne pourra rien en tirer...", "warning")
        return
    end

    local ped = PlayerPedId()
    local hasKnife = PlayerHasKnifeEquiped()

    if not hasKnife then
        TriggerEvent("inventory:client:StoreWeapon")
    end
    TaskTurnPedToFaceEntity(ped, data.entity, 500)

    Citizen.CreateThread(function()
        QBCore.Functions.RequestAnimDict("amb@medic@standing@kneel@base")
        QBCore.Functions.RequestAnimDict("anim@gangops@facility@servers@bodysearch@")
        Citizen.Wait(250)
        TaskPlayAnim(ped, "amb@medic@standing@kneel@base", "base", 8.0, -8.0, -1, 1, 0, false, false, false)
        TaskPlayAnim(ped, "anim@gangops@facility@servers@bodysearch@", "player_search", 8.0, -8.0, -1, 48, 0, false, false, false)
    end)

    QBCore.Functions.Progressbar("hunting-cutup", "Dépeçage en cours...", 5000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {}, {}, {}, function() -- Done
        if hasKnife then
            TriggerServerEvent("jobs:server:food:hunting", NetworkGetNetworkIdFromEntity(data.entity))
        else
            exports["soz-hud"]:DrawNotification("L'animal ne respire plus...", "info")
        end
    end)
end)

RegisterNetEvent("food:client:bossShop", function()
    if not SozJobCore.Functions.HasPermission("food", SozJobCore.JobPermission.SocietyShop) then
        return
    end

    shopMenu:ClearItems()
    for itemID, item in pairs(FoodConfig.BossShop) do
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

-- Resell Port of Los Santos
Citizen.CreateThread(function()
    local resellOpt = SozJobCore.Jobs[SozJobCore.JobType.Food].resell
    local coords = resellOpt.coords

    exports["qb-target"]:SpawnPed({
        {
            spawnNow = true,
            model = "s_m_y_dockwork_01",
            coords = coords,
            minusOne = true,
            freeze = true,
            invincible = true,
            blockevents = true,
            scenario = "WORLD_HUMAN_CLIPBOARD",
            target = {options = {}},
        },
    })

    local zone = BoxZone:Create(coords, 3.0, 3.0, {
        name = resellOpt.ZoneName,
        heading = coords.w,
        minZ = coords.z - 2.0,
        maxZ = coords.z + 2.0,
    })
    zone:onPlayerInOut(function(isInside)
        if isInside then
            TriggerEvent("player/setCurrentResellZone", resellOpt)
        else
            TriggerEvent("player/setCurrentResellZone", nil)
        end
    end)
end)
