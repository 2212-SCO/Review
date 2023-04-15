<h1 align="center">
  <br>
    Product Review API
    <h4 align="center">
        <i>an optmized API server and database to support an e-commerce application with millions of products </i>
      <br>
    </h4>
</h1>

## technologies used

![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)

## Summary
This API  is part of a full-stack application built for an e-commerce app with millions of products. The focus is on the product detail page, specifically the product review section. The primary responsibility of this API  is to handle the GET and POST requests from the frontend, allowing users to see a list of reviews and post a new review.

## Features
This API defines the following routes for the Review service:

### GET /reviews/meta
retrieves metadata for reviews.
example:
```
const config = {
  method: 'get',
  url: 'http://localhost:3001/reviews/meta',
  params: {
    product_id: 910001
  },
  headers: {
    'Authorization': 'to be filled in'
  }
};
```

### GET /reviews 
retrieves reviews for a product.
example: 
```
const config = {
  method: 'get',
  url: 'http://localhost:3001/reviews',
  params: {
    product_id: 910001,
    page: 1,
    count: 4,
    sort: 'relevant'
  },
  headers: {
    'Authorization': 'to be filled in'
  }
};

```

### POST /reviews 
adds a new review.
example:
```
const data = JSON.stringify({
  "product_id": 7,
  "rating": 5,
  "summary": "this is photo test",
  "recommend": true,
  "body": "it fits me perfectly",
  "name": "monks",
  "email": "q@gmail.com",
  "photos": [
    "https://images.unsplash.com/photo-1561861422-a549073e547a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
    "https://images.unsplash.com/photo-1544376664-80b17f09d399?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1525&q=80"
  ],
  "characteristics": {
    "26": 1,
    "27": 1,
    "28": 1,
    "29": 1
  }
});

const config = {
  method: 'post',
  url: 'http://localhost:3001/reviews/',
  headers: { 
    'Content-Type': 'application/json'
  },
  data: data
};
```
### PUT /reviews/:review_id/helpful 
updates the helpful count for a review
```
const config = {
  method: 'put',
  url: 'http://localhost:3001/reviews/5774980/helpful',
  headers: {}
};
```
### PUT /reviews/:review_id/report 
reports a review
```
const config = {
  method: 'put',
  url: 'http://localhost:3001/reviews/5774980/report',
  headers: {}
};
```

## Database
The Reviews database was built with PostgreSQL and consists of four tables: reviews, photos, characteristics, and characteristic_reviews.

### ETL (Extract, Transform, Load) 
The ETL process involves the following steps:
- Reading raw CSV data from a file located at ./raw_data/reviews.csv.
- Cleaning and transforming the data using a Transform stream called CSVCleaner.
- Writing the cleaned and transformed data to a new CSV file located at ./parsed_data/reviews.csv.

The `CSVCleaner` class uses the Transform stream to process the input data by performing several cleaning and transformation tasks on each chunk of data. These tasks include:
- Trimming whitespace from object keys
- Removing non-number characters from the `id`, `product_id`, and `rating` fields
- Converting the `date` field to a string in the format that can be used with the `timestamp` data type in PostgreSQL
- Using the `csv-writer` package to convert the cleaned data into a CSV string format
- Pushing the cleaned data to the next stream

Finally, the cleaned and transformed data is written to a new CSV file using the `createWriteStream` method.

### Table schema
#### Reviews Table

| Column Name  | Data Type    | Constraints                                  |
|--------------|--------------|----------------------------------------------|
| review_id    | SERIAL       | PRIMARY KEY                                  |
| product_id   | INTEGER      | NOT NULL                                     |
| rating       | SMALLINT     | CHECK (rating BETWEEN 1 AND 5)               |
| date         | TIMESTAMPTZ  | DEFAULT now() NOT NULL                       |
| summary      | TEXT         | NOT NULL                                     |
| body         | TEXT         | NOT NULL                                     |
| recommend    | BOOLEAN      | NOT NULL                                     |
| reported     | BOOLEAN      | DEFAULT false                                |
| review_name  | VARCHAR(60)  | NOT NULL                                     |
| reviewer_email | VARCHAR(255) | NOT NULL                                   |
| response     | TEXT         | DEFAULT NULL                                 |
| helpfulness  | INTEGER      | DEFAULT 0                                    |

