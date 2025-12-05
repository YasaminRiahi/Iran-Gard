-- Delete place_photos
DELETE FROM place_photos;

-- Delete places
DELETE FROM places;

-- Delete cities
DELETE FROM cities;

-- Delete provinces
DELETE FROM provinces;

-- Reset sequences to start from 1
ALTER SEQUENCE places_place_id_seq RESTART WITH 1;
ALTER SEQUENCE place_photos_photo_num_seq RESTART WITH 1;
