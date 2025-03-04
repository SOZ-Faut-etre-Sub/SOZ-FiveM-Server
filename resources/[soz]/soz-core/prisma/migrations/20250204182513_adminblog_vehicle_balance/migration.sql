--
-- Augmentation des stocks des concessionnaires
--

-- Concerne : Compactes, Coupés, Grosses Cylindrées, Tout-Terrain, SUV, Berlines, Vans, Moto, Bateaux et Hélicos.
-- Les véhicules entre 0 ~ 100k sont dispo à 50 exemplaires.
update vehicles
set maxStock=90
where price > 10
  and price < 100000
  and maxStock > 1
  and dealership_id is not null
  and category in ('Compacts', 'Coupes', 'Muscle', 'Off-road', 'Suvs', 'Sedans', 'Vans', 'Motorcycles', 'Boats', 'Helicopters');

-- Les véhicules entre 100k+ ~ 300k sont dispo à 40 exemplaires.
update vehicles
set maxStock=60
where price >= 100000
  and price < 300000
  and maxStock > 1
  and dealership_id is not null
  and category in ('Compacts', 'Coupes', 'Muscle', 'Off-road', 'Suvs', 'Sedans', 'Vans', 'Motorcycles', 'Boats', 'Helicopters');

-- Les véhicules entre 300k+ sont dispo à 30 exemplaires.
update vehicles
set maxStock=30
where price >= 300000
  and maxStock > 1
  and dealership_id is not null
  and category in ('Compacts', 'Coupes', 'Muscle', 'Off-road', 'Suvs', 'Sedans', 'Vans', 'Motorcycles', 'Boats', 'Helicopters');

-- Quad, Vélos sont illimités (300).
update vehicles
set maxStock=300
where price > 10
  and maxStock > 1
  and dealership_id is not null
  and category in ('Quads', 'Cycles');

--
-- Ajout des véhicules sportifs au concessionnaire classique
--

-- Les Sportives entre 0 ~ 200k sont dispo à 30 exemplaires.
update vehicles
set maxStock=30
where price > 10
  and price < 200000
  and maxStock > 1
  and dealership_id is not null
  and category in ('Sports', 'Sportsclassics');

-- Les Sportives entre 200k+ sont dispo à 15 exemplaires.
update vehicles
set maxStock=15
where price >= 200000
  and maxStock > 1
  and dealership_id is not null
  and category in ('Sports', 'Sportsclassics');

-- Les Sportives sont désormais toutes disponibles au concessionnaire classique quelque soit leurs prix.
update vehicles
set dealership_id='pdm'
where price > 10
  and maxStock > 1
  and dealership_id = 'luxury'
  and category in ('Sports', 'Sportsclassics');

--
-- Réduction des coûts de 10% pour tous les véhicules
--

update vehicles
set price=ceil(price * 0.9)
where price > 10
  and dealership_id in ('pdm', 'luxury', 'moto', 'electric', 'air', 'boat');
