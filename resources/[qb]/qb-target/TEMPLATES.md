# These are Templates for all the functions in qb-target

## AddCircleZone

### Function Format

```lua
-- This is the function from how you would use it inside qb-target/client.lua
AddCircleZone(name: string, center: vector3, radius: float, options: table, targetoptions: table)

options = {
  name: string (UNIQUE),
  debugPoly: boolean,
}

targetoptions = {
  options = {
    {
      type: string,
      event: string,
      icon: string,
      label: string,
      targeticon: string,
      item: string,
      action: function,
      canInteract: function,
      job: string or table,
      gang: string or table
    }
  },
  distance: float
}
```

### Config option, this will go into the Config.CircleZones table

```lua
  ["index"] = { -- This can be a string or a number
    name = "name", -- This is the name of the zone recognized by PolyZone, this has to be unique so it doesn't mess up with other zones
    coords = vector3(x, y, z), -- These are the coords for the zone, this has to be a vector3 and the coords have to be a float value, fill in x, y and z with the coords
    radius = 1.5, -- The radius of the circlezone calculated from the center of the zone, this has to be a float value
    debugPoly = false, -- This is for enabling/disabling the drawing of the box, it accepts only a boolean value (true or false), when true it will draw the polyzone in green
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  },
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  exports['qb-target']:AddCircleZone("name", vector3(x, y, z), 1.5, { -- The name has to be unique, the coords a vector3 as shown and the 1.5 is the radius which has to be a float value
    name = "name", -- This is the name of the zone recognized by PolyZone, this has to be unique so it doesn't mess up with other zones
    debugPoly = false, -- This is for enabling/disabling the drawing of the box, it accepts only a boolean value (true or false), when true it will draw the polyzone in green
  }, {
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  })
end)
```

## AddBoxZone

### Function Format

```lua
-- This is the function from how you would use it inside qb-target/client.lua
AddBoxZone(name: string, center: vector3, length: float, width: float, options: table, targetoptions: table)

options = {
  name: string (UNIQUE),
  heading: float,
  debugPoly: boolean,
  minZ: float,
  maxZ: float,
}

targetoptions = {
  options = {
    {
      type: string,
      event: string,
      icon: string,
      label: string,
      targeticon: string,
      item: string,
      action: function,
      canInteract: function,
      job: string or table,
      gang: string or table
    }
  },
  distance: float
}
```

### Config option, this will go into the Config.BoxZones table

```lua
  ["index"] = { -- This can be a string or a number
    name = "name", -- This is the name of the zone recognized by PolyZone, this has to be unique so it doesn't mess up with other zones
    coords = vector3(x, y, z), -- These are the coords for the zone, this has to be a vector3 and the coords have to be a float value, fill in x, y and z with the coords
    length = 1.5, -- The length of the boxzone calculated from the center of the zone, this has to be a float value
    width = 1.6, -- The width of the boxzone calculated from the center of the zone, this has to be a float value
    heading = 12.0, -- The heading of the boxzone, this has to be a float value
    debugPoly = false, -- This is for enabling/disabling the drawing of the box, it accepts only a boolean value (true or false), when true it will draw the polyzone in green
    minZ = 36.7, -- This is the bottom of the boxzone, this can be different from the Z value in the coords, this has to be a float value
    maxZ = 38.9, -- This is the top of the boxzone, this can be different from the Z value in the coords, this has to be a float value
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  },
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  exports['qb-target']:AddBoxZone("name", vector3(x, y, z), 1.5, 1.6, { -- The name has to be unique, the coords a vector3 as shown, the 1.5 is the length of the boxzone and the 1.6 is the width of the boxzone, the length and width have to be float values
    name = "name", -- This is the name of the zone recognized by PolyZone, this has to be unique so it doesn't mess up with other zones
    heading = 12.0, -- The heading of the boxzone, this has to be a float value
    debugPoly = false, -- This is for enabling/disabling the drawing of the box, it accepts only a boolean value (true or false), when true it will draw the polyzone in green
    minZ = 36.7, -- This is the bottom of the boxzone, this can be different from the Z value in the coords, this has to be a float value
    maxZ = 38.9, -- This is the top of the boxzone, this can be different from the Z value in the coords, this has to be a float value
  }, {
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  })
end)
```

## AddPolyZone

### Function Format

