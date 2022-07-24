BaunJob = {
    isInsideACraftingZone = false
}
BaunJob.Functions = {}
-- TODO: Replace texture with menu_job_bahamas
BaunJob.Menu = MenuV:CreateMenu(nil, "", "default", "soz", "bahamas:menu")
BaunJob.Harvest = {}

BaunJob.Craft = {
    ComboZone = nil,
    Zones = {}
}

CreateThread(function()
    for _, config in pairs(BaunConfig.Blips) do
        QBCore.Functions.CreateBlip(config.Id, {
            name = config.Name,
            coords = config.Coords,
            sprite = config.Icon,
            scale = config.Scale,
            color = config.Color
        })
    end
end)

BaunJob.Functions.ConfigToZone = function(config)
    if config.type == 'poly' then
        return PolyZone:Create(config.points, config.options)
    elseif config.type == 'box' then
        return BoxZone:Create(config.center, config.length, config.width, config.options)
    end
    return nil
end
