FoodJob = {}
FoodJob.Functions = {}
FoodJob.Menu = MenuV:CreateMenu(nil, "", "menu_job_food", "soz", "food:menu")
FoodJob.Zones = {}

local currentField
local currentFieldHealth
local helpTextDisplayed = false

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

        local zone = PolyZone:Create(points, {name = zoneName, minZ = minZ - 2.0, maxZ = maxZ + 2.0})
        zone:onPlayerInOut(function(isInsideZone)
            if isInsideZone then
                local hasPermission = SozJobCore.Functions.HasPermission("food", SozJobCore.JobPermission.Food.Harvest)
                if not hasPermission or not PlayerData.job.onduty then
                    return
                end

                currentField = zone.name
                DisplayHelpText()
                QBCore.Functions.TriggerCallback("soz-jobs:server:get-field-health", function(health)
                    currentFieldHealth = health
                    DisplayFieldHealth()
                end, zone.name)
            else
                currentField = nil
                currentFieldHealth = nil
            end
        end)
        table.insert(FoodJob.Zones, zone)
    end
end

local function DespawnFieldZones()
    for _, zone in ipairs(FoodJob.Zones) do
        zone:destroy()
    end
end

Citizen.CreateThread(function()
    -- BLIP
    QBCore.Functions.CreateBlip("food", {
        name = FoodConfig.Blip.Name,
        coords = FoodConfig.Blip.Coords,
        sprite = FoodConfig.Blip.Icon,
        scale = FoodConfig.Blip.Scale,
    })

    -- DUTY
    exports["qb-target"]:AddBoxZone("food:duty", vector2(-1898.66, 2075.36), 0.5, 0.75, {
        heading = 70.25,
        minZ = 140.0,
        maxZ = 142.5,
    }, {
        options = {
            {
                icon = "fas fa-sign-in-alt",
                label = "Prise de service",
                event = "jobs:client:food-toggle-duty",
                canInteract = function()
                    return not PlayerData.job.onduty
                end,
            },
            {
                icon = "fas fa-sign-out-alt",
                label = "Fin de service",
                event = "jobs:client:food-toggle-duty",
                canInteract = function()
                    return PlayerData.job.onduty
                end,
            },
        },
    })

    -- CLOAKROOM
    exports["qb-target"]:AddBoxZone("food:cloakroom", vector2(-1866.8, 2059.98), 0.5, 1.5, {
        heading = 340.76,
        minZ = 140.0,
        maxZ = 142.5,
    }, {
        options = {
            {
                targeticon = "fas fa-box",
                icon = "fas fa-tshirt",
                event = "jobs:client:food:OpenCloakroomMenu",
                label = "Se changer",
                job = "food",
            },
        },
    })

    -- MILK
    exports["qb-target"]:AddBoxZone("food:milk_harvest", vector2(2416.83, 4994.29), 1.0, 5.0, {
        heading = 133.3,
        minZ = 45.5,
        maxZ = 49.5,
    }, {
        options = {
            {
                icon = "c:food/collecter.png",
                event = "jobs:client:food-harvest-milk",
                label = "Récupérer"
            }
        }
    })

    exports["qb-target"]:AddBoxZone("food:milk-process", vector2(-1929.02, 2059.16), 0.5, 1.5, {
        heading = 166.6,
        minZ = 140.0,
        maxZ = 142.5,
    }, {
        options = {
            {
                icon = "c:food/echanger.png",
                event = "jobs:client:food-process-milk",
                label = "Echanger"
            }
        }
    })
end)

AddEventHandler("jobs:client:food-toggle-duty", function()
    if not PlayerData.job.onduty then
        SpawnFieldZones()
    else
        DespawnFieldZones()
    end
    TriggerServerEvent("QBCore:ToggleDuty")
end)

---
--- MENUS
---
RegisterNetEvent("jobs:client:food:OpenSocietyMenu", function()
    FoodJob.Menu:ClearItems()
    FoodJob.Menu:Open()
end)

RegisterNetEvent("jobs:client:food:OpenCloakroomMenu", function()
    FoodJob.Menu:ClearItems()

    FoodJob.Menu:AddButton({
        label = "Tenue civile",
        value = nil,
        select = function()
            QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
                disableMovement = true,
                disableCombat = true,
            }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
                TriggerEvent("soz-character:Client:ApplyCurrentClothConfig")
            end)
        end,
    })

    FoodJob.Menu:AddButton({
        label = "Tenue de travail",
        value = nil,
        select = function()
            QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
                disableMovement = true,
                disableCombat = true,
            }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
                TriggerEvent("soz-character:Client:ApplyTemporaryClothSet", FoodConfig.Cloakroom[PlayerData.skin.Model.Hash])
            end)
        end,
    })

    FoodJob.Menu:Open()
end)

local function GenerateIngredientList(parent, ingredients)
    local submenu = MenuV:InheritMenu(parent)

    for itemId, count in pairs(ingredients) do
        local item = QBCore.Shared.Items[itemId]
        submenu:AddButton({label = item.label, rightLabel = count})
    end

    return submenu
end

local function GenerateSubmenu(parent, recipes, isIngredientMenu)
    local subtitle = nil
    if isIngredientMenu then
        subtitle = "Liste des ingrédients"
    end

    local submenu = MenuV:InheritMenu(parent, {subtitle = subtitle})

    if not isIngredientMenu then
        submenu:AddButton({
            icon = "👨‍🍳",
            label = "Liste des ingrédients",
            value = GenerateSubmenu(submenu, recipes, true),
        })
    end

    for itemId, recipe in pairs(recipes) do
        local item = QBCore.Shared.Items[itemId]

        local value = itemId
        if isIngredientMenu then
            value = GenerateIngredientList(submenu, recipe.ingredients)
        end

        submenu:AddButton({
            icon = "https://nui-img/soz-items/" .. item.name,
            label = item.label,
            value = value,
            select = function()
                if not isIngredientMenu then
                    TriggerEvent("soz-jobs:client:food-craft-item", itemId)
                    submenu:Close()
                    parent:Close()
                end
            end,
        })
    end

    return submenu
end

RegisterNetEvent("jobs:client:food:OpenCraftingMenu", function()
    local hasPermission = SozJobCore.Functions.HasPermission("food", SozJobCore.JobPermission.Food.Craft)
    if not hasPermission or not PlayerData.job.onduty then
        return
    end

    FoodJob.Menu:ClearItems()

    local recipesByCat = {}
    for itemId, recipe in pairs(FoodConfig.Recipes) do
        if recipesByCat[recipe.category] == nil then
            recipesByCat[recipe.category] = {[itemId] = recipe}
        else
            recipesByCat[recipe.category][itemId] = recipe
        end
    end
    for catId, recipes in pairs(recipesByCat) do
        local category = FoodConfig.Categories[catId]
        local submenu = GenerateSubmenu(FoodJob.Menu, recipes)
        FoodJob.Menu:AddButton({icon = category.icon, label = category.label, value = submenu})
    end

    FoodJob.Menu:Open()
end)

---
--- FARM
---
function DisplayHelpText()
    helpTextDisplayed = true
    Citizen.CreateThread(function()
        while currentField ~= nil and helpTextDisplayed do
            AddTextEntry("START_RESALE", "Appuyez sur ~INPUT_CONTEXT~ pour débuter la récolte")
            DisplayHelpTextThisFrame("START_RESALE", false)

            if IsControlJustReleased(0, 51) then
                helpTextDisplayed = false
                TriggerEvent("soz-jobs:client:food-collect-ingredients")
            end

            Citizen.Wait(0)
        end
    end)
end

function DisplayFieldHealth()
    Citizen.CreateThread(function()
        while currentFieldHealth ~= nil do
            SetTextFont(4)
            SetTextProportional(0)
            SetTextScale(0.5, 0.5)
            SetTextColour(255, 255, 255, 200)
            SetTextEdge(2, 0, 0, 0, 255)
            SetTextOutline()
            SetTextDropShadow(0, 0, 0, 0, 255)
            SetTextDropShadow()
            SetTextEntry("STRING")
            AddTextComponentString(FoodConfig.FieldHealthStates[currentFieldHealth])
            local x, y, width, height = 0.96, 1.44, 1.0, 1.0
            DrawText(x - width / 2, y - height / 2)
            Citizen.Wait(0)
        end
    end)
