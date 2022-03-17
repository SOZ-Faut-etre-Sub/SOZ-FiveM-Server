function CreateRangeSizeItem(menu, label, value, cb)
    menu:AddRange({
        label = label,
        value = value * 100,
        min = -100,
        max = 100,
        interval = 10,
    }):On("change", function(_, value)
        cb(value / 100)
    end)
end

function CreateSliderList(menu, label, value, options, cb)
    local valueIndex = 1

    for i, v in ipairs(options) do
        if v.value == value then
            valueIndex = i
            break
        end
    end

    local slider = menu:AddSlider({label = label, value = valueIndex, values = options})

    slider:On("change", function(_, value)
        local option = options[value]

        cb(option.value)
    end)
end

function CreateColorSliderList(menu, label, value, options, cb)
    local valueIndex = 1

    for i, v in ipairs(options) do
        if v.value == value then
            valueIndex = i
            break
        end
    end

    local slider = menu:AddColorSlider({label = label, value = valueIndex, values = options})

    slider:On("change", function(_, value)
        local option = options[value]

        cb(option.value)
    end)
end
