CreateThread(function()
    RequestModel("u_m_y_zombie_01")
end)

function isAnAnimal(model)
    return model == 3462393972 or model == 1462895032 or model == 2864127842 or model == 2825402133 or model == 351016938 or model == 1457690978 or model ==
               4244282910 or model == 1682622302 or model == 402729631 or model == 3630914197 or model == 2344268885 or model == 802685111 or model ==
               1794449327 or model == 1015224100 or model == 1193010354 or model == 1318032802 or model == 2374682809 or model == 307287994 or model ==
               2971380566 or model == 111281960 or model == 1125994524 or model == 1832265812 or model == 3753204865 or model == 3283429734 or model ==
               882848737 or model == 3268439891 or model == 2506301981 or model == 3549666813 or model == 1126154828 or model == 2705875277 or model ==
               113504370 or model == 2910340283
end

if GetConvarInt("feature_halloween", 0) == 1 then
    AddEventHandler("populationPedCreating", function(_, _, _, model, setters)
        if not isAnAnimal(model) then
            setters.setModel("u_m_y_zombie_01")
        end
    end)
end
