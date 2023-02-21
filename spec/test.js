const request = require('supertest');
const app = require('../index.js');


describe('GET /reviews', () => {
  it('return a json response containing the reviews for a product', async () => {
    const response = await request(app).get('/reviews?product_id=1&page=1&count=5&sort=newest');
    expect(response.statusCode).toBe(200);
    expect(response.body.product).toBe('1');
  });
});

describe('POST /reviews', () => {
  it('post a review for a product', async () => {
    const review = {
      "product_id": 8,
      "rating": 5,
      "summary": "this is a test",
      "recommend": true,
      "body": "it fits me perfectly",
      "name": "monks",
      "email":"q@gmail.com",
      "photos": [ "https://images.unsplash.com/photo-1561861422-a549073e547a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80","https://images.unsplash.com/photo-1544376664-80b17f09d399?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1525&q=80"],
      "characteristics": {
          "26": 1,
          "27": 1,
          "28": 1,
          "29": 1
      }
    };
    const response = await request(app)
      .post('/reviews')
      .send(review);
    expect(response.statusCode).toBe(201);
    expect(response.text).toBe("\"posted\"");
  });
});

describe('GET /reviews/meta', () => {
  it('return a json response containing the review meta data for a product', async () => {
    const response = await request(app).get('/reviews/meta?product_id=8');
    expect(response.statusCode).toBe(200);
    expect(response.body.product_id).toBe('8');
  });
});

