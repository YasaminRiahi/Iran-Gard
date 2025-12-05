-- Delete liked reviews
DELETE FROM liked_reviews;

-- Delete wishlist entries
DELETE FROM wishlist;

-- Delete place reviews
DELETE FROM place_reviews;

-- Reset sequences to start from 1
ALTER SEQUENCE place_reviews_review_id_seq RESTART WITH 1;