end

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

    QBCore.Functions.Progressbar("food-collect-ingredients", "Vous récoltez des ingrédients", FoodConfig.Collect.Duration, false, true,
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
                    for itemId, n in pairs(items) do
                        local item = QBCore.Shared.Items[itemId]
                        table.insert(messages, string.format("%d %s", n, item.label))
                    end
                    local joined = table.concat(messages, ", ")
                    exports["soz-hud"]:DrawNotification(string.format("Vous avez récolté ~g~%s", joined))

                    if currentFieldHealth == 0 then
                        exports["soz-hud"]:DrawNotification("Le champ est épuisé...", "warning")
                    else
                        TriggerEvent("soz-jobs:client:food-collect-ingredients")
                    end
                end
            end, field)
        else
            exports["soz-hud"]:DrawNotification("Vous n'avez pas recolté d'ingrédients", "error")
        end
    end, function()
        DisplayHelpText()
    end)
end

AddEventHandler("jobs:client:food-harvest-milk", function()
    QBCore.Functions.Progressbar("food-harvest-milk", "Vous récupérer des bidons de lait", FoodConfig.Collect.Milk.Duration, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, { animDict = "anim@mp_radio@garage@low", anim = "action_a" }, {}, {}, function()
        QBCore.Functions.TriggerCallback("soz-jobs:server:food-collect-milk", function(success, count)
            if success then
                exports["soz-hud"]:DrawNotification(string.format("Vous avez récupéré ~g~%s bidons de lait~s~", count))
                Citizen.Wait(1000)
                TriggerEvent("jobs:client:food-harvest-milk")
            end
        end)
    end, function()
        exports["soz-hud"]:DrawNotification("Vous avez ~r~interrompu~s~ la collecte de bidons de lait", "error")
    end)
end)

FoodJob.Functions.CraftItem = function(itemId, item)
    Citizen.CreateThread(function()
        QBCore.Functions.Progressbar("food-craft-item", string.format("Vous préparez 1 %s", item.label), FoodConfig.Collect.Duration, false, true,
                                     {
            disableMovement = true,
            disableCarMovement = true,
            disableMouse = false,
            disableCombat = true,
        }, {}, {}, {}, function(wasCancelled)
            if not wasCancelled then
                QBCore.Functions.TriggerCallback("soz-jobs:server:food-craft", function(success, reason)
                    if success then
                        exports["soz-hud"]:DrawNotification(string.format("Vous avez préparer ~g~1 %s", item.label))
                        Citizen.Wait(1000)
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
for animal, _ in pairs(FoodConfig.AnimalAllowedToHunt) do
    exports["qb-target"]:AddTargetModel(animal, {
        options = {
            {
                label = "Dépecer",
                icon = "c:food/depecer.png",
                event = "jobs:client:food:hunting",
                canInteract = function(entity)
                    return not IsPedAPlayer(entity) and IsEntityDead(entity)
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

    local ped = PlayerPedId()
    local hasKnife = GetSelectedPedWeapon(ped) == FoodConfig.HuntingWeapon

    if not hasKnife then
        SetCurrentPedWeapon(PlayerPedId(), "WEAPON_UNARMED")
    end
    TaskTurnPedToFaceEntity(ped, data.entity, 500)

    QBCore.Functions.RequestAnimDict("amb@medic@standing@kneel@base")
    QBCore.Functions.RequestAnimDict("anim@gangops@facility@servers@bodysearch@")
    TaskPlayAnim(ped, "amb@medic@standing@kneel@base", "base", 8.0, -8.0, -1, 1, 0, false, false, false)
    TaskPlayAnim(ped, "anim@gangops@facility@servers@bodysearch@", "player_search", 8.0, -8.0, -1, 48, 0, false, false, false)

    QBCore.Functions.Progressbar("hunting-cutup", "Dépeçage en cours...", 5000, false, false, {
        disableMovement = true,
        disableCombat = true,
    }, {}, {}, {}, function() -- Done
        if hasKnife then
            TriggerServerEvent("jobs:server:food:hunting", NetworkGetNetworkIdFromEntity(data.entity))
        else
            exports["soz-hud"]:DrawNotification("L'animal ne respire plus...", "info")
        end
    end)
end)