```lua
-- This is the function from how you would use it inside qb-target/client.lua
AddPolyZone(name: string, points: table, options: table, targetoptions: table)

points = {
  vector2(x, y), vector2(x, y), -- Add a minimum of 3 points for this to work and they have to be in order of drawing
}

options = {
  name: string (UNIQUE),
  debugPoly: boolean,
  minZ: float,
  maxZ: float
}

targetoptions = {
  options = {
    {
      type: string,
      event: string,
      icon: string,
      label: string,
      targeticon: string,
      item: string,
      action: function,
      canInteract: function,
      job: string or table,
      gang: string or table
    }
  },
  distance: float
}
```

### Config option, this will go into the Config.BoxZones table

```lua
  ["index"] = { -- This can be a string or a number
    name = "name", -- This is the name of the zone recognized by PolyZone, this has to be unique so it doesn't mess up with other zones
    points = { -- This will draw the polyzones in order on the specific coords, every coord is a point that it will draw on
      vector2(x, y), vector2(x, y), vector2(x, y), vector2(x, y),
    }
    debugPoly = false, -- This is for enabling/disabling the drawing of the box, it accepts only a boolean value (true or false), when true it will draw the polyzone in green
    minZ = 36.7, -- This is the bottom of the boxzone, this can be different from the Z value in the coords, this has to be a float value
    maxZ = 38.9, -- This is the top of the boxzone, this can be different from the Z value in the coords, this has to be a float value
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  },
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  local points = {
    vector2(x, y, z), vector2(x, y, z), vector2(x, y, z)
  }
  exports['qb-target']:AddPolyZone("name", points, {
    name = "name", -- This is the name of the zone recognized by PolyZone, this has to be unique so it doesn't mess up with other zones
    debugPoly = false, -- This is for enabling/disabling the drawing of the box, it accepts only a boolean value (true or false), when true it will draw the polyzone in green
    minZ = 36.7, -- This is the bottom of the polyzone, this can be different from the Z value in the coords, this has to be a float value
    maxZ = 38.9, -- This is the top of the polyzone, this can be different from the Z value in the coords, this has to be a float value
  }, {
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  })
end)
```

## AddComboZone

### Function Format

```lua
-- This is the function from how you would use it inside qb-target/client.lua
AddComboZone(zones: table, options: table, targetoptions: table)

zones = {zone1: zone, zone2: zone} -- Minimum of 2 zones

options = {
  name: string (UNIQUE),
  debugPoly: boolean
}

targetoptions = {
  options = {
    {
      type: string,
      event: string,
      icon: string,
      label: string,
      targeticon: string,
      item: string,
      action: function,
      canInteract: function,
      job: string or table,
      gang: string or table
    }
  },
  distance: float
}
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  local zone1 = BoxZone:Create(vector3(500, 500, 100), 3.0, 5.0, {
    name = "test",
    debugPoly = false
  })
  local zone2 = BoxZone:Create(vector3(400, 400, 100), 3.0, 5.0, {
    name = "test2",
    debugPoly = false
  })
  local zones = {zone1, zone2}
  exports['qb-target']:AddComboZone(zones, {
    name = "name", -- This is the name of the zone recognized by PolyZone, this has to be unique so it doesn't mess up with other zones
    debugPoly = false, -- This is for enabling/disabling the drawing of the box, it accepts only a boolean value (true or false), when true it will draw the polyzone in green
  }, {
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  })
end)
```

## AddTargetBone

### Function Format

```lua
-- This is the function from how you would use it inside qb-target/client.lua
AddTargetBone(bones: table or string, parameters: table)

parameters = {
  options = {
    {
      type: string,
      event: string,
      icon: string,
      label: string,
      targeticon: string,
      item: string,
      action: function,
      canInteract: function,
      job: string or table,
      gang: string or table
    }
  },
  distance: float
}
```

### Config option, this will go into the Config.TargetBones table

```lua
  ["index"] = { -- This can be a string or a number
    bones = {'boot', 'bonnet'} -- This is your bones table, this specifies all the bones that have to be added to the targetoptions, this can be a string or a table
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  },
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  local bones = {
    'boot',
    'bonnet'
  }
  exports['qb-target']:AddTargetBone(bones, { -- The bones can be a string or a table
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  })
end)
```

## AddTargetEntity

### Function Format

