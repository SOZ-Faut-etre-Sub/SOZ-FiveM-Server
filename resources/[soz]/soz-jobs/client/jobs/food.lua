FoodJob = {}
FoodJob.Functions = {}
FoodJob.Menu = MenuV:CreateMenu(nil, "", "menu_job_food", "soz", "food:menu")

local currentField

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

    -- ZONES
    for zoneName, points in pairs(FoodConfig.Zones) do
        local zone = PolyZone:Create(points, {
            name = zoneName,
            debugPoly = true,
        })
        zone:onPlayerInOut(function(isInsideZone)
            if isInsideZone then
                currentField = zone.name
            else
                currentField = nil
            end
        end)
    end
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

local function GenerateSubmenu(parent, recipes)
    local submenu = MenuV:InheritMenu(parent)

    for itemId, _ in pairs(recipes) do
        local item = QBCore.Shared.Items[itemId]
        submenu:AddButton({
            icon = "https://nui-img/soz-items/" .. item.name,
            label = item.label,
            value = itemId,
            select = function()
                TriggerEvent("soz-jobs:client:food-craft-item", itemId)
                submenu:Close()
                parent:Close()
            end,
        })
    end

    return submenu
end

RegisterNetEvent("jobs:client:food:OpenCraftingMenu", function()
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
Citizen.CreateThread(function()
    exports["qb-target"]:AddBoxZone("food:farm", vector2(-1860.0, 2098.38), 2.0, 8.0, {
        heading = 25.0,
        minZ = 137.0,
        maxZ = 140.0,
    }, {
        options = {
            {
                icon = "c:food/collecter.png",
                label = "Collecter",
                event = "soz-jobs:client:food-collect-ingredients",
                canInteract = function()
                    return true
                end,
            },
        },
    })

    local coords = vector4(-1882.67, 2069.31, 141.01, 245.89)
    CreateObjectNoOffset(GetHashKey("prop_copper_pan"), coords.x, coords.y, coords.z, false, false, false)
    exports["qb-target"]:AddBoxZone("food:craft", vector2(coords.x, coords.y), 0.75, 0.75, {
        heading = 250.0,
        minZ = 141.0,
        maxZ = 141.5,
    }, {options = {{icon = "c:food/cuisiner.png", label = "Cuisiner", event = "jobs:client:food:OpenCraftingMenu"}}})
end)

AddEventHandler("soz-jobs:client:food-collect-ingredients", function()
    Citizen.CreateThread(function()
        local range = FoodConfig.Collect.Range
        local count = math.random(range.min, range.max)
        FoodJob.Functions.CollectIngredients(count)
    end)
end)

FoodJob.Functions.CollectIngredients = function(count)
    QBCore.Functions.Progressbar("food-collect-ingredients", "Vous collectez des ingrédients", FoodConfig.Collect.Duration, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = false,
    }, {}, {}, {}, function(wasCancelled)
        if not wasCancelled then
            QBCore.Functions.TriggerCallback("soz-jobs:server:food-collect-ingredients", function(items)
                if next(items) then
                    local messages = {}
                    for itemId, n in pairs(items) do
                        local item = QBCore.Shared.Items[itemId]
                        table.insert(messages, string.format("%d %s", n, item.label))
                    end
                    local joined = table.concat(messages, ", ")
                    exports["soz-hud"]:DrawNotification(string.format("Vous avez collectez ~g~%s", joined))
                    TriggerEvent("soz-jobs:client:food-collect-ingredients")
                end
            end, count)
        else
            exports["soz-hud"]:DrawNotification("Vous n'avez pas collecté d'ingrédients", "error")
        end
    end)
end

FoodJob.Functions.CraftItem = function(itemId, item)
    Citizen.CreateThread(function()
        QBCore.Functions.Progressbar("food-craft-item", string.format("Vous préparez 1 %s", item.label), FoodConfig.Collect.Duration, false, true,
                                     {
            disableMovement = true,
            disableCarMovement = true,
            disableMouse = false,
            disableCombat = false,
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

function DisplayFarmState(state)
    return "🍇🍇🍇➖" or "🍇➖➖➖"
end
