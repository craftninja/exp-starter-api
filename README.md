# README

### set it up

1. `$ yarn install`
1. `$ createdb exp_starter_app_test`
1. `$ createdb exp_starter_app_development`
1. `$ yarn db:migrate`
1. `$ yarn db:migrate:test`
1. `$ nodemon start`
    * `$yarn global add nodemon` if you don't have it... this will restart your server on *most* changes

### how did this get made?

#### Create basic app
1. `$ express exp-starter-app` and cd into the created directory
1. `$ yarn install`
1. `$ git init`
1. `$ echo node_modules/ >> .gitignore`
1. `$ touch README.md` and start taking amazing notes

#### Remove all code not needed for API
1. delete public directory
1. delete views directory
1. within app.js:
    * remove all lines referencing favicon
    * remove lines referencing views and view engine setup
    * remove line referencing static files, loading public directory
    * change `res.render` to `res.json` within the error handler, with the following argument:
        ```js
        {
          message: err.message,
          error: err,
        }
        ```
    * remove unnecessary comments
    * go to an undefined url to see the proper json error
1. within routes:
    * index: change response to `res.send("oh hai");`
    * users: change response to `res.json({users: []});`
    * add `res.status(200);` above both of the responses in these files
    * visit these routes to ensure all is well
1. within package.json:
    * remove jade, serve-favicon
    * don't forget to remove trailing commas!
    * delete `node_modules` and `yarn.lock` and re-`yarn install`
1. click all the things again just to be sure!

#### Testing is the best-thing
1. create a test directory
1. create a test/features directory
1. `$ touch test/features/welcome.test.js` and add the following content:
    ```js
    const expect = require('expect');
    const request = require('supertest');

    const app = require('../../app');

    describe('Root of API', () => {
      it('welcomes visitors', async () => {
        const res = await request(app)
          .get('/')
          .expect(200);

        expect(res.text).toEqual("failing! oh hai");
        expect(res.body).toEqual({});
      });
    });
    ```
1. add a test script to the package.json with the value: `"mocha --recursive"`
1. `$ yarn add mocha --dev`
1. `$ yarn add expect --dev`
1. `$ yarn add supertest --dev`
1. once you get a proper fail, update res.text to pass
1. repeat similarly for users

#### Connect PostgreSQL (through model test for User... this is a doozy!)
1. create a new file `test/models/user.test.js` with the following content:
    ```js
    const expect = require('expect');
    const request = require('supertest');

    const User = require('../../models/user.js')

    describe('User', () => {
      it('can be created', async () => {
        const usersBefore = await User.all();
        expect(usersBefore.length).toBe(0);

        await User.create({
          firstName: 'Elowyn',
          lastName: 'Platzer Bartel',
          email: 'elowyn@example.com',
          birthYear: 2015,
          student: true,
          password: 'password',
        })
        const usersAfter = await User.all();
        expect(usersAfter.length).toBe(1);
      });
    });
    ```

1. Create the model, and add the following content:
    ```js
    const query = require('../db/index').query;

    module.exports = {
      all: async () => {
        const users = (await query('SELECT * FROM "users"')).rows;
        return users;
      },
    }
    ```

1. Create the db pool file, and add the following content:
    ```js
    const { Pool } = require('pg');

    const config = require('../dbConfig');

    const pool = new Pool(config);

    module.exports = {
      query: (text, params) => pool.query(text, params)
    };
    ```
1. `$ yarn add pg`
1. Create the `dbConfig.js` file and add the following content:
    ```js
    const url = require('url');

    const params = url.parse(process.env.DATABASE_URL);
    const auth = params.auth ? params.auth.split(':') : []

    module.exports = {
      user: auth[0],
      password: auth[1],
      host: params.hostname,
      port: params.port,
      database: params.pathname.split('/')[1],
    };
    ```
1. Create `.env.example` with the following content, then copy to .env:
    ```
    DATABASE_URL=postgres://localhost/exp_starter_app_development
    TEST_DATABASE_URL=postgres://localhost/exp_starter_app_test
    ```
1. `$ yarn add dotenv --dev`
1. Create `test/helpers.js` file with the following content:
    ```js
    require('dotenv').config();

    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
    ```
1. `$ createdb exp_starter_app_test`
1. `$ createdb exp_starter_app_development`
1. Create migration for users table:
    * create files
        * `migrations/<year><month><day><hour><minutes><seconds>.do.<description>.sql` with the following content:
            ```js
            CREATE TABLE IF NOT EXISTS "users"(
              "id"                              SERIAL            PRIMARY KEY  NOT NULL,
              "firstName"                       VARCHAR(100)      NOT NULL,
              "lastName"                        VARCHAR(100)      NOT NULL,
              "email"                           VARCHAR(200)      NOT NULL,
              "birthYear"                       INT,
              "student"                         BOOLEAN           NOT NULL DEFAULT FALSE,
              "passwordDigest"                  VARCHAR(100)      NOT NULL,
              "createdAt"                       TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt"                       TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            ```
        * `migrations/<same timestamp ^^ >.undo.<same description ^^ >.sql` with the following content:
            ```js
            DROP TABLE IF EXISTS "users";
            ```
    * add the migration scripts to package.json:
        ```json
        "db:migrate": "node postgrator.js",
        "db:migrate:test": "NODE_ENV=test node postgrator.js",
        ```
    * add the postgrator.js file with the following content:
        ```js
        if (process.env.NODE_ENV !== 'production') {
          require('dotenv').config();
        }
        if (process.env.NODE_ENV === 'test') {
          process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
        }
        let postgrator = require('postgrator');

        postgrator.setConfig({
          migrationDirectory: __dirname + '/migrations',
          driver: 'pg',
          connectionString: process.env.DATABASE_URL,
        });

        // migrate to version specified, or supply 'max' to go all the way up
        postgrator.migrate('max', function(err, migrations) {
          if (err) {
            console.log(err);
          } else {
            if (migrations) {
              console.log(
                ['*******************']
                  .concat(migrations.map(migration => `checking ${migration.filename}`))
                  .join('\n')
              );
            }
          }
          postgrator.endConnection(() => {});
        });
        ```
    * `$ yarn add postgrator`
    * `$ yarn db:migrate` and `$ yarn db:migrate:test`
1. add create property to the user model with the following async function content:
    ```js
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordDigest = bcrypt.hashSync(properties.password, salt);

    const createdUser = (await query(
      `INSERT INTO "users"(
        "firstName",
        "lastName",
        "email",
        "birthYear",
        "student",
        "passwordDigest"
      ) values ($1, $2, $3, $4, $5, $6) returning *`,
      [
        properties.firstName,
        properties.lastName,
        properties.email,
        properties.birthYear,
        properties.student,
        passwordDigest,
      ]
    )).rows[0];
    return createdUser;
    ```
1. at the top of the user model file, add:
    ```js
    const bcrypt = require('bcryptjs');
    ```
1. `$ yarn add bcryptjs`
1. Run your tests twice or more while passing... Oh no! No database cleanup after test runs!
  * Add to bottom of test helpers:
      ```js
      const clearDB = require('../lib/clearDB');
      afterEach(clearDB);
      ```
  * create `lib/clearDB.js` file with the following content:
      ```js
      const query = require('../db/index').query;

      module.exports = async () => {
        await query('delete from "users"');
      };
      ```
