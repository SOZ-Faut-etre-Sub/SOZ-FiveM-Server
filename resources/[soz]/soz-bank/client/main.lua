QBCore = exports["qb-core"]:GetCoreObject()
SozJobCore = exports["soz-jobs"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()
local safeStorageMenu = MenuV:CreateMenu(nil, "", "menu_inv_safe", "soz", "safe-storage")
local safeHouseStorageMenu = MenuV:CreateMenu(nil, "", "menu_inventory", "soz", "safe-house-storage")
local isInsideEntrepriseBankZone = false

local currentBank = {}
exports("GetCurrentBank", function()
    return currentBank
end)

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

AddEventHandler("locations:zone:enter", function(bankType, bankName)
    if Config.BankPedLocations[bankName] ~= nil then
        currentBank = {bank = bankName, type = string.match(bankName, "%a+")}
    end
end)

AddEventHandler("locations:zone:exit", function(bankType, bankName)
    if Config.BankPedLocations[bankName] ~= nil then
        currentBank = {}
    end
end)

local bankSociety = BoxZone:Create(vector3(246.43, 223.79, 106.29), 2.0, 15.0, {
    name = "bank_society",
    heading = 340,
    minZ = 105.29,
    maxZ = 108.29,
})
bankSociety:onPlayerInOut(function(isPointInside, point)
    isInsideEntrepriseBankZone = isPointInside
end)

CreateThread(function()
    local bankActions = {
        {
            label = "Compte Personnel",
            icon = "c:bank/compte_personal.png",
            event = "banking:openBankScreen",
            blackoutGlobal = true,
        },
        {
            label = "Compte Société",
            icon = "c:bank/compte_societe.png",
            event = "banking:openSocietyBankScreen",
            blackoutGlobal = true,
            canInteract = function(entity, distance, data)
                return SozJobCore.Functions.HasPermission(PlayerData.job.id, SozJobCore.JobPermission.SocietyBankAccount) and isInsideEntrepriseBankZone
            end,
        },
    }

    for _, item in pairs({"small_moneybag", "medium_moneybag", "big_moneybag"}) do
        table.insert(bankActions, {
            label = "Remplir avec " .. QBCore.Shared.Items[item].label,
            icon = "c:stonk/remplir.png",
            blackoutGlobal = true,
            blackoutJob = "cash-transfer",
            canInteract = function()
                if currentBank.bank and currentBank.type then
                    local currentMoney = QBCore.Functions.TriggerRpc("banking:server:getBankMoney", currentBank.bank)
                    if currentMoney < Config.BankAtmDefault[currentBank.type].maxMoney then
                        return PlayerData.job.onduty
                    end
                    return false
                end
            end,
            action = function()
                local currentMoney = QBCore.Functions.TriggerRpc("banking:server:getBankMoney", currentBank.bank)
                local maxMoney = Config.BankAtmDefault[currentBank.type].maxMoney

                TriggerServerEvent("soz-core:server:job:stonk:fill-in", currentBank.bank, item, currentMoney, maxMoney)
            end,
            item = item,
        })
    end

    for bank, coords in pairs(Config.BankPedLocations) do
        if not QBCore.Functions.GetBlip("bank_" .. bank) then
            if bank == "pacific1" then
                QBCore.Functions.CreateBlip("bank_" .. bank, {
                    name = "Pacific Bank",
                    coords = coords,
                    sprite = 108,
                    color = 28,
                    scale = 1.0,
                })
            elseif string.match(bank, "fleeca%d+") then
                QBCore.Functions.CreateBlip("bank_" .. bank, {name = "Banque", coords = coords, sprite = 108, color = 2})
            end
        end
        local model = (GetConvarInt("feature_halloween", 0) == 1 and "u_f_m_drowned_01") or "ig_bankman"
        exports["qb-target"]:SpawnPed({
            {
                model = model,
                coords = coords,
                minusOne = true,
                freeze = true,
                invincible = true,
                blockevents = true,
                scenario = "WORLD_HUMAN_CLIPBOARD",
                target = {options = bankActions, distance = 3.0},
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
            },
            distance = 1.0,
        })
    end
    for id, atmData in pairs(Config.AtmLocations) do
        if atmData.hideBlip ~= true then
            CreateAtmBlip(id, atmData.coords)
        end
    end
end)

function CreateAtmBlip(blipId, coords)
    if QBCore.Functions.GetBlip(blipId) then
        QBCore.Functions.RemoveBlip(blipId)
    end
    QBCore.Functions.CreateBlip(blipId, {
        name = "ATM",
        coords = vector2(coords.x, coords.y),
        sprite = 278,
        color = 60,
        alpha = 100,
    })
end

RegisterNetEvent("banking:client:displayAtmBlips", function(newAtmCoords)
    for atmAccount, coords in pairs(newAtmCoords) do
        CreateAtmBlip(atmAccount, coords)
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
        subtitle = ("Gestion de l'argent marqué (%s$)"):format(black_money),
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
    safeStorageMenu:AddButton({
        label = "Argent Marqué",
        value = markedMoneyMenu,
        rightLabel = "~r~" .. black_money .. "$",
    })

    safeStorageMenu:Open()
end

local function OpenHouseSafeStorageMenu(safeStorage, money, black_money)
    safeHouseStorageMenu:ClearItems()

    local markedMoneyMenu = MenuV:InheritMenu(safeHouseStorageMenu, {
        subtitle = ("Gestion de l'argent marqué (%s$)"):format(black_money),
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

    safeHouseStorageMenu:AddButton({
        label = "Argent Marqué",
        value = markedMoneyMenu,
        rightLabel = "~r~" .. black_money .. "$",
    })

    safeHouseStorageMenu:Open()
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

RegisterNetEvent("banking:client:openHouseSafe", function(houseid)
    QBCore.Functions.TriggerCallback("banking:server:openHouseSafeStorage", function(isAllowed, money, black_money)
        if isAllowed then
            OpenHouseSafeStorageMenu(houseid, money, black_money)
        else
            exports["soz-hud"]:DrawNotification("Vous n'avez pas accès a ce coffre", "error")
        end
    end, houseid)
end)
