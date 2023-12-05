StonkJob = {}
StonkJob.Functions = {}
StonkJob.Functions.Menu = {}
StonkJob.Menus = {}
StonkJob.Permissions = {}
StonkJob.CollectedShops = {} -- In-memory, player-based save

Citizen.CreateThread(function()
    -- MENU
    StonkJob.Menus["cash-transfer"] = {
        menu = MenuV:CreateMenu(nil, "Stonk Security", "menu_job_carrier", "soz", "stonk:menu"),
    }
    -- DUTY
    exports["qb-target"]:AddBoxZone("stonk:duty", vector2(-18.74, -707.44), 0.2, 0.5, {
        heading = 200.0,
        minZ = 45.9,
        maxZ = 46.45,
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
                job = SozJobCore.JobType.CashTransfer,
            },
            {
                icon = "fas fa-sign-out-alt",
                label = "Fin de service",
                type = "server",
                event = "QBCore:ToggleDuty",
                canInteract = function()
                    return PlayerData.job.onduty
                end,
                job = SozJobCore.JobType.CashTransfer,
            },
            {
                type = "server",
                event = "QBCore:GetEmployOnDuty",
                icon = "fas fa-users",
                label = "Employé(e)s en service",
                canInteract = function()
                    return PlayerData.job.onduty and SozJobCore.Functions.HasPermission(PlayerData.job.id, SozJobCore.JobPermission.OnDutyView)
                end,
                job = SozJobCore.JobType.CashTransfer,
            },
        },
    })
end)
