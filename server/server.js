const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
//const helmet = require('helmet');

const routes = require('./routes');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(morgan('dev'));
//app.use(helmet());

app.use(express.json());
app.use(routes);

module.exports = app;
