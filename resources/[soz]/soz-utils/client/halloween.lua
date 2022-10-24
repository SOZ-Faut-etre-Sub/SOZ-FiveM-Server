CreateThread(function()
    RequestModel("u_m_y_zombie_01")
end)

if GetConvarInt("feature_halloween", 0) == 1 then
    AddEventHandler("populationPedCreating", function(x, y, z, _, setters)
        setters.setModel("u_m_y_zombie_01")
        setters.setPosition(x, y, z + 0.01)
    end)
end