```lua
AddTargetEntity(entity: integer or table, parameters: table)

parameters = {
  options = {
    {
      type: string,
      event: string,
      icon: string,
      label: string,
      targeticon: string,
      item: string,
      action: function,
      canInteract: function,
      job: string or table,
      gang: string or table
    }
  },
  distance: float
}
```

### Config option, this will go into the Config.TargetEntities table

```lua
  ["index"] = { -- This can be a string or a number
    entity = 5939885 -- This is the specified entity, this is not intended for the config as these numbers are randomized per entity but it's there, you'd have to get the entity's number and make them networked so it can be targeted
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  },
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  local entity = CreatePed(2, `a_m_m_indian_01`, 500.0, 500.0, 100.0, 12.0, true, false)
  exports['qb-target']:AddTargetEntity(entity, { -- The specified entity number
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  })
end)
```

## AddEntityZone

### Function Format

```lua
AddEntityZone(name: string, entity: integer, options: table, targetoptions: table)

options = {
  name: string (UNIQUE),
  debugPoly: boolean,
}

targetoptions = {
  options = {
    {
      type: string,
      event: string,
      icon: string,
      label: string,
      targeticon: string,
      item: string,
      action: function,
      canInteract: function,
      job: string or table,
      gang: string or table
    }
  },
  distance: float
}
```

### Config option, this will go into the Config.EntityZones table

```lua
  ["index"] = { -- This can be a string or a number
    name = "name", -- This is the name of the zone recognized by PolyZone, this has to be unique so it doesn't mess up with other zones
    debugPoly = false, -- This is for enabling/disabling the drawing of the box, it accepts only a boolean value (true or false), when true it will draw the polyzone in green
    entity = 5939885 -- This is the specified entity, this is not intended for the config as these numbers are randomized per entity but it's there, you'd have to get the entity's number and make them networked so it can be targeted
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  },
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  local entity = CreatePed(2, `a_m_m_indian_01`, 500.0, 500.0, 100.0, 12.0, true, false)
  exports['qb-target']:AddEntityZone("name", entity, { -- The specified entity number
    {
      name = "name", -- This is the name of the zone recognized by PolyZone, this has to be unique so it doesn't mess up with other zones
      debugPoly = false, -- This is for enabling/disabling the drawing of the box, it accepts only a boolean value (true or false), when true it will draw the polyzone in green  
    }, {
      options = { -- This is your options table, in this table all the options will be specified for the target to accept
        { -- This is the first table with options, you can make as many options inside the options table as you want
          type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
          event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
          icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
          label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
          targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
          item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
          action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
            if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
            TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
          end,
          canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
            if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
            return true
          end,
          job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
          gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
          citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
        }
      },
      distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
    }
  })
end)
```

## AddTargetModel

### Function Format

```lua
AddTargetModel(models: string or table, parameters: table)

parameters = {
  options = {
    {
      type: string,
      event: string,
      icon: string,
      label: string,
      targeticon: string,
      item: string,
      action: function,
      canInteract: function,
      job: string or table,
      gang: string or table
    }
  },
  distance: float
}
```

### Config option, this will go into the Config.TargetModels table

```lua
  ["index"] = { -- This can be a string or a number
    models = { -- This is your models table, here you define all the target models to be interacted with, this can be a string or a table
      'a_m_m_indian_01',
    }
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  },
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  local models = {
    'a_m_m_indian_01',
  }
  exports['qb-target']:AddTargetModel(models, { -- This defines the models, can be a string or a table
      options = { -- This is your options table, in this table all the options will be specified for the target to accept
        { -- This is the first table with options, you can make as many options inside the options table as you want
          type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
          event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
          icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
          label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
          targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
          item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
          action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
            if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
            TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
          end,
          canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
            if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
            return true
          end,
          job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
          gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
          citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
        }
      },
      distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
    }
  })
end)
```

## RemoveZone

### Function Format

```lua
RemoveZone(name: string)
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  exports['qb-target']:RemoveZone("name")
end)
```

## RemoveTargetBone

## Function Format

```lua
RemoveTargetBone(bones: table or string, labels: table or string)
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  exports['qb-target']:RemoveTargetBone('bonnet', 'Test')
end)
```

## RemoveTargetModel

## Function Format

```lua
RemoveTargetModel(models: table or string, labels: table or string)
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  exports['qb-target']:RemoveTargetModel('a_m_m_indian_01', 'Test')
end)
```

