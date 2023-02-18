const axios = require('axios');
const models = require('../models');

module.exports = {
  getReviewMetaData: (req, res) => {
    console.log('IM IN CONTROLLER');
    models.reviews.getMeta( req.query, (err, data) => {
      if (err) {
        res.sendStatus(400);
        console.log('error with getting reviews meta: ', err);
      } else {
        res.status(200).json(data);
      }
    });
  },

  getReviewsByProduct: (req, res) => {
    console.log('IM IN CONTROLLER');
    models.reviews.getAll( req.query, (err, reviews) => {
      if (err) {
        res.sendStatus(400);
        console.log('error with getting reviews: ', err);
      } else {
        res.status(200).json(reviews);
      }
    });
  },

  setHelpfulReview: (req, res) => {
    const { review_id } = req.body;
    const url = `/reviews/${review_id}/helpful`;
    const options = {
      method: 'put',
      baseURL,
      url,
      headers: {
        Authorization: process.env.API_KEY,
      },
      data: {
        helpfulness: req.body.helpfulness += 1,
      },
    };

    axios(options)
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(404);
      });
  },

  addReview: (req, res) => {
    const url = '/reviews';
    const options = {
      method: 'post',
      baseURL,
      url,
      headers: {
        Authorization: process.env.API_KEY,
      },
      data: req.body,
    };

    axios(options)
      .then((result) => {
        res.status(201).send(result.data);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(404);
      });
  },

  reportReview: (req, res) => {
    const { review_id } = req.body;
    const url = `/reviews/${review_id}/report`;

    const options = {
      method: 'put',
      baseURL,
      url,
      headers: {
        Authorization: process.env.API_KEY,
      },
    };

    axios(options)
      .then((results) => {
        res.status(204).json(results.data);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(404);
      });
  },
};
