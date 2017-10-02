require('dotenv').config();

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

const clearDB = require('../../lib/clearDB');

afterEach(clearDB);