#### Photos Table

| Column Name  | Data Type    | Constraints                                   |
|--------------|--------------|-----------------------------------------------|
| id           | SERIAL       | PRIMARY KEY                                   |
| review_id    | INTEGER      | NOT NULL REFERENCES reviews (review_id)       |
| url          | TEXT         | NOT NULL                                      |

#### Characteristics Table

| Column Name  | Data Type    | Constraints                                   |
|--------------|--------------|-----------------------------------------------|
| id           | SERIAL       | PRIMARY KEY                                   |
| product_id   | INTEGER      | NOT NULL                                      |
| name         | VARCHAR(10)  | NOT NULL                                      |

#### Characteristic_Reviews Table

| Column Name      | Data Type    | Constraints                                               |
|------------------|--------------|-----------------------------------------------------------|
| id               | SERIAL       | PRIMARY KEY                                               |
| characteristic_id | INTEGER      | NOT NULL REFERENCES characteristics (id)                 |
| review_id        | INTEGER      | NOT NULL REFERENCES reviews (review_id)                   |
| value            | SMALLINT     | CHECK (value BETWEEN 1 AND 5)                             |


## Optimization
To ensure high performance and low latency, the server was built with Node.js and the database was built using PostgreSQL. However, it was discovered that the server was not performing optimally during stress testing. Two main bottlenecks were identified: slow single-query time on the database and a limited ability to handle user requests per second.

To address these issues, the following optimizations were implemented:

### Database optimization
Indexes were added to the product ID, which resulted in a 90% reduction in single-query time, from over 1 second to less than 100 milliseconds.
```
CREATE INDEX idx_product_id_r ON reviews (product_id);
```
### Caching implementation
A cache system was implemented using Redis for frequently accessed data. This resulted in an 80% reduction in average latency, dropping from 100ms to just 18ms, and the server could handle 1000 requests per second. example: 
```
const Redis = require('ioredis');
// Create a Redis client instance
const redis = new Redis({
  port:6379,
  host:'127.0.0.1'
});
...
    const cacheKey = `reviewsMetaData:${JSON.stringify(req.query)}`;
    // Check if the data is cached in Redis
    redis.get(cacheKey, (err, cachedData) => {
      if (cachedData) {
        // If the data is cached, return it
        const data = JSON.parse(cachedData);
        res.status(200).json(data);
      } else {
        models.reviews.getMeta( req.query, (err, data) => {
          if (err) {
            res.sendStatus(400);
            // console.log('error with getting reviews meta: ', err);
          } else {
            redis.setex(cacheKey, 600, JSON.stringify(data));
            res.status(200).json(data);
          }
        });
      }
    });
```
### Load balancing
The API was deployed to an EC2 micro instance on AWS, and stress testing was performed to ensure it could handle high traffic loads during peak holiday seasons. A load balancer was implemented using Nginx, and two more instances were added to increase performance further. The results showed a 300% improvement in requests per second, increasing from 1000 to 4000, with error rates below one percent.
```
http {
  upstream app_servers {
    server ec2-xx-xxx-xxx-xx.compute-1.amazonaws.com:80;
    server ec2-yy-yyyyy-yyyyy.compute-1.amazonaws.com:80;
    server ec2-zz-zzzzz-zzzzz.compute-1.amazonaws.com:80;
  }

  server {
    listen 80;
    server_name mydomain.com;

    location / {
      proxy_pass http://app_servers;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }
  }
}
```

Overall, these optimizations resulted in a much faster and smoother review section for the e-commerce app, and provided valuable experience in database optimization and caching implementation.
