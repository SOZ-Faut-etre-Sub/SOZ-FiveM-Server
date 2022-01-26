QBCore = exports["qb-core"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()
local safeStorageMenu = MenuV:CreateMenu("Coffre fort", "", "default", "soz", "safe-storage")
local isInsideBankZone = false

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

local bankSociety = BoxZone:Create(vector3(246.43, 223.79, 106.29), 2.0, 2.4, {name = "bank_society", heading = 340})
bankSociety:onPlayerInOut(function(isPointInside, point)
    isInsideBankZone = isPointInside
end)

CreateThread(function()
    for id, bank in pairs(Config.BankPedLocations) do
        if not QBCore.Functions.GetBlip("bank_" .. id) then
            QBCore.Functions.CreateBlip("bank_" .. id, {name = "Banque", coords = bank, sprite = 108, color = 2})
        end
        exports["qb-target"]:SpawnPed({
            {
                model = "ig_bankman",
                coords = bank,
                minusOne = true,
                freeze = true,
                invincible = true,
                blockevents = true,
                scenario = "WORLD_HUMAN_CLIPBOARD",
                target = {
                    options = {
                        {event = "banking:openBankScreen", icon = "fas fa-money-check", label = "Accéder au compte"},
                        {
                            event = "banking:openSocietyBankScreen",
                            icon = "fas fa-money-check",
                            label = "Accéder au compte Société",
                            canInteract = function(entity, distance, data)
                                return PlayerData.job.isboss and isInsideBankZone
                            end,
                        },
                    },
                    distance = 2.5,
                },
            },
        })
    end
end)

local function SafeStorageDeposit(money_type, safeStorage)
    local amount = exports["soz-hud"]:Input("Quantité", 12)

    if amount and tonumber(amount) > 0 then
        TriggerServerEvent("baking:server:SafeStorageDeposit", money_type, safeStorage, tonumber(amount))
    end
end

local function SafeStorageDepositAll(money_type, safeStorage)
    if PlayerData.money[money_type] and PlayerData.money[money_type] > 0 then
        TriggerServerEvent("baking:server:SafeStorageDeposit", money_type, safeStorage, PlayerData.money[money_type])
    end
end

local function SafeStorageWithdraw(money_type, safeStorage)
    local amount = exports["soz-hud"]:Input("Quantité", 12)

    if amount and tonumber(amount) > 0 then
        TriggerServerEvent("baking:server:SafeStorageWithdraw", money_type, safeStorage, tonumber(amount))
    end
end

local function OpenSafeStorageMenu(safeStorage, money, black_money)
    safeStorageMenu:ClearItems()

    local moneyMenu = MenuV:InheritMenu(safeStorageMenu, {subtitle = ("Gestion de l'argent (%s$)"):format(money)})
    local moneyDeposit = moneyMenu:AddButton({label = "Déposer"})
    local moneyDepositAll = moneyMenu:AddButton({label = "Tout déposer"})
    local moneyWithdraw = moneyMenu:AddButton({label = "Retirer"})

    moneyDeposit:On("select", function()
        SafeStorageDeposit("money", safeStorage)
        MenuV:CloseAll()
    end)
    moneyDepositAll:On("select", function()
        SafeStorageDepositAll("money", safeStorage)
        MenuV:CloseAll()
    end)
    moneyWithdraw:On("select", function()
        SafeStorageWithdraw("money", safeStorage)
        MenuV:CloseAll()
    end)

    local markedMoneyMenu = MenuV:InheritMenu(safeStorageMenu, {
        subtitle = ("Gestion de l'argent sale (%s$)"):format(black_money),
    })
    local markedMoneyDeposit = markedMoneyMenu:AddButton({label = "Déposer"})
    local markedMoneyDepositAll = markedMoneyMenu:AddButton({label = "Tout déposer"})
    local markedMoneyWithdraw = markedMoneyMenu:AddButton({label = "Retirer"})

    markedMoneyDeposit:On("select", function()
        SafeStorageDeposit("marked_money", safeStorage)
        MenuV:CloseAll()
    end)
    markedMoneyDepositAll:On("select", function()
        SafeStorageDepositAll("marked_money", safeStorage)
        MenuV:CloseAll()
    end)
    markedMoneyWithdraw:On("select", function()
        SafeStorageWithdraw("marked_money", safeStorage)
        MenuV:CloseAll()
    end)

    safeStorageMenu:AddButton({label = "Argent", value = moneyMenu, rightLabel = "~g~" .. money .. "$"})
    safeStorageMenu:AddButton({label = "Argent Sale", value = markedMoneyMenu, rightLabel = "~r~" .. black_money .. "$"})

    safeStorageMenu:Open()
end

CreateThread(function()
    while true do
        for id, safe in pairs(Config.SafeStorages) do
            if safe.owner == nil or (PlayerData.job ~= nil and PlayerData.job.name == safe.owner) then
                local dist = #(GetEntityCoords(PlayerPedId()) - safe.position)

                if dist <= 1.5 then
                    QBCore.Functions.ShowHelpNotification("~INPUT_CONTEXT~ Pour accéder à ~b~" .. safe.label)
                    if IsControlJustPressed(1, 51) then
                        QBCore.Functions.TriggerCallback("banking:server:openSafeStorage", function(isAllowed, money, black_money)
                            if isAllowed then
                                OpenSafeStorageMenu(id, money, black_money)
                            else
                                exports["soz-hud"]:DrawNotification("~r~Vous n'avez pas accès a ce coffre")
                            end
                        end, id)
                    end
                end
            end
        end

        Wait(2)
    end
end)
