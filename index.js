const cool = require('cool-ascii-faces');
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://bdrtvegwfbxxbu:e699367d65b4c11f2c23f67c2e2b8db3ab4f94c3d5c78457b5ca7a5c6bf9776a@ec2-3-225-213-67.compute-1.amazonaws.com:5432/df52bv7cckbefn',
  ssl: process.env.DATABASE_URL ? true : false
})
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/times', (req, res) => res.send(showTimes()))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM public.test_table');
      const results = { 'results' : (result) ? result.rows : null};
      res.render('pages/db', results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


showTimes = () => {
  let result = '';
  const times = process.env.TIMES || 5;
  for (i = 0; i < times; i++) {
    result += i + '';
  }
  return result;
}