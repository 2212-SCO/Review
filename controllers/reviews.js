const models = require('../models');
const Redis = require('ioredis');
// Create a Redis client instance
const redis = new Redis({
  port:6379,
  host:'127.0.0.1'
});

module.exports = {

  getReviewMetaData: (req, res) => {
    // console.log('IM IN CONTROLLER');
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
  },

  getReviewsByProduct: (req, res) => {
    // console.log('IM IN CONTROLLER');
    const cacheKey = `reviewsByProduct:${JSON.stringify(req.query)}`;
    // Check if the data is cached in Redis
    redis.get(cacheKey, (err, cachedData) => {
      if (cachedData) {
        // If the data is cached, return it
        const data = JSON.parse(cachedData);
        res.status(200).json(data);
      } else {
        models.reviews.getAll( req.query, (err, data) => {
          if (err) {
            res.sendStatus(400);
            // console.log('error with getting reviews: ', err);
          } else {
            redis.setex(cacheKey, 600, JSON.stringify(data));
            res.status(200).json(data);
          }
        });
      };
    });
  },

  addReview: (req, res) => {
    models.reviews.postReview( req.body, (err, data) => {
      if (err) {
        res.sendStatus(400);
        // console.log('error with post review: ', err);
      } else {
        // console.log('POST: ', data);
        res.status(201).json(data);
      }
    });
  },

  setHelpfulReview: (req, res) => {
    models.reviews.setHelpful( req.params, (err, data) => {
      if (err) {
        res.sendStatus(400);
        // console.log('error with update helpful: ', err);
      } else {
        // console.log('PUT: ', data);
        res.status(204).json(data);
      }
    });
  },

  reportReview: (req, res) => {
    models.reviews.setReport( req.params, (err, data) => {
      if (err) {
        res.sendStatus(400);
        // console.log('error with report: ', err);
      } else {
        // console.log('PUT: ', data);
        res.status(204).json(data);
      }
    });
  }
};
