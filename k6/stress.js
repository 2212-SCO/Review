import http from "k6/http";
import { sleep } from "k6";

export const options = {
  scenarios: {
    stress: {
      executor: "ramping-arrival-rate",
      preAllocatedVUs: 500,
      timeUnit: "1s",
      stages: [
        { duration: "2m", target: 1 }, // below normal load
        { duration: "5m", target: 1 },
        { duration: "2m", target: 10 }, // normal load
        { duration: "5m", target: 10 },
        { duration: "2m", target: 100 }, // around the breaking point
        { duration: "5m", target: 100 },
        { duration: "2m", target: 1000 }, // beyond the breaking point
        { duration: "5m", target: 1000 },
        { duration: "10m", target: 0 } // scale down. Recovery stage.
      ],
    },
  },
};

export default function () {
  const BASE_URL = "https://localhost:3001"; // make sure this is not production
  const responses = http.batch([
    ["GET", `${BASE_URL}/reviews?product_id=1000000&page=1&count=5&sort=newest`],
    ["GET", `${BASE_URL}/reviews?product_id=999999&page=1&count=5&sort=newest`],
    ["GET", `${BASE_URL}/reviews?product_id=910000&page=1&count=5&sort=newest`],
    ["GET", `${BASE_URL}/reviews/meta?product_id=1000000`],
    ["GET", `${BASE_URL}/reviews/meta?product_id=999999`],
    ["GET", `${BASE_URL}/reviews/meta?product_id=910000`]
  ]);
}

