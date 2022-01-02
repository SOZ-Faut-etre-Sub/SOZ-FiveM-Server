local objects = {
    {x = 266.09, y = -349.35, z = 44.74, model = "prop_sec_barier_02b"}, 
    {x = 285.28, y = -355.78, z = 45.13, model = "prop_sec_barier_02a"}, 
}

CreateThread(function()
    while true do
        for k, v in pairs(objects) do
            local ent = GetClosestObjectOfType(objects[k].x, objects[k].y, objects[k].z, 2.0, GetHashKey(objects[k].model), false, false, false)

            SetEntityAsMissionEntity(ent, 1, 1)
            DeleteObject(ent)
            SetEntityAsNoLongerNeeded(ent)
        end

        Wait(5000)
    end
end)
