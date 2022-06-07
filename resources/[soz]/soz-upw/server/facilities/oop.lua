function InheritsFrom(parentClass)

    local new_class = {}
    local class_mt = {__index = new_class}

    function new_class:_create_instance()
        local newinst = {}
        setmetatable(newinst, class_mt)
        return newinst
    end

    if nil ~= parentClass then
        setmetatable(new_class, {__index = parentClass})
    end

    -- Return the super class object of the instance
    function new_class:Super()
        return parentClass
    end

    return new_class
end
