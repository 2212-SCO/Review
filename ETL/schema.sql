-- CREATE DATABASE sdc;
-- \c sdc;
-- USE sdc;
  /* Describe your table here.*/

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id varchar(10),
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  "date" timestamptz NOT NULL,
  summary text not null,
  body text not null,
  recommend boolean not null,
  reported boolean not null,
  review_name varchar(60) not null,
  reviewer_email varchar(255) not null,
  response text default null,
  helpfulness INTEGER NOT NULL
);

/* Create other tables and define schemas for them here! */
CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  review_id INTEGER NOT NULL REFERENCES reviews (id),
  "url" text not null
);

CREATE TABLE IF NOT EXISTS characteristics (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  "name" varchar(10) not null
);

CREATE TABLE IF NOT EXISTS characteristic_reviews (
  id SERIAL PRIMARY KEY,
  characteristic_id INTEGER NOT NULL REFERENCES characteristics (id),
  review_id INTEGER NOT NULL REFERENCES reviews (id),
  "value" SMALLINT CHECK (value BETWEEN 1 AND 5)
);

CREATE INDEX idx_product_id_r ON reviews (product_id);
CREATE INDEX idx_review_id_p ON photos (review_id);
CREATE INDEX idx_product_id_c ON characteristics (product_id);
CREATE INDEX idx_review_id_cr ON characteristic_reviews (review_id);
CREATE INDEX idx_characteristic_id_cr ON characteristic_reviews (characteristic_id);

SELECT * FROM pg_indexes WHERE tablename = 'reviews';
SELECT * FROM pg_indexes WHERE tablename = 'photos';
SELECT * FROM pg_indexes WHERE tablename = 'characteristics';
SELECT * FROM pg_indexes WHERE tablename = 'characteristic_reviews';


\COPY reviews from './parsed_data/reviews.csv' WITH (FORMAT csv, HEADER true);
\COPY photos from './parsed_data/reviews_photos.csv' WITH (FORMAT csv, HEADER true);
\COPY characteristics from './parsed_data/characteristics.csv' WITH (FORMAT csv, HEADER true);
\COPY characteristic_reviews from './parsed_data/characteristic_reviews.csv' WITH (FORMAT csv, HEADER true);

-- SELECT * FROM reviews;