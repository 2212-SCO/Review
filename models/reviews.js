var db = require('../db');
module.exports = {
  // a function which produces reviews
  getAll: function (query, callback) {
    let { product_id, sort, page, count } = query;
    page = Number(page) || 1;
    count = Number(count) || 5;
    const offset = (page - 1) * count;
    const params = [product_id, count, offset];
    if (sort === 'helpful') {
      var sortBy = 'ORDER BY r.helpfulness DESC';
    } else if (sort === 'newest') {
      var sortBy = 'ORDER BY r.date DESC';
    } else {
      var sortBy = 'ORDER BY r.date DESC, r.helpfulness DESC';
    }
    var queryString = `SELECT r.*, array_to_json(array_remove(array_agg(photos), NULL)) as photos FROM reviews r LEFT JOIN photos ON r.review_id = photos.review_id WHERE product_id = $1 AND reported = false GROUP BY r.review_id ${sortBy} LIMIT $2 OFFSET $3`;
    db.query(queryString, params)
      .catch(err => console.error('Error executing query', err.stack))
      .then(res => {
        // console.log(res);
        const data = {
          'product': product_id,
          'page': page,
          'count': count,
          'results': res.rows
        }
        callback(null, data)
      })
  },

  getMeta: function (query, callback) {
    let { product_id } = query;
    //calculate rating distribution
    const params = [product_id];
    var queryString1 = `WITH ratings_d AS ( SELECT product_id, rating, count(rating) as frequency FROM reviews WHERE product_id = $1 GROUP BY product_id, rating ), recommended_d AS ( SELECT product_id, recommend, count(recommend) as frequency FROM reviews WHERE product_id = $1 GROUP BY product_id, recommend ), characteristic_d AS ( SELECT c.product_id, c."name", jsonb_build_object('id', c.id, 'value', AVG(cr."value")) AS avgvalue FROM characteristic_reviews cr JOIN reviews r ON r.review_id = cr.review_id JOIN characteristics c ON cr.characteristic_id = c.id WHERE c.product_id = $1 GROUP BY c.product_id, c.id, c."name" )`;
    var queryString2 = `SELECT ratings_d.product_id, jsonb_object_agg(ratings_d.rating, ratings_d.frequency) AS ratings, jsonb_object_agg(recommended_d.recommend, recommended_d.frequency) AS recommended, jsonb_object_agg(characteristic_d.name, characteristic_d.avgvalue) AS characteristics FROM ratings_d JOIN recommended_d ON ratings_d.product_id = recommended_d.product_id JOIN characteristic_d ON ratings_d.product_id = characteristic_d.product_id GROUP BY ratings_d.product_id`;
    var queryString = queryString1 + queryString2;
    db.query(queryString, params)
      .catch(err => callback(err.stack, null))
      .then(res => {
        if (res.rows.length === 0) {
          const obj = {
            "product_id": product_id,
            "ratings": {},
            "recommended": {},
            "characteristics": {}
          }
          callback(null, obj)
        } else {
          callback(null, res.rows)
        }
      })
  }

};