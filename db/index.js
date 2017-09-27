const { Pool } = require('pg');

const config = require('../dbConfig');

const pool = new Pool(config);

exports.query = (text, params) => pool.query(text, params);