## RemoveTargetEntity

### Function Format

```lua
RemoveTargetEntity(entity: integer or table, labels: table or string)
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  exports['qb-target']:RemoveTargetEntity(entity, 'Test')
end)
```

## AddGlobalType

### Function Format

```lua
AddGlobalType(type: integer, parameters: table)

parameters = {
  options = {
    {
      type: string,
      event: string,
      icon: string,
      label: string,
      targeticon: string,
      item: string,
      action: function,
      canInteract: function,
      job: string or table,
      gang: string or table
    }
  },
  distance: float
}
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  local Targeting = exports['qb-target']:FetchFunctions()
  Targeting.AddGlobalType(1, { -- 1 stands for ped types
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  })
end)
```

## AddGlobalPed

### Function Format

```lua
AddGlobalPed(parameters: table)

parameters = {
  options = {
    {
      type: string,
      event: string,
      icon: string,
      label: string,
      targeticon: string,
      item: string,
      action: function,
      canInteract: function,
      job: string or table,
      gang: string or table
    }
  },
  distance: float
}
```

### Config option, this will go into the Config.GlobalPedOptions table

```lua
  options = { -- This is your options table, in this table all the options will be specified for the target to accept
    { -- This is the first table with options, you can make as many options inside the options table as you want
      type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
      event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
      icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
      label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
      targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
      item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
      action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
        if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
        TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
      end,
      canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
        if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
        return true
      end,
      job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
      gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
      citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
    }
  },
  distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  exports['qb-target']:AddGlobalPed({
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  })
end)
```

## AddGlobalVehicle

### Function Format

```lua
AddGlobalVehicle(parameters: table)

parameters = {
  options = {
    {
      type: string,
      event: string,
      icon: string,
      label: string,
      targeticon: string,
      item: string,
      action: function,
      canInteract: function,
      job: string or table,
      gang: string or table
    }
  },
  distance: float
}
```

### Config option, this will go into the Config.GlobalVehicleOptions table

```lua
  options = { -- This is your options table, in this table all the options will be specified for the target to accept
    { -- This is the first table with options, you can make as many options inside the options table as you want
      type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
      event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
      icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
      label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
      targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
      item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
      action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
        if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
        TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
      end,
      canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
        if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
        return true
      end,
      job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
      gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
      citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
    }
  },
  distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  exports['qb-target']:AddGlobalVehicle({
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  })
end)
```

## AddGlobalObject

### Function Format

```lua
AddGlobalObject(parameters: table)

parameters = {
  options = {
    {
      type: string,
      event: string,
      icon: string,
      label: string,
      targeticon: string,
      item: string,
      action: function,
      canInteract: function,
      job: string or table,
      gang: string or table
    }
  },
  distance: float
}
```

### Config option, this will go into the Config.GlobalObjectOptions table

```lua
  options = { -- This is your options table, in this table all the options will be specified for the target to accept
    { -- This is the first table with options, you can make as many options inside the options table as you want
      type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
      event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
      icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
      label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
      targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
      item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
      action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
        if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
        TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
      end,
      canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
        if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
        return true
      end,
      job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
      gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
      citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
    }
  },
  distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  exports['qb-target']:AddGlobalObject({
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  })
end)
```

## AddGlobalPlayer

### Function Format

```lua
AddGlobalPlayer(parameters: table)

parameters = {
  options = {
    {
      type: string,
      event: string,
      icon: string,
      label: string,
      targeticon: string,
      item: string,
      action: function,
      canInteract: function,
      job: string or table,
      gang: string or table
    }
  },
  distance: float
}
```

### Config option, this will go into the Config.GlobalPlayerOptions table

```lua
  options = { -- This is your options table, in this table all the options will be specified for the target to accept
    { -- This is the first table with options, you can make as many options inside the options table as you want
      type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
      event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
      icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
      label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
      targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
      item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
      action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
        if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
        TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
      end,
      canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
        if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
        return true
      end,
      job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
      gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
      citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
    }
  },
  distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  exports['qb-target']:AddGlobalPlayer({
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  })
end)
```

## RemoveGlobalTypeOptions

### Function Format

```lua
RemoveGlobalTypeOptions(type: integer, labels: table or string)
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  exports['qb-target']:RemoveType(1, 'Test') -- 1 is for peds
end)
```

