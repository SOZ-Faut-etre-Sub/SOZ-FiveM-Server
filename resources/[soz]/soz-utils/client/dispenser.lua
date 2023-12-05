QBCore = exports["qb-core"]:GetCoreObject()

local vending_machine_drink = {992069095, 1114264700, -1691644768, -742198632}

local vending_machine_food = {-654402915}

local vending_cafe = {690372739}

local dispenser_eat_price = 10
local dispenser_drink_price = 10
local dispenser_cafe_price = 10

exports["qb-target"]:AddTargetModel(vending_machine_drink, {
    options = {
        {
            event = "soz-utils:client:dispenser:Drink",
            label = "Bouteille d'eau ($" .. dispenser_eat_price .. ")",
            icon = "c:food/bouteille.png",
        },
    },
    distance = 1,
})

exports["qb-target"]:AddTargetModel(vending_machine_food, {
    options = {
        {
            event = "soz-utils:client:dispenser:Eat",
            label = "Sandwich ($" .. dispenser_drink_price .. ")",
            icon = "c:food/baguette.png",
        },
    },
    distance = 1,
})

exports["qb-target"]:AddTargetModel(vending_cafe, {
    options = {
        {
            event = "soz-utils:client:dispenser:Cafe",
            label = "Café ($" .. dispenser_cafe_price .. ")",
            icon = "c:food/cafe.png",
        },
    },
    distance = 1,
})

RegisterNetEvent("soz-utils:client:dispenser:Eat")
AddEventHandler("soz-utils:client:dispenser:Eat", function()
    local Player = QBCore.Functions.GetPlayerData()
    if Player.money.money < dispenser_eat_price then
        exports["soz-core"]:DrawNotification("Vous n'avez pas assez d'argent")
    else
        QBCore.Functions.Progressbar("dispenser_eat", "Achète à manger...", 5000, false, true,
                                     {
            disableMovement = true,
            disableCarMovement = false,
            disableMouse = false,
            disableCombat = true,
        }, {animDict = "mini@sprunk", anim = "plyr_buy_drink_pt1", flags = 16}, {}, {}, function() -- Done
            TriggerServerEvent("soz-utils:server:dispenser:pay", dispenser_eat_price, "sandwich")
        end)
    end
end)

RegisterNetEvent("soz-utils:client:dispenser:Drink")
AddEventHandler("soz-utils:client:dispenser:Drink", function()
    local Player = QBCore.Functions.GetPlayerData()
    if Player.money.money < dispenser_drink_price then
        exports["soz-core"]:DrawNotification("Vous n'avez pas assez d'argent")
    else
        QBCore.Functions.Progressbar("dispenser_drink", "Achète à boire...", 5000, false, true,
                                     {
            disableMovement = true,
            disableCarMovement = false,
            disableMouse = false,
            disableCombat = true,
        }, {animDict = "mini@sprunk", anim = "plyr_buy_drink_pt1", flags = 16}, {}, {}, function() -- Done
            TriggerServerEvent("soz-utils:server:dispenser:pay", dispenser_drink_price, "water_bottle")
        end)
    end
end)

RegisterNetEvent("soz-utils:client:dispenser:Cafe")
AddEventHandler("soz-utils:client:dispenser:Cafe", function()
    local Player = QBCore.Functions.GetPlayerData()
    if Player.money.money < dispenser_cafe_price then
        exports["soz-core"]:DrawNotification("Vous n'avez pas assez d'argent")
    else
        QBCore.Functions.Progressbar("dispenser_cafe", "Achète un Café...", 5000, false, true,
                                     {
            disableMovement = true,
            disableCarMovement = false,
            disableMouse = false,
            disableCombat = true,
        }, {animDict = "mini@sprunk", anim = "plyr_buy_drink_pt1", flags = 16}, {}, {}, function() -- Done
            TriggerServerEvent("soz-utils:server:dispenser:pay", dispenser_cafe_price, "coffee")
        end)
    end
end)
