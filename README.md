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
retrieves metadata for reviews
### GET /reviews 
retrieves reviews for a product
### POST /reviews 
adds a new review
### PUT /reviews/:review_id/helpful 
updates the helpful count for a review
### PUT /reviews/:review_id/report 
reports a review

## Optimization
To ensure high performance and low latency, the server was built with Node.js and the database was built using PostgreSQL. However, it was discovered that the server was not performing optimally during stress testing. Two main bottlenecks were identified: slow single-query time on the database and a limited ability to handle user requests per second.

To address these issues, the following optimizations were implemented:

Database optimization: Indexes were added to the product ID, which resulted in a 90% reduction in single-query time, from over 1 second to less than 100 milliseconds.
Caching implementation: A cache system was implemented using Redis for frequently accessed data. This resulted in an 80% reduction in average latency, dropping from 100ms to just 18ms, and the server could handle 1000 requests per second.
Load balancing: The API was deployed to an EC2 micro instance on AWS, and load testing was performed to ensure it could handle high traffic loads during peak holiday seasons. A load balancer was implemented using Nginx, and two more instances were added to increase performance further. The results showed a 300% improvement in requests per second, increasing from 1000 to 4000, with error rates below one percent.
Overall, these optimizations resulted in a much faster and smoother review section for the e-commerce app, and provided valuable experience in database optimization and caching implementation.
