QBCore = exports["qb-core"]:GetCoreObject()

local vending_machine_drink = {992069095, 1114264700, -1691644768, -742198632}

local vending_machine_food = {-654402915}

local vending_cafe = {690372739}

exports["qb-target"]:AddTargetModel(vending_machine_drink, {
    options = {{event = "soz-core:client:dispenser:Drink", label = "Bouteille d'eau", icon = "c:food/bouteille.png"}},
    distance = 1,
})

exports["qb-target"]:AddTargetModel(vending_machine_food,
                                    {
    options = {{event = "soz-core:client:dispenser:Eat", label = "Sandiwch", icon = "c:food/baguette.png"}},
    distance = 1,
})

exports["qb-target"]:AddTargetModel(vending_cafe,
                                    {
    options = {{event = "soz-core:client:dispenser:Cafe", label = "Café", icon = "c:food/cafe.png"}},
    distance = 1,
})

RegisterNetEvent("soz-core:client:dispenser:Eat")
AddEventHandler("soz-core:client:dispenser:Eat", function()
    local Player = QBCore.Functions.GetPlayerData()
    local price = 10
    if Player.money.money < price then
        exports["soz-hud"]:DrawNotification("Vous n'avez pas assez d'argent")
    else
        QBCore.Functions.Progressbar("dispenser_eat", "Achète à manger...", 5000, false, true,
                                     {
            disableMovement = true,
            disableCarMovement = false,
            disableMouse = false,
            disableCombat = true,
        }, {animDict = "mini@sprunk", anim = "plyr_buy_drink_pt1", flags = 16}, {}, {}, function() -- Done
            TriggerServerEvent("soz-core:server:dispenser:pay", price, "sandwich")
        end)
    end
end)

RegisterNetEvent("soz-core:client:dispenser:Drink")
AddEventHandler("soz-core:client:dispenser:Drink", function()
    local Player = QBCore.Functions.GetPlayerData()
    local price = 10
    if Player.money.money < price then
        exports["soz-hud"]:DrawNotification("Vous n'avez pas assez d'argent")
    else
        QBCore.Functions.Progressbar("dispenser_drink", "Achète à boire...", 5000, false, true,
                                     {
            disableMovement = true,
            disableCarMovement = false,
            disableMouse = false,
            disableCombat = true,
        }, {animDict = "mini@sprunk", anim = "plyr_buy_drink_pt1", flags = 16}, {}, {}, function() -- Done
            TriggerServerEvent("soz-core:server:dispenser:pay", price, "water_bottle")
        end)
    end
end)

RegisterNetEvent("soz-core:client:dispenser:Cafe")
AddEventHandler("soz-core:client:dispenser:Cafe", function()
    local Player = QBCore.Functions.GetPlayerData()
    local price = 10
    if Player.money.money < price then
        exports["soz-hud"]:DrawNotification("Vous n'avez pas assez d'argent")
    else
        QBCore.Functions.Progressbar("dispenser_cafe", "Achète un Café...", 5000, false, true,
                                     {
            disableMovement = true,
            disableCarMovement = false,
            disableMouse = false,
            disableCombat = true,
        }, {animDict = "mini@sprunk", anim = "plyr_buy_drink_pt1", flags = 16}, {}, {}, function() -- Done
            TriggerServerEvent("soz-core:server:dispenser:pay", price, "coffee")
        end)
    end
end)
