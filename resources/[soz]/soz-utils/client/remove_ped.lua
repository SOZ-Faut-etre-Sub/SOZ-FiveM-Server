AddEventHandler("populationPedCreating", function(x, y, _, _, _)
    for _, zone in pairs(Config.DisableSpawn) do
        local Px = {}
        local Py = {}

        for _, coord in ipairs(zone) do
            if Px.min == nil or Px.min > coord.x then
                Px.min = coord.x
            end
            if Px.max == nil or Px.max < coord.x then
                Px.max = coord.x
            end
            if Py.min == nil or Py.min > coord.y then
                Py.min = coord.y
            end
            if Py.max == nil or Py.max < coord.y then
                Py.max = coord.y
            end
        end

        if x >= Px.min and x <= Px.max and y >= Py.min and y <= Py.max then
            CancelEvent()
        end
    end
end)
