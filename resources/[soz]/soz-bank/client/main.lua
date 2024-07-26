QBCore = exports["qb-core"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()
local isInsideEntrepriseBankZone = false

local currentBank = {}
exports("GetCurrentBank", function()
    return currentBank
end)

AddEventHandler("locations:zone:enter", function(bankType, bankName)
    if Config.BankPedLocations[bankName] ~= nil then
        currentBank = { bank = bankName, type = string.match(bankName, "%a+") }
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
                return PlayerData.job.onduty and exports["soz-core"]:HasJobPermission(PlayerData.job.id, "society-bank-account") and isInsideEntrepriseBankZone
            end,
        },
    }

    for _, item in pairs({ "small_moneybag", "medium_moneybag", "big_moneybag" }) do
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
                local maxMoney = Config.BankAtmDefault[currentBank.type].maxMoney

                TriggerServerEvent("soz-core:server:job:stonk:fill-in", "bank_" .. currentBank.bank, item, maxMoney)
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
                QBCore.Functions.CreateBlip("bank_" .. bank, { name = "Banque", coords = coords, sprite = 108, color = 2 })
            end
        end
        local model = "ig_bankman"
        exports["qb-target"]:SpawnPed({
            {
                model = model,
                coords = coords,
                minusOne = true,
                freeze = true,
                invincible = true,
                blockevents = true,
                scenario = "WORLD_HUMAN_CLIPBOARD",
                target = { options = bankActions, distance = 3.0 },
            },
        })
    end

    local function atmRefillAction(atmType, item)
        return {
            label = "Remplir avec " .. QBCore.Shared.Items[item].label,
            icon = "c:stonk/remplir.png",
            blackoutGlobal = true,
            blackoutJob = "cash-transfer",
            canInteract = function(entity)
                if atmType ~= "ent" then
                    return false
                end

                local currentMoney = QBCore.Functions.TriggerRpc("banking:server:getAtmMoney", atmType, GetEntityCoords(entity))
                if currentMoney < Config.BankAtmDefault[atmType].maxMoney then
                    return PlayerData.job.onduty
                end

                return false
            end,
            action = function(entity)
                local atm = QBCore.Functions.TriggerRpc("banking:server:getAtmAccount", atmType, GetEntityCoords(entity))
                local maxMoney = Config.BankAtmDefault[atmType].maxMoney

                TriggerServerEvent("soz-core:server:job:stonk:fill-in", atm.account, item, maxMoney)
            end,
            item = item,
        }
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
                atmRefillAction(atmType, "small_moneybag"),
                atmRefillAction(atmType, "medium_moneybag"),
                atmRefillAction(atmType, "big_moneybag"),
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
