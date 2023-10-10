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
end)
