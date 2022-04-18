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
    options = {{event = "soz-core:client:dispenser:Eat", label = "Baguette", icon = "c:food/baguette.png"}},
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
            TriggerServerEvent("soz-core:server:dispenser:pay", price)
            TaskPlayAnim(PlayerPedId(), "mp_player_inteat@burger", "mp_player_int_eat_burger_fp", 8.0, -8.0, -1, 0, 0.0, true, true, true)
            TriggerServerEvent("QBCore:Server:SetMetaData", "hunger", QBCore.Functions.GetPlayerData().metadata["hunger"] + 10)
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
            TriggerServerEvent("soz-core:server:dispenser:pay", price)
            TaskPlayAnim(PlayerPedId(), "mp_player_intdrink", "loop_bottle", 8.0, -8.0, -1, 0, 0.0, true, true, true)
            TriggerServerEvent("QBCore:Server:SetMetaData", "thirst", QBCore.Functions.GetPlayerData().metadata["thirst"] + 10)
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
            TriggerServerEvent("soz-core:server:dispenser:pay", price)
            TaskPlayAnim(PlayerPedId(), "amb@world_human_drinking@coffee@male@idle_a", "idle_c", 8.0, -8.0, -1, 0, 0.0, true, true, true)
            TriggerServerEvent("QBCore:Server:SetMetaData", "thirst", QBCore.Functions.GetPlayerData().metadata["thirst"] + 5)
            TriggerServerEvent("QBCore:Server:SetMetaData", "hunger", QBCore.Functions.GetPlayerData().metadata["hunger"] + 5)
        end)
    end
end)
