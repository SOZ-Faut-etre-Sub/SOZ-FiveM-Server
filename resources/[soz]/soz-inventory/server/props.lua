local bin_props = GetHashKey('prop_cs_bin_01_skinned')

CreateThread(function()
    for _,bin in pairs(Config.BinLocation) do
        local prop = CreateObjectNoOffset(bin_props, bin.x, bin.y, bin.z, true, true, false)
        SetEntityHeading(prop, bin.w + 180)
        FreezeEntityPosition(prop, true)
    end
end)
