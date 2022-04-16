QBCore = exports["qb-core"]:GetCoreObject()
SozJobCore = exports["soz-jobs"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()
local safeStorageMenu = MenuV:CreateMenu(nil, "", "menu_inv_safe", "soz", "safe-storage")
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
    for bank, coords in pairs(Config.BankPedLocations) do
        if not QBCore.Functions.GetBlip("bank_" .. bank) then
            QBCore.Functions.CreateBlip("bank_" .. bank, {name = "Banque", coords = coords, sprite = 108, color = 2})
        end
        exports["qb-target"]:SpawnPed({
            {
                model = "ig_bankman",
                coords = coords,
                minusOne = true,
                freeze = true,
                invincible = true,
                blockevents = true,
                scenario = "WORLD_HUMAN_CLIPBOARD",
                target = {
                    options = {
                        {
                            label = "Compte Personnel",
                            icon = "c:bank/compte_personal.png",
                            event = "banking:openBankScreen",
                        },
                        {
                            label = "Compte Société",
                            icon = "c:bank/compte_societe.png",
                            event = "banking:openSocietyBankScreen",
                            canInteract = function(entity, distance, data)
                                return SozJobCore.Functions.HasPermission(PlayerData.job.id, SozJobCore.JobPermission.SocietyBankAccount) and isInsideBankZone
                            end,
                        },
                        {
                            label = "Vendre",
                            icon = "c:stonk/vendre.png",
                            event = "soz-jobs:client:stonk-resale-bag",
                            canInteract = function()
                                return isInsideBankZone and exports["soz-jobs"]:CanBagsBeResold()
                            end,
                        },
                        {
                            label = "Remplir",
                            icon = "c:stonk/remplir.png",
                            event = "soz-jobs:client:stonk-fill-in",
                            bank = bank,
                            coords = coords,
                            canInteract = function()
                                local hasJobPermission = exports["soz-jobs"]:CanFillIn() and isInsideBankZone
                                if not hasJobPermission then
                                    return false
                                end

                                local p = promise.new()
                                QBCore.Functions.TriggerCallback("banking:server:getBankMoney", function(money)
                                    local bankType = string.match(string.match(bank, "%a+%d"), "%a+")
                                    if money < Config.BankAtmDefault[bankType].maxMoney then
                                        p:resolve(true)
                                    end
                                    p:resolve(false)
                                end, bank)
                                return Citizen.Await(p)
                            end,
                        },
                    },
                    distance = 2.5,
                },
            },
        })
    end

    for model, atmType in pairs(Config.ATMModels) do
        exports["qb-target"]:AddTargetModel(model, {
            options = {
                {
                    event = "banking:openATMScreen",
                    icon = "c:bank/compte_personal.png",
                    label = "Compte Personnel",
                    atmType = atmType,
                },
                {
                    label = "Remplir",
                    icon = "c:stonk/remplir.png",
                    event = "soz-jobs:client:stonk-fill-in",
                    atmType = atmType,
                    canInteract = function(entity)
                        local hasJobPermission = exports["soz-jobs"]:CanFillIn()
                        if not hasJobPermission then
                            return false
                        end

                        local p = promise.new()
                        QBCore.Functions.TriggerCallback("banking:server:getAtmMoney", function(money)
                            if money < Config.BankAtmDefault[atmType].maxMoney then
                                p:resolve(true)
                            end
                            p:resolve(false)
                        end, atmType, GetEntityCoords(entity))
                        return Citizen.Await(p)
                    end,
                },
            },
            distance = 1.0,
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
    for id, safe in pairs(Config.SafeStorages) do
        exports["qb-target"]:AddBoxZone("safe:" .. id, safe.position, safe.size and safe.size.x or 1.0, safe.size and safe.size.y or 1.0, {
            name = "safe:" .. id,
            heading = safe.heading or 0.0,
            minZ = safe.position.z - (safe.offsetDownZ or 1.0),
            maxZ = safe.position.z + (safe.offsetUpZ or 1.0),
            debugPoly = safe.debug or false,
        }, {
            options = {
                {
                    label = "Ouvrir",
                    icon = "c:bank/compte_safe.png",
                    event = "banking:client:qTargetOpenSafe",
                    SafeId = id,
                    safe = safe,
                    job = safe.owner,
                },
            },
            distance = 2.5,
        })
    end
end)

RegisterNetEvent("banking:client:qTargetOpenSafe", function(data)
    if data.safe.owner == nil or (PlayerData.job ~= nil and PlayerData.job.id == data.safe.owner) then
        QBCore.Functions.TriggerCallback("banking:server:openSafeStorage", function(isAllowed, money, black_money)
            if isAllowed then
                OpenSafeStorageMenu(data.SafeId, money, black_money)
            else
                exports["soz-hud"]:DrawNotification("Vous n'avez pas accès a ce coffre", "error")
            end
        end, data.SafeId)
    end
end)