## RemoveGlobalPedOptions

### Function Format

```lua
RemoveGlobalPedOptions(labels: table or string)
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  exports['qb-target']:RemovePed('Test')
end)
```

## RemoveGlobalVehicleOptions

### Function Format

```lua
RemoveGlobalVehicleOptions(labels: table or string)
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  exports['qb-target']:RemoveVehicle('Test')
end)
```

## RemoveGlobalObjectOptions

### Function Format

```lua
RemoveGlobalObjectOptions(labels: table or string)
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  exports['qb-target']:RemoveObject('Test')
end)
```

## RemoveGlobalPlayerOptions

### Function Format

```lua
RemoveGlobalPlayerOptions(labels: table or string)
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
CreateThread(function()
  exports['qb-target']:RemovePlayer('Test')
end)
```

## RaycastCamera

### Function Format

```lua
RaycastCamera(flag: integer) -- Preferably 30 or -1, -1 will not interact with any hashes higher than 32 bit and 30 will not interact with polyzones
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
local Targeting = exports['qb-target']:FetchFunctions()
CreateThread(function()
    while true do
        local curFlag = 30
        local hit, coords, entity, entityType = Targeting.RaycastCamera(Targeting.switch())
        if entityType > 0 then
            print('gotten')
        end
    end
end)
```

## CloneTable

### Function Format

```lua
CloneTable(table: table)
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
local Targeting = exports['qb-target']:FetchFunctions()
CreateThread(function()
  local table = {
    [1] = "something eh",
    [2] = function()
      print('test')
    end,
    [3] = 'something else too',
  }
  local copy = Targeting.CloneTable()
  print(json.encode(copy))
end)
```

## Ped Spawner

### Function Format

```lua
SpawnPed(datatable: table)

-- This is for 1 ped
datatable = {
  model: string or integer,
  coords: vector4,
  minusOne: boolean,
  freeze: boolean,
  invincible: boolean,
  blockevents: boolean,
  animDict: string,
  anim: string,
  flag: integer,
  scenario: string,
  target = {
    options = {
      {
        type: string,
        event: string,
        icon: string,
        label: string,
        targeticon: string,
        item: string,
        action: function,
        canInteract: function,
        job: string or table,
        gang: string or table
      }
    },
    distance: float
  },
  currentpednumber: integer
}

-- This is for multiple peds
datatable = {
  [index: integer] = {
    model: string or integer,
    coords: vector4,
    minusOne: boolean,
    freeze: boolean,
    invincible: boolean,
    blockevents: boolean,
    animDict: string,
    anim: string,
    flag: integer,
    scenario: string,
    target = {
      options = {
        {
          type: string,
          event: string,
          icon: string,
          label: string,
          targeticon: string,
          item: string,
          action: function,
          canInteract: function,
          job: string or table,
          gang: string or table
        }
      },
      distance: float
    },
    currentpednumber: integer
  }
}
```

### Config option, this will go into the Config.Peds table

