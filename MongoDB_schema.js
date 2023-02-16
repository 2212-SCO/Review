const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/review', { useNewUrlParser: true, useUnifiedTopology: true });

let reviewSchema = new mongoose.Schema({
  id: { type: Number, unique: true, dropDups: true },
  product_id: Number,
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: String,
  body: String,
  date: Date,
  review_name: String,
  helpfulness: Number,
  reported: Boolean,
  characteristic_ratings: [{
    characteristic: String,
    rating: Number,
  }],
  photos: [{
    url: String,
  }],
});
