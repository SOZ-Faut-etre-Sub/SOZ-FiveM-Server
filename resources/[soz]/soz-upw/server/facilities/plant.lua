Plant = InheritsFrom(Facility)

function Plant:new(identifier, options)
    options.type = "plant"
    return Plant:Super():new(identifier, options)
end
