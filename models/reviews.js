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
  };
  getMeta: function(query, callback) {
    let { product_id } = query;




  };

};