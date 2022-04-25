QBCore = exports["qb-core"]:GetCoreObject()

local BennysInvoice = MenuV:CreateMenu(nil, "Factures Bennys", "menu_job_bennys", "soz", "bennys:menu:invoice")

local function OpenInvoiceMenu(menu, targetPlayer)
    local player = NetworkGetPlayerIndexFromPed(targetPlayer)
    menu:AddButton({
        label = "Factures personnalisées",
        value = nil,
        select = function()
            local title = exports["soz-hud"]:Input("Titre", 200)
            if title == nil or title == "" then
                exports["soz-hud"]:DrawNotification("Vous devez spécifier un title", "error")
                return
            end

            local amount = exports["soz-hud"]:Input("Montant", 10)
            if amount == nil or tonumber(amount) == nil or tonumber(amount) <= 0 then
                exports["soz-hud"]:DrawNotification("Vous devez spécifier un montant", "error")
                return
            end

            TriggerServerEvent("banking:server:sendInvoice", GetPlayerServerId(player), title, amount)
        end,
    })
end

local function GenerateInvoiceMenu(entity)
    if BennysInvoice.IsOpen then
        BennysInvoice:Close()
    else
        BennysInvoice:ClearItems()
        OpenInvoiceMenu(BennysInvoice, entity)
        BennysInvoice:Open()
    end
end

RegisterNetEvent("soz-bennys:client:OpenInvoiceMenu", function(entity)
    GenerateInvoiceMenu(entity)
end)

CreateThread(function()
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {
                label = "Facture",
                icon = "fas fa-file-invoice-dollar",
                event = "soz-bennys:client:OpenInvoiceMenu",
                job = "bennys",
                action = function(entity)
                    if IsPedAPlayer(entity) then
                        return false
                    end
                    TriggerEvent("soz-bennys:client:OpenInvoiceMenu", entity)
                end,
                canInteract = function(entity)
                    return OnDuty and not IsEntityPlayingAnim(entity, "dead", "dead_a", 3)
                end,
            },
        },
        distance = 2.5,
    })
end)
