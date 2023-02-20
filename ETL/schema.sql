-- CREATE DATABASE sdc;
-- \c sdc;
-- USE sdc;
  /* Describe your table here.*/

CREATE TABLE IF NOT EXISTS reviews (
  review_id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  "date" TIMESTAMPTZ DEFAULT now() NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN DEFAULT false,
  review_name VARCHAR(60) NOT NULL,
  reviewer_email VARCHAR(255) NOT NULL,
  response TEXT DEFAULT NULL,
  helpfulness INTEGER DEFAULT 0
);


/* Create other tables and define schemas for them here! */
CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  review_id INTEGER NOT NULL REFERENCES reviews (review_id),
  "url" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS characteristics (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  "name" VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS characteristic_reviews (
  id SERIAL PRIMARY KEY,
  characteristic_id INTEGER NOT NULL REFERENCES characteristics (id),
  review_id INTEGER NOT NULL REFERENCES reviews (review_id),
  "value" SMALLINT CHECK (value BETWEEN 1 AND 5)
);

CREATE INDEX idx_product_id_r ON reviews (product_id);
CREATE INDEX idx_review_id_p ON photos (review_id);
CREATE INDEX idx_product_id_c ON characteristics (product_id);
CREATE INDEX idx_review_id_cr ON characteristic_reviews (review_id);
CREATE INDEX idx_characteristic_id_cr ON characteristic_reviews (characteristic_id);

-- SELECT * FROM pg_indexes WHERE tablename = 'reviews';
-- SELECT * FROM pg_indexes WHERE tablename = 'photos';
-- SELECT * FROM pg_indexes WHERE tablename = 'characteristics';
-- SELECT * FROM pg_indexes WHERE tablename = 'characteristic_reviews';

-- SELECT * FROM reviews WHERE product_id = 1;



\COPY reviews from './parsed_data/reviews.csv' WITH (FORMAT csv, HEADER true);
\COPY photos from './parsed_data/reviews_photos.csv' WITH (FORMAT csv, HEADER true);
\COPY characteristics from './parsed_data/characteristics.csv' WITH (FORMAT csv, HEADER true);
\COPY characteristic_reviews from './parsed_data/characteristic_reviews.csv' WITH (FORMAT csv, HEADER true);

-- SELECT * FROM pg_sequences;
SELECT setval('reviews_review_id_seq', (SELECT MAX(review_id) FROM reviews)+1);
SELECT setval('photos_id_seq', (SELECT MAX(id) FROM photos)+1);
SELECT setval('characteristics_id_seq', (SELECT MAX(id) FROM characteristics)+1);
SELECT setval('characteristic_reviews_id_seq', (SELECT MAX(id) FROM characteristic_reviews)+1);

-- SELECT * FROM reviews;
-- SELECT * FROM reviews WHERE product_id = 24 ORDER BY helpfulness DESC LIMIT 5 OFFSET 0;

-- SELECT * FROM photos WHERE review_id = 5;

-- SELECT reviews.*, photos."url"
-- FROM reviews
-- LEFT JOIN photos ON reviews.id = photos.review_id
-- WHERE product_id = 2;
-- \timing on
/* get review */

-- EXPLAIN ANALYZE SELECT
--   r.*,
--   array_to_json(array_remove(array_agg(photos), NULL)) as photos
-- FROM
--     reviews r
--     LEFT JOIN photos ON r.review_id = photos.review_id
-- WHERE
--     product_id = 2 AND reported = false
-- GROUP BY
--     r.review_id
-- ORDER BY r.date DESC, r.helpfulness DESC LIMIT 5 OFFSET 0;


-- /* calculate metadata! */
-- WITH ratings_d AS ( SELECT product_id, rating, count(rating) as frequency FROM reviews WHERE product_id = 1 GROUP BY product_id, rating ), recommended_d AS ( SELECT product_id, recommend, count(recommend) as frequency FROM reviews WHERE product_id = 1 GROUP BY product_id, recommend ), characteristic_d AS ( SELECT c.product_id, c."name", jsonb_build_object('id', c.id, 'value', AVG(cr."value")) AS avgvalue FROM characteristic_reviews cr JOIN reviews r ON r.review_id = cr.review_id JOIN characteristics c ON cr.characteristic_id = c.id WHERE c.product_id = 1 GROUP BY c.product_id, c.id, c."name" )SELECT ratings_d.product_id, jsonb_object_agg(ratings_d.rating, ratings_d.frequency) AS ratings, jsonb_object_agg(recommended_d.recommend, recommended_d.frequency) AS recommended, jsonb_object_agg(characteristic_d.name, characteristic_d.avgvalue) AS characteristics FROM ratings_d JOIN recommended_d ON ratings_d.product_id = recommended_d.product_id JOIN characteristic_d ON ratings_d.product_id = characteristic_d.product_id GROUP BY ratings_d.product_id;

-- /* insert or update metadata! */
-- WITH ratings_d AS ( SELECT product_id, rating, count(rating) as frequency FROM reviews WHERE product_id = 40353 GROUP BY product_id, rating ), recommended_d AS ( SELECT product_id, recommend, count(recommend) as frequency FROM reviews WHERE product_id = 40353 GROUP BY product_id, recommend ), characteristic_d AS ( SELECT c.product_id, c."name", jsonb_build_object('id', c.id, 'value', AVG(cr."value")) AS avgvalue FROM characteristic_reviews cr JOIN reviews r ON r.review_id = cr.review_id JOIN characteristics c ON cr.characteristic_id = c.id WHERE c.product_id = 40353 GROUP BY c.product_id, c.id, c."name" ) INSERT INTO reviews_meta (product_id, ratings, recommended, characteristics) SELECT ratings_d.product_id, jsonb_object_agg(ratings_d.rating, ratings_d.frequency), jsonb_object_agg(recommended_d.recommend, recommended_d.frequency), jsonb_object_agg(characteristic_d.name, characteristic_d.avgvalue) FROM ratings_d JOIN recommended_d ON ratings_d.product_id = recommended_d.product_id JOIN characteristic_d ON ratings_d.product_id = characteristic_d.product_id GROUP BY ratings_d.product_id ON CONFLICT (product_id) DO UPDATE SET ratings = EXCLUDED.ratings, recommended = EXCLUDED.recommended, characteristics = EXCLUDED.characteristics;

-- /* update helpful */
-- UPDATE reviews
-- SET helpfulness = helpfulness + 1
-- WHERE review_id = 1;
-- select helpfulness from reviews where review_id = 1;
-- UPDATE reviews SET reported = false WHERE review_id = 1;
-- select reported from reviews where review_id = 1;


-- /* add review */
-- INSERT INTO reviews (product_id, rating, summary, body, recommend, review_name, reviewer_email)
-- VALUES (1, 3, 'good', 'nice', true, 'q', 'a@gmail.com');
-- SELECT * FROM reviews WHERE product_id = 1;



--   review_id SERIAL PRIMARY KEY,
--   product_id INTEGER NOT NULL,
--   rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
--   "date" TIMESTAMPTZ DEFAULT now() NOT NULL,
--   summary TEXT NOT NULL,
--   body TEXT NOT NULL,
--   recommend BOOLEAN NOT NULL,
--   reported BOOLEAN DEFAULT false,
--   review_name VARCHAR(60) NOT NULL,
--   reviewer_email VARCHAR(255) NOT NULL,
--   response TEXT DEFAULT NULL,
--   helpfulness INTEGER NOT NULL



