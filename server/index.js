const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const {
  redisHost,
  redisPort,
  pgUser,
  pgDatabase,
  pgHost,
  pgPassword,
  pgPort,
} = require('./keys');

// Express Setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const pgClient = new Pool({
  user: pgUser,
  host: pgHost,
  database: pgDatabase,
  password: pgPassword,
  port: pgPort,
});

pgClient.on('connect', () => {
  pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.log(err));
});

// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

// Routes
app.get('/', (req, res, next) => {
  res.send('Hi');
});

app.get('/values/all', async (req, res, next) => {
  const values = await pgClient.query('SELECT *  FROM values');
  res.send(values.rows);
});

app.get('/values/current', async (req, res, next) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res, next) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }

  redisClient.hset('values', index, 'Nothing yet');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
  res.status(201).send({ working: true });
});

app.listen(5000, (err) => {
  console.log('Listening on PORT 5000');
});
