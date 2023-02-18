-- CREATE DATABASE sdc;
-- \c sdc;
-- USE sdc;
  /* Describe your table here.*/

CREATE TABLE IF NOT EXISTS reviews (
  review_id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  "date" TIMESTAMPTZ NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN DEFAULT false,
  review_name VARCHAR(60) NOT NULL,
  reviewer_email VARCHAR(255) NOT NULL,
  response TEXT DEFAULT NULL,
  helpfulness INTEGER NOT NULL
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

-- SELECT * FROM reviews;
-- SELECT * FROM reviews WHERE product_id = 24 ORDER BY helpfulness DESC LIMIT 5 OFFSET 0;

-- SELECT * FROM photos WHERE review_id = 5;

-- SELECT reviews.*, photos."url"
-- FROM reviews
-- LEFT JOIN photos ON reviews.id = photos.review_id
-- WHERE product_id = 2;

-- EXPLAIN ANALYZE SELECT
--   r.*,
--   array_to_json(array_remove(array_agg(photos), NULL)) as photos
-- FROM
--     reviews, r
--     LEFT JOIN photos ON r.review_id = photos.review_id
-- WHERE
--     product_id = 2 AND reported = false
-- GROUP BY
--     r.review_id
-- ORDER BY r.date DESC, r.helpfulness DESC LIMIT 5 OFFSET 0;
