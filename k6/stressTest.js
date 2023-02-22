import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const last10Percent = Math.floor(1000011 * 0.1);
const product_id = Math.floor(Math.random() * last10Percent) + (1000011 - last10Percent);
const page = 1;
const count = Math.floor(Math.random() * 5 + 1);
const sortOptions = ['helpful', 'newest', 'relevant'];
const sortBy = sortOptions[Math.floor(Math.random() * 3)]

export const options = {
  // summaryTrendStats: ['min', 'avg', 'med', 'max', 'p(95)', 'p(99)'],
  stages: [
    { duration: '1m', target: 300 },
    { duration: '1m', target: 1000 },
    { duration: '1m', target: 1800 },
    { duration: '5m', target: 2000 },
  ],

  thresholds: {
    http_req_duration: [{threshold: 'p(95) < 1500', abortOnFail: true}], // 99% of requests must complete below 2s
    http_req_failed: [{threshold: 'rate < 0.01', abortOnFail: true}] // only 1% of requests can fail
  },
};


export default () => {
  const BASE_URL = "http://localhost:3001";
  // const response = http.get(`${BASE_URL}/reviews?product_id=${product_id}&page=${page}&count=${count}&sort=${sortBy}`);
  const responses = http.batch([
    ["GET", `${BASE_URL}/reviews?product_id=${product_id}&page=${page}&count=${count}&sort=${sortBy}`],
    ["GET", `${BASE_URL}/reviews/meta?product_id=${product_id}`]
  ]);
  sleep(1);
};

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}


  // const responses = http.batch([
  //   ["GET", `${BASE_URL}/reviews?product_id=${product_id}&page=${page}&count=${count}&sort=${sortBy}`],
  //   ["GET", `${BASE_URL}/reviews/meta?product_id=${product_id}`]
  // ]);
  // const responses = http.batch([
  //   ["GET", `${BASE_URL}/reviews?product_id=999999&page=1&count=5&sort=newest`]
  //   // ["GET", `${BASE_URL}/reviews?product_id=991900&page=1&count=5&sort=newest`],
  //   // ["GET", `${BASE_URL}/reviews?product_id=909999&page=1&count=5&sort=newest`],
  //   // ["GET", `${BASE_URL}/reviews?product_id=999099&page=1&count=5&sort=newest`],
  //   // ["GET", `${BASE_URL}/reviews/meta?product_id=919999`],
  //   // ["GET", `${BASE_URL}/reviews/meta?product_id=991100`],
  //   // ["GET", `${BASE_URL}/reviews/meta?product_id=929999`],
  //   // ["GET", `${BASE_URL}/reviews/meta?product_id=999299`]
  // ]);