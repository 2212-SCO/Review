require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const router = require('./routes');

const app = express();
const { PORT } = process.env;

app.use(morgan('dev'));
app.use(express.json());
app.use(router);

app.get(`/${process.env.LOADER_IO}`, (req, res) => {
  res.send(process.env.LOADER_IO);
});
// app.use(express.static(path.join(__dirname, '../client/dist')));

app.listen(PORT, () => {
  console.log(`Server Listening at http://localhost:${PORT}`);
});

module.exports = app;
