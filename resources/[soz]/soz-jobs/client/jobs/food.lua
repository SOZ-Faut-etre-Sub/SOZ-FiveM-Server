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
                    DisplayFieldHealth(true)
                end, zone.name)
            else
                currentField = nil
                currentFieldHealth = nil
                DisplayFieldHealth(false)
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

local function SpawnJobZones()
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

    -- CRAFTING
    CreateObjectNoOffset(GetHashKey("prop_copper_pan"), -1882.63, 2069.25, 141.0, false, false, false)
    exports["qb-target"]:AddBoxZone("food:craft", vector2(-1882.67, 2069.31), 0.75, 0.75, {
        heading = 250.0,
        minZ = 141.0,
        maxZ = 141.5,
    }, {options = {{icon = "c:food/cuisiner.png", event = "jobs:client:food:OpenCraftingMenu", label = "Cuisiner"}}})

    -- MILK
    exports["qb-target"]:AddBoxZone("food:milk_harvest", vector2(2416.83, 4994.29), 1.0, 5.0, {
        heading = 133.3,
        minZ = 45.5,
        maxZ = 49.5,
    }, {options = {{icon = "c:food/collecter.png", event = "jobs:client:food-harvest-milk", label = "Récupérer"}}})

    exports["qb-target"]:AddBoxZone("food:milk-process", vector2(-1929.02, 2059.16), 0.5, 1.5, {
        heading = 166.6,
        minZ = 140.0,
        maxZ = 142.5,
    }, {options = {{icon = "c:food/echanger.png", event = "jobs:client:food-process-milk", label = "Echanger"}}})
end

local function InitJob()
    Citizen.CreateThread(function()
        SpawnJobZones()
        SpawnFieldZones()
    end)
end

local function DestroyJob()
    local zoneNames = {"food:cloakroom", "food:craft", "food:milk_harvest", "food:milk-process"}
    for _, name in ipairs(zoneNames) do
        exports["qb-target"]:RemoveZone(name)
    end
    DespawnFieldZones()
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

    -- TARGET
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {label = "Facturer", icon = "c:jobs/facture.png", event = "jobs:client:food:InvoicePlayer", job = "food"},
        },
        distance = 1.5,
    })
end)
AddEventHandler("jobs:client:food-toggle-duty", function()
    if not PlayerData.job.onduty then
        InitJob()
    else
        DestroyJob()
    end
    TriggerServerEvent("QBCore:ToggleDuty")
end)

RegisterNetEvent("jobs:client:food:InvoicePlayer", function(data)
    local player = NetworkGetPlayerIndexFromPed(data.entity)

    local title = exports["soz-hud"]:Input("Titre", 200)
    if title == nil or title == "" then
        exports["soz-hud"]:DrawNotification("Vous devez spécifier un title", "error")
        return
    end

    local amount = exports["soz-hud"]:Input("Montant", 0)
    if amount == nil or tonumber(amount) == nil or tonumber(amount) <= 0 then
        exports["soz-hud"]:DrawNotification("Vous devez spécifier un montant", "error")
        return
    end

    TriggerServerEvent("banking:server:sendInvoice", GetPlayerServerId(player), title, amount)
end)

---
--- MENUS
---
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

local function GetRecipesByCat()
    local recipesByCat = {}
    for itemId, recipe in pairs(FoodConfig.Recipes) do
        if recipesByCat[recipe.category] == nil then
            recipesByCat[recipe.category] = {[itemId] = recipe}
        else
            recipesByCat[recipe.category][itemId] = recipe
        end
    end
    return recipesByCat
end

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

    for catId, recipes in pairs(GetRecipesByCat()) do
        local category = FoodConfig.Categories[catId]
        local submenu = GenerateSubmenu(FoodJob.Menu, recipes)
        FoodJob.Menu:AddButton({icon = category.icon, label = category.label, value = submenu})
    end

    FoodJob.Menu:Open()
end)

RegisterNetEvent("jobs:client:food:OpenSocietyMenu", function()
    FoodJob.Menu:ClearItems()

    -- RECIPES
    local recipesMenu = MenuV:InheritMenu(FoodJob.Menu)
    for catId, recipes in pairs(GetRecipesByCat()) do
        local category = FoodConfig.Categories[catId]
        local submenu = GenerateSubmenu(recipesMenu, recipes, true)
        recipesMenu:AddButton({icon = category.icon, label = category.label, value = submenu})
    end
    FoodJob.Menu:AddButton({icon = "👨‍🍳", label = "Livre des recettes", value = recipesMenu})

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

function DisplayFieldHealth(newVisibility)
    if newVisibility then
        SendNUIMessage({
            action = "show",
            health = FoodConfig.FieldHealthStates[currentFieldHealth],
            field = string.match(currentField, "%a+"),
        })
    else
        SendNUIMessage({action = "hide"})
    end
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
    }, {animDict = "anim@mp_radio@garage@low", anim = "action_a"}, {}, {}, function()
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

FoodJob.Functions.GetItemCountFromInventory = function(itemName)
    for _, item in pairs(PlayerData.items or {}) do
        if item.name == itemName then
            return item.amount
        end
    end
end

AddEventHandler("jobs:client:food-process-milk", function()
    local count = FoodJob.Functions.GetItemCountFromInventory(FoodConfig.Collect.Milk.Item)
    if not count or count < 1 then
        exports["soz-hud"]:DrawNotification("Vous n'avez pas de bidons de lait sur vous", "error")
        return
    end

    QBCore.Functions.Progressbar("food-process-milk", "Vous transformez 1 bidon de lait", FoodConfig.Process.Duration, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "anim@mp_radio@garage@low", anim = "action_a"}, {}, {}, function()
        QBCore.Functions.TriggerCallback("soz-jobs:server:food-process-milk", function(success, count)
            if success then
                exports["soz-hud"]:DrawNotification(string.format("Vous avez transformé ~b~1 bidon de lait~s~ en ~g~%d briques de lait~s~", count))
                Citizen.Wait(1000)
                TriggerEvent("jobs:client:food-process-milk")
            end
        end)
    end, function()
        exports["soz-hud"]:DrawNotification("Vous avez ~r~interrompu~s~ la transformation de bidons de lait", "error")
    end)
end)

FoodJob.Functions.CraftItem = function(itemId, item)
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
        QBCore.Functions.Progressbar("food-craft-item", string.format("Vous préparez 1 %s", item.label), FoodConfig.Collect.Grape.Duration, false, true,
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
        SetCurrentPedWeapon(ped, "WEAPON_UNARMED")
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
