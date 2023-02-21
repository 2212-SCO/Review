const axios = require('axios');
const models = require('../models');

module.exports = {
  getReviewMetaData: (req, res) => {
    // console.log('IM IN CONTROLLER');
    models.reviews.getMeta( req.query, (err, data) => {
      if (err) {
        res.sendStatus(400);
        // console.log('error with getting reviews meta: ', err);
      } else {
        res.status(200).json(data);
      }
    });
  },

  getReviewsByProduct: (req, res) => {
    // console.log('IM IN CONTROLLER');
    models.reviews.getAll( req.query, (err, reviews) => {
      if (err) {
        res.sendStatus(400);
        // console.log('error with getting reviews: ', err);
      } else {
        res.status(200).json(reviews);
      }
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
