import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '3m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    { duration: '5m', target: 100 }, // stay at 100 users for 10 minutes
    { duration: '2m', target: 0 }, // ramp-down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(99)<2000'], // 99% of requests must complete below 1.5s
  },
};

const BASE_URL = "https://localhost:3001"; // make sure this is not production


export default () => {
  const BASE_URL = "http://localhost:3001"; // make sure this is not production
  const response = http.get(`${BASE_URL}/reviews?product_id=999999&page=1&count=5&sort=newest`);
  const responses = http.batch([
    ["GET", `${BASE_URL}/reviews?product_id=999999&page=1&count=5&sort=newest`],
    ["GET", `${BASE_URL}/reviews?product_id=991900&page=1&count=5&sort=newest`],
    ["GET", `${BASE_URL}/reviews?product_id=909999&page=1&count=5&sort=newest`],
    ["GET", `${BASE_URL}/reviews?product_id=999099&page=1&count=5&sort=newest`]
  ]);
  sleep(1);
};