```lua
-- Any of the options in the index table besides model and coords are optional, you can leave them out or set them to false
[1] = { -- This MUST be a number (UNIQUE), if you make it a string it won't be able to delete peds spawned with the export
  model = 'a_m_m_indian_01', -- This is the ped model that is going to be spawning at the given coords
  coords = vector4(x, y, z, w), -- This is the coords that the ped is going to spawn at, always has to be a vector4 and the w value is the heading
  minusOne = true, -- Set this to true if your ped is hovering above the ground but you want it on the ground (OPTIONAL)
  freeze = true, -- Set this to true if you want the ped to be frozen at the given coords (OPTIONAL)
  invincible = true, -- Set this to true if you want the ped to not take any damage from any source (OPTIONAL)
  blockevents = true, -- Set this to true if you don't want the ped to react the to the environment (OPTIONAL)
  animDict = 'abigail_mcs_1_concat-0', -- This is the animation dictionairy to load the animation to play from (OPTIONAL)
  anim = 'csb_abigail_dual-0', -- This is the animation that will play chosen from the animDict, this will loop the whole time the ped is spawned (OPTIONAL)
  flag = 1, -- This is the flag of the animation to play, for all the flags, check the TaskPlayAnim native here https://docs.fivem.net/natives/?_0x5AB552C6 (OPTIONAL)
  scenario = 'WORLD_HUMAN_AA_COFFEE', -- This is the scenario that will play the whole time the ped is spawned, this cannot pair with anim and animDict (OPTIONAL)
  target = { -- This is the target options table, here you can specify all the options to display when targeting the ped (OPTIONAL)
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  },
  currentpednumber = 0, -- This is the current ped number, this will be assigned when spawned, you can leave this out because it will always be created (OPTIONAL)
},
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
-- This is for 1 ped only
exports['qb-target']:SpawnPed({
  model = 'a_m_m_indian_01', -- This is the ped model that is going to be spawning at the given coords
  coords = vector4(x, y, z, w), -- This is the coords that the ped is going to spawn at, always has to be a vector4 and the w value is the heading
  minusOne = true, -- Set this to true if your ped is hovering above the ground but you want it on the ground (OPTIONAL)
  freeze = true, -- Set this to true if you want the ped to be frozen at the given coords (OPTIONAL)
  invincible = true, -- Set this to true if you want the ped to not take any damage from any source (OPTIONAL)
  blockevents = true, -- Set this to true if you don't want the ped to react the to the environment (OPTIONAL)
  animDict = 'abigail_mcs_1_concat-0', -- This is the animation dictionairy to load the animation to play from (OPTIONAL)
  anim = 'csb_abigail_dual-0', -- This is the animation that will play chosen from the animDict, this will loop the whole time the ped is spawned (OPTIONAL)
  flag = 1, -- This is the flag of the animation to play, for all the flags, check the TaskPlayAnim native here https://docs.fivem.net/natives/?_0x5AB552C6 (OPTIONAL)
  scenario = 'WORLD_HUMAN_AA_COFFEE', -- This is the scenario that will play the whole time the ped is spawned, this cannot pair with anim and animDict (OPTIONAL)
  target = { -- This is the target options table, here you can specify all the options to display when targeting the ped (OPTIONAL)
    options = { -- This is your options table, in this table all the options will be specified for the target to accept
      { -- This is the first table with options, you can make as many options inside the options table as you want
        type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
        event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
        icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
        label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
        targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
        item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
        action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
        end,
        canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
          if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
          return true
        end,
        job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
        gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
        citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
      }
    },
    distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
  },
  currentpednumber = 0, -- This is the current ped number, this will be assigned when spawned, you can leave this out because it will always be created (OPTIONAL)
})

-- This is for multiple peds, here I used 2 of the same peds
exports['qb-target']:SpawnPed({
  [1] = { -- This has to be a number otherwise it can't delete the ped afterwards
    model = 'a_m_m_indian_01', -- This is the ped model that is going to be spawning at the given coords
    coords = vector4(x, y, z, w), -- This is the coords that the ped is going to spawn at, always has to be a vector4 and the w value is the heading
    minusOne = true, -- Set this to true if your ped is hovering above the ground but you want it on the ground (OPTIONAL)
    freeze = true, -- Set this to true if you want the ped to be frozen at the given coords (OPTIONAL)
    invincible = true, -- Set this to true if you want the ped to not take any damage from any source (OPTIONAL)
    blockevents = true, -- Set this to true if you don't want the ped to react the to the environment (OPTIONAL)
    animDict = 'abigail_mcs_1_concat-0', -- This is the animation dictionairy to load the animation to play from (OPTIONAL)
    anim = 'csb_abigail_dual-0', -- This is the animation that will play chosen from the animDict, this will loop the whole time the ped is spawned (OPTIONAL)
    flag = 1, -- This is the flag of the animation to play, for all the flags, check the TaskPlayAnim native here https://docs.fivem.net/natives/?_0x5AB552C6 (OPTIONAL)
    scenario = 'WORLD_HUMAN_AA_COFFEE', -- This is the scenario that will play the whole time the ped is spawned, this cannot pair with anim and animDict (OPTIONAL)
    target = { -- This is the target options table, here you can specify all the options to display when targeting the ped (OPTIONAL)
      options = { -- This is your options table, in this table all the options will be specified for the target to accept
        { -- This is the first table with options, you can make as many options inside the options table as you want
          type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
          event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
          icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
          label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
          targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
          item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
          action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
            if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
            TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
          end,
          canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
            if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
            return true
          end,
          job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
          gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
          citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
        }
      },
      distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
    },
    currentpednumber = 0, -- This is the current ped number, this will be assigned when spawned, you can leave this out because it will always be created (OPTIONAL)
  },
  [2] = {
    model = 'a_m_m_indian_01', -- This is the ped model that is going to be spawning at the given coords
    coords = vector4(x, y, z, w), -- This is the coords that the ped is going to spawn at, always has to be a vector4 and the w value is the heading
    minusOne = true, -- Set this to true if your ped is hovering above the ground but you want it on the ground (OPTIONAL)
    freeze = true, -- Set this to true if you want the ped to be frozen at the given coords (OPTIONAL)
    invincible = true, -- Set this to true if you want the ped to not take any damage from any source (OPTIONAL)
    blockevents = true, -- Set this to true if you don't want the ped to react the to the environment (OPTIONAL)
    animDict = 'abigail_mcs_1_concat-0', -- This is the animation dictionairy to load the animation to play from (OPTIONAL)
    anim = 'csb_abigail_dual-0', -- This is the animation that will play chosen from the animDict, this will loop the whole time the ped is spawned (OPTIONAL)
    flag = 1, -- This is the flag of the animation to play, for all the flags, check the TaskPlayAnim native here https://docs.fivem.net/natives/?_0x5AB552C6 (OPTIONAL)
    scenario = 'WORLD_HUMAN_AA_COFFEE', -- This is the scenario that will play the whole time the ped is spawned, this cannot pair with anim and animDict (OPTIONAL)
    target = { -- This is the target options table, here you can specify all the options to display when targeting the ped (OPTIONAL)
      options = { -- This is your options table, in this table all the options will be specified for the target to accept
        { -- This is the first table with options, you can make as many options inside the options table as you want
          type = "client", -- This specifies the type of event the target has to trigger on click, this can be "client", "server", "command" or "qbcommand", this is OPTIONAL and will only work if the event is also specified
          event = "Test:Event", -- This is the event it will trigger on click, this can be a client event, server event, command or qbcore registered command, NOTICE: Normal command can't have arguments passed through, QBCore registered ones can have arguments passed through
          icon = 'fas fa-example', -- This is the icon that will display next to this trigger option
          label = 'Test', -- This is the label of this option which you would be able to click on to trigger everything, this has to be a string
          targeticon = 'fas fa-example', -- This is the icon of the target itself, the icon changes to this when it turns blue on this specific option, this is OPTIONAL
          item = 'handcuffs', -- This is the item it has to check for, this option will only show up if the player has this item, this is OPTIONAL
          action = function(entity) -- This is the action it has to perform, this REPLACES the event and this is OPTIONAL
            if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
            TriggerEvent('testing:event', 'test') -- Triggers a client event called testing:event and sends the argument 'test' with it
          end,
          canInteract = function(entity, distance, data) -- This will check if you can interact with it, this won't show up if it returns false, this is OPTIONAL
            if IsPedAPlayer(entity) then return false end -- This will return false if the entity interacted with is a player and otherwise returns true
            return true
          end,
          job = 'police', -- This is the job, this option won't show up if the player doesn't have this job, this can also be done with multiple jobs and grades, if you want multiple jobs you always need a grade with it: job = {["police"] = 0, ["ambulance"] = 2},
          gang = 'ballas', -- This is the gang, this option won't show up if the player doesn't have this gang, this can also be done with multiple gangs and grades, if you want multiple gangs you always need a grade with it: gang = {["ballas"] = 0, ["thelostmc"] = 2},
          citizenid = 'JFD98238', -- This is the citizenid, this option won't show up if the player doesn't have this citizenid, this can also be done with multiple citizenid's, if you want multiple citizenid's there is a specific format to follow: citizenid = {["JFD98238"] = true, ["HJS29340"] = true},
        }
      },
      distance = 2.5, -- This is the distance for you to be at for the target to turn blue, this is in GTA units and has to be a float value
    },
    currentpednumber = 0, -- This is the current ped number, this will be assigned when spawned, you can leave this out because it will always be created (OPTIONAL)
  }
})
```

## AllowTargeting

### Function Format

```lua
AllowTargeting(allow: bool)
```

### Export option, this will go into any client side resource file aside from qb-target's one

```lua
if IsEntityDead(PlayerPedId()) then
    exports['qb-target']:AllowTargeting(false)
end
```