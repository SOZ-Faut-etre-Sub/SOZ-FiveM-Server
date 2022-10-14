-- Remove the electric cars
UPDATE vehicles SET dealership_id = NULL WHERE model IN ('cyclone', 'voltic', 'imorgon');
