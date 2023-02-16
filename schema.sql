
-- USE sdc;
  /* Describe your table here.*/

CREATE TABLE reviews (
  id INTEGER NOT NULL DEFAULT 0,
  product_id varchar(255),
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  summary varchar(60) not null,
  body varchar(1000) not null,
  recommend boolean not null,
  reported boolean not null,
  review_name varchar(60) not null,
  reviewer_email varchar(255) not null,
  response varchar(1000) default null,
  helpfulness INTEGER NOT NULL,
  "date" timestamptz NOT NULL,
  PRIMARY KEY (id)
);

/* Create other tables and define schemas for them here! */
CREATE TABLE photos (
  id INTEGER NOT NULL DEFAULT 0,
  review_id INTEGER NOT NULL,
  "url" varchar(1000) not null,
  PRIMARY KEY (id),
  FOREIGN KEY (review_id)
    REFERENCES reviews (id)
);

CREATE TABLE characteristics (
  id INTEGER NOT NULL DEFAULT 0,
  product_id INTEGER NOT NULL,
  "name" varchar(100) not null,
  PRIMARY KEY (id)
);


CREATE TABLE characteristic_reviews (
  id INTEGER NOT NULL DEFAULT 0,
  characteristic_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  "value" SMALLINT CHECK (value BETWEEN 1 AND 5),
  PRIMARY KEY (id),
  FOREIGN KEY (characteristic_id)
    REFERENCES characteristics (id),
  FOREIGN KEY (review_id)
    REFERENCES reviews (id)
)

