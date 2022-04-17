--- Event manager for PolyZone
--- Trigger locations:zone:enter and locations:zone:exit
CreateThread(function()
    for locationsGroupType, locationsGroup in pairs(Locations) do
        for _, location in pairs(locationsGroup) do
            location:onPlayerInOut(function(isInside)
                if isInside then
                    TriggerEvent("locations:zone:enter", locationsGroupType, location.name)
                else
                    TriggerEvent("locations:zone:exit", locationsGroupType, location.name)
                end
            end)
        end
    end
end)
