RegisterNetEvent("polyzone:printPoly")
AddEventHandler("polyzone:printPoly", function(zone)
  file = io.open('polyzone_created_zones.txt', "a")
  io.output(file)
  local output = parsePoly(zone)
  io.write(output)
  io.close(file)
end)

RegisterNetEvent("polyzone:printCircle")
AddEventHandler("polyzone:printCircle", function(zone)
  file = io.open('polyzone_created_zones.txt', "a")
  io.output(file)
  local output = parseCircle(zone)
  io.write(output)
  io.close(file)
end)

RegisterNetEvent("polyzone:printBox")
AddEventHandler("polyzone:printBox", function(zone)
  file = io.open('polyzone_created_zones.txt', "a")
  io.output(file)
  local output = parseBox(zone)
  io.write(output)
  io.close(file)
end)

function round(num, numDecimalPlaces)
  local mult = 10^(numDecimalPlaces or 0)
  return math.floor(num * mult + 0.5) / mult
end

function printoutHeader(name)
  return "--Name: " .. name .. " | " .. os.date("!%Y-%m-%dT%H:%M:%SZ\n")
end

function parsePoly(zone)
  local printout = printoutHeader(zone.name)
  printout = printout .. "PolyZone:Create({\n"
  for i=1, #zone.points do
    if i ~= #zone.points then
      printout = printout .. "  vector2(" .. tostring(zone.points[i].x) .. ", " .. tostring(zone.points[i].y) .."),\n"
    else
      printout = printout .. "  vector2(" .. tostring(zone.points[i].x) .. ", " .. tostring(zone.points[i].y) ..")\n"
    end
  end
  printout = printout .. "}, {\n  name=\"" .. zone.name .. "\",\n  --minZ = " .. zone.minZ .. ",\n  --maxZ = " .. zone.maxZ .. "\n})\n\n"
  return printout
end

function parseCircle(zone)
  local printout = printoutHeader(zone.name)
  printout = printout .. "CircleZone:Create("
  printout = printout .. "vector3(" .. tostring(round(zone.center.x, 2)) .. ", " .. tostring(round(zone.center.y, 2))  .. ", " .. tostring(round(zone.center.z, 2)) .."), "
  printout = printout .. tostring(zone.radius) .. ", "
  printout = printout .. "{\n  name=\"" .. zone.name .. "\",\n  useZ=" .. tostring(zone.useZ) .. ",\n  --debugPoly=true\n})\n\n"
  return printout
end

function parseBox(zone)
  local printout = printoutHeader(zone.name)
  printout = printout .. "BoxZone:Create("
  printout = printout .. "vector3(" .. tostring(round(zone.center.x, 2)) .. ", " .. tostring(round(zone.center.y, 2))  .. ", " .. tostring(round(zone.center.z, 2)) .."), "
  printout = printout .. tostring(zone.length) .. ", "
  printout = printout .. tostring(zone.width) .. ", "
  
  printout = printout .. "{\n  name=\"" .. zone.name .. "\",\n  heading=" .. zone.heading .. ",\n  --debugPoly=true"
  if zone.minZ then
    printout = printout .. ",\n  minZ=" .. tostring(round(zone.minZ, 2))
  end
  if zone.maxZ then
    printout = printout .. ",\n  maxZ=" .. tostring(round(zone.maxZ, 2))
  end
  printout = printout .. "\n})\n\n"
  return printout
end

RegisterNetEvent("polyzone:server:housing", function(zone, id, zonetype)
  local endzone = '{"x": ' .. round(zone.center.x, 2)
  endzone = endzone .. ', "y": '
  endzone = endzone .. round(zone.center.y, 2) .. ', "z": '
  endzone = endzone .. round(zone.center.z, 2) .. ', "sx": '
  endzone = endzone .. zone.length .. ', "sy": '
  endzone = endzone .. zone.width .. ', "heading": '
  endzone = endzone .. zone.heading
  if zone.minZ then
    endzone = endzone .. ', "minZ": ' .. round(zone.minZ, 2) 
  end
  if zone.maxZ then
    endzone = endzone .. ', "maxZ": ' .. round(zone.maxZ, 2) 
  end
  endzone = endzone .. '}'
  if zonetype == "closet_position" then
    MySQL.update.await("UPDATE player_house SET closet_position = @zone WHERE identifier = @id", {
      ["@zone"] = endzone,
      ["@id"] = id,
    })
  end
  if zonetype == "fridge_position" then
    MySQL.update.await("UPDATE player_house SET fridge_position = @zone WHERE identifier = @id", {
      ["@zone"] = endzone,
      ["@id"] = id,
    })
  end
  if zonetype == "stash_position" then
    MySQL.update.await("UPDATE player_house SET stash_position = @zone WHERE identifier = @id", {
      ["@zone"] = endzone,
      ["@id"] = id,
    })
  end
  if zonetype == "money_position" then
    MySQL.update.await("UPDATE player_house SET money_position = @zone WHERE identifier = @id", {
      ["@zone"] = endzone,
      ["@id"] = id,
    })
  end
  if zonetype == "entry_zone" then
    MySQL.update.await("UPDATE player_house SET entry_zone = @zone WHERE identifier = @id", {
      ["@zone"] = endzone,
      ["@id"] = id,
    })
  end
  if zonetype == "exit_zone" then
    MySQL.update.await("UPDATE player_house SET exit_zone = @zone WHERE identifier = @id", {
      ["@zone"] = endzone,
      ["@id"] = id,
    })
  end
end)