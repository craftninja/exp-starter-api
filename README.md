[![CircleCI](https://circleci.com/gh/craftninja/exp-starter-api.svg?style=shield)](https://circleci.com/gh/craftninja/exp-starter-api)
[![Code Climate](https://codeclimate.com/github/craftninja/exp-starter-api/badges/gpa.svg)](https://codeclimate.com/github/craftninja/exp-starter-api)
[![Test Coverage](https://codeclimate.com/github/craftninja/exp-starter-api/badges/coverage.svg)](https://codeclimate.com/github/craftninja/exp-starter-api/coverage)
[![Issue Count](https://codeclimate.com/github/craftninja/exp-starter-api/badges/issue_count.svg)](https://codeclimate.com/github/craftninja/exp-starter-api)


# README

### set it up

1. `$ yarn install`
1. `$ cp .env.example .env`
1. `$ createdb exp_starter_app_test`
1. `$ createdb exp_starter_app_development`
1. `$ yarn db:migrate`
1. `$ yarn db:migrate:test`
1. rollback to a specific version:
* `$ MIGRATE_TO=<TIMESTAMP OF MIGRATION> yarn db:migrate`
1. `$ nodemon start`
* `$ yarn global add nodemon` if you don't have it... this will restart your server on *most* changes

### deploy to heroku:
1. create app on heroku
1. add Heroku Postgres add-on
1. add needed envs (no need to add test database url or database url, database url should already be created)
1. `$ heroku run yarn db:migrate`
1. `$ heroku logs --tail` if you need to see logs

### Tests, test coverage & reports, and linter
Tests (also runs linter on success)
* `$ yarn test`

Test coverage and reports
* `$ yarn coverage` - runs tests and reports coverage
* `$ yarn reports` - generates coverage artifacts

Linter alone
1. `$ yarn lint`

### [curl docs](./curl.md)

### steeeel it
* Clone it
* Reset your origin url to a new GH url that you own
* Add the repo on your code climate and circle CI account
* Change the urls of all the above badges to reflect your repositories
* IMPORTANT: Update the `CC_TEST_REPORTER_ID` with your token in circle.yml
  * OR if you do not set up Code Climate, remove that line and also remove all "dependencies" and "test" in the circle.yml file
* Follow instructions to set it up renaming database to something that is more useful
* Push up the repo and watch for circle and code climate to update
* Do your thing

### contribute to it
* fork, clone, setup locally following the 'set it up' instructions
* add remote "upstream" with this repo's ssh url
* checkout a branch and commit your work
* push branch to your repo
* submit pr
* periodically pull upstream master into master, and rebase the branch on top, force pushing the rebased branch when necessary

### todo
* [ ] user can update their info using the same email
* [ ] swagger - Mickey
* [ ] mrrrbe repository pattern for models - abstract SQL away from models?
* [ ] do we yeoman?
* [ ] Create stored procedures and move SQL queries out of models; update models to invoke stored procedures

---

### how did this get made?
This outlines a large portion of basic beginning setup, but is no longer being extended.
Subject to deletion.

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
        const postgrator = require('postgrator');

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
#### Add signup route
1. Write the test in `features/users.test.js`:
    ```js
    it('can signup and receive a JWT', async () => {
      const res = await request(app)
        .post('/users')
        .send({
          firstName: 'Elowyn',
          lastName: 'Platzer Bartel',
          email: 'elowyn@example.com',
          birthYear: 2015,
          student: true,
          password: 'password',
        })
        .expect(200);

      expect(res.body.jwt).not.toBe(undefined);
      expect(res.body.user.id).not.toBe(undefined);
      expect(res.body.user.firstName).toEqual('Elowyn');
      expect(res.body.user.lastName).toEqual('Platzer Bartel');
      expect(res.body.user.email).toEqual('elowyn@example.com');
      expect(res.body.user.birthYear).toEqual(2015);
      expect(res.body.user.student).toEqual(true);

      expect(res.body.user.passwordDigest).toEqual(undefined);
      expect(res.body.user.createdAt).toEqual(undefined);
      expect(res.body.user.updatedAt).toEqual(undefined);
    });
    ```
1. Add to the users routes: `router.post('/', usersController.create);` and `const usersController = require('../controllers/users')` at the top
1. Create the `controllers/user` with the following content:
    ```js
    const jwt = require('jsonwebtoken');

    const userSerializer = require('../serializers/user');
    const User = require('../models/user');

    module.exports = {
      create: async (req, res, next) => {
        const user = await User.create(req.body);
        const serializedUser = await userSerializer(user);
        const token = jwt.sign({ user: serializedUser }, process.env.JWT_SECRET);
        res.json({ jwt: token, user: serializedUser });
      }
    }
    ```
1. Add the `JWT_SECRET` to the `.env.example` and `.env`. Value doesn't really matter as long as it's the same to encode and decode the JWTs
1. `$ yarn add jsonwebtoken`
1. You will likely or eventually need to require `helpers.js` at the top of each test file (above everything except the package dependencies). If all tests are run, you will only need it to be required in a preceding run file, but if you run a single test `yarn test test/models/user.test.js` you will be missing that requirement.
1. Add `serializers/user.js` with the following content:
    ```js
    module.exports = user => {
      const serialized = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        birthYear: user.birthYear,
        student: user.student,
      };
      return serialized;
    };
    ```
1. Try curling the signup route ([see curl docs](../curl.md))
    * add `if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }` to the top of the bin/www file and restart the server if needed

#### Update the users route
We left the users route returning an empty array. Let's update that test and drive the rewrite to make this actually query the database.
1. Update the feature test for users index:
    ```js
    it('can be listed, without users and with one added', async () => {
      const resNoUsers = await request(app)
        .get('/users')
        .expect(200);
      expect(resNoUsers.body).toEqual({users: []});

      await User.create({
        firstName: 'Elowyn',
        lastName: 'Platzer Bartel',
        email: 'elowyn@example.com',
        birthYear: 2015,
        student: true,
        password: 'password',
      })

      const resWithUsers = await request(app)
        .get('/users')
        .expect(200);

      expect(resWithUsers.body.users.length).toEqual(1);
      const newUser = resWithUsers.body.users[0]
      expect(resWithUsers.jwt).toBe(undefined);
      expect(newUser.id).not.toBe(undefined);
      expect(newUser.firstName).toEqual('Elowyn');
      expect(newUser.lastName).toEqual('Platzer Bartel');
      expect(newUser.email).toEqual('elowyn@example.com');
      expect(newUser.birthYear).toEqual(2015);
      expect(newUser.student).toEqual(true);

      expect(newUser.passwordDigest).toEqual(undefined);
      expect(newUser.createdAt).toEqual(undefined);
      expect(newUser.updatedAt).toEqual(undefined);
    });
    ```
1. Require the User model in the top of the test file
1. Update the users index route to: `router.get('/', usersController.index);`
1. Update the users controller to add the index action like so:
    ```js
    index: async (req, res, next) => {
      const users = await User.all();
      const serializedUsers = users.map(user => userSerializer(user));
      res.json({ users: serializedUsers });
    },
    ```

#### Users can log in and receive a JWT
1. Add a `features/authentication.test.js` with the following content:
    ```js
    const expect = require('expect');
    const request = require('supertest');

    require('../helpers')

    const app = require('../../app');

    const User = require('../../models/user')

    describe('Authentication - ', () => {
      it('users can log in and receive a JWT', async () => {
        const userParams = {
          firstName: 'Elowyn',
          lastName: 'Platzer Bartel',
          email: 'elowyn@example.com',
          birthYear: 2015,
          student: true,
          password: 'password',
        };

        const user = await User.create(userParams);
        const res = await request(app)
          .post('/login')
          .send({ email: 'elowyn@example.com', password: 'password' })
          .expect(200);
        expect(res.body.jwt).not.toBe(undefined);
        expect(res.body.user).toEqual({
          id: user.id,
          firstName: 'Elowyn',
          lastName: 'Platzer Bartel',
          email: 'elowyn@example.com',
          birthYear: 2015,
          student: true,
        });
        expect(res.body.user.passwordDigest).toEqual(undefined);
        expect(res.body.user.createdAt).toEqual(undefined);
        expect(res.body.user.updatedAt).toEqual(undefined);
      });
    });
    ```
1. Add the login route to app.js, and the login route file with the following content:
    ```js
    const express = require('express');
    const router = express.Router();

    const loginController = require('../controllers/login')

    router.post('/', loginController.create);

    module.exports = router;
    ```
1. Add the login controller with the following content:
    ```js
    const User = require('../models/user');

    exports.create = async (req, res, next) => {
      res.json(await User.authenticate(req.body));
    };
    ```
1. Add the authenticate method to the User model:
    ```js
    authenticate: async credentials => {
      const user = (await query('SELECT * FROM "users" WHERE "email" = ($1)', [
        credentials.email,
      ])).rows[0];

      const valid = user
        ? await bcrypt.compare(credentials.password, user.passwordDigest)
        : false;
      if (valid) {
        const serializedUser = await userSerializer(user);
        const token = jwt.sign({ user: serializedUser }, process.env.JWT_SECRET);
        return { jwt: token, user: serializedUser };
      } else {
        return { errors: ['Email or Password is incorrect'] };
      }
    },
    ```

#### Require Authentication for the User index
We don't want to allow just anybody to get a list of users. Let's lock this route down.
1. Update the user index feature test:
    ```js
    it('can be listed for a logged in user', async () => {
      const user = await User.create({
        firstName: 'Elowyn',
        lastName: 'Platzer Bartel',
        email: 'elowyn@example.com',
        birthYear: 2015,
        student: true,
        password: 'password',
      });
      serializedUser = await userSerializer(user);
      token = jwt.sign({ user: serializedUser }, process.env.JWT_SECRET);

      const resNotLoggedIn = await request(app)
      .get('/users')
      .expect(404);

      const resLoggedIn = await request(app)
        .get('/users')
        .set('jwt', token)
        .expect(200);

      expect(resLoggedIn.body.users.length).toEqual(1);
      const newUser = resLoggedIn.body.users[0]
      expect(resLoggedIn.jwt).toBe(undefined);
      expect(newUser.id).not.toBe(undefined);
      expect(newUser.firstName).toEqual('Elowyn');
      expect(newUser.lastName).toEqual('Platzer Bartel');
      expect(newUser.email).toEqual('elowyn@example.com');
      expect(newUser.birthYear).toEqual(2015);
      expect(newUser.student).toEqual(true);
      expect(newUser.passwordDigest).toEqual(undefined);
      expect(newUser.createdAt).toEqual(undefined);
      expect(newUser.updatedAt).toEqual(undefined);
    });
    ```
1. reorder user routes and add the verifyLoggedInUser middleware, required at the top from a `lib/verifyLoggedInUser.js`:
      ```js
      router.post('/', usersController.create);

      router.use(verifyLoggedInUser);

      router.get('/', usersController.index);
      ```
1. Add the verifyLoggedInUser file with the following content:
    ```js
    const jwt = require('jsonwebtoken');

    const currentUser = require('./currentUser');

    module.exports = (req, res, next) => {
      const token = req.headers.jwt;
      if (!currentUser(token)) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
      }
      next();
    };
    ```
1. Add the currentUser file with the following content:
    ```js
    const jwt = require('jsonwebtoken');

    module.exports = token => {
      try {
        return jwt.verify(token, process.env.JWT_SECRET).user;
      } catch (err) {
        return undefined
      }
    };
    ```

#### Uniformity refactor
* Refactored `var`s into `const`s (and `let`s where necessary)
* Refactored module.exports to exports.method

#### Adding prettier
1. `$ yarn add prettier --dev`
1. add script to package.json: `"prettier": "prettier --single-quote --trailing-comma=es5 --list-different --write es5 './**/*.js'",`
1. run prettier and approve diffs if you like them!

#### User can be found by a property
1. Add a model test:
    ```js
    it('can be found by property', async () => {
      const user = await User.create({
        firstName: 'Elowyn',
        lastName: 'Platzer Bartel',
        email: 'elowyn@example.com',
        birthYear: 2015,
        student: true,
        password: 'password',
      });

      const foundUser = await User.findBy({ email: 'elowyn@example.com' });
      expect(foundUser.firstName).toEqual('Elowyn');
      expect(foundUser.lastName).toEqual('Platzer Bartel');
      expect(foundUser.email).toEqual('elowyn@example.com');
      expect(foundUser.birthYear).toEqual(2015);
      expect(foundUser.student).toEqual(true);
    });
    ```
1. Add the method to the User model:
    ```js
    exports.findBy = async property => {
      const key = Object.keys(property)[0];
      let findByQuery;
      switch (key) {
        case 'firstName':
          findByQuery = 'SELECT * FROM "users" WHERE "firstName" = $1 LIMIT 1';
          break;
        case 'lastName':
          findByQuery = 'SELECT * FROM "users" WHERE "lastName" = $1 LIMIT 1';
          break;
        case 'email':
          findByQuery = 'SELECT * FROM "users" WHERE "email" = $1 LIMIT 1';
          break;
        case 'birthYear':
          findByQuery = 'SELECT * FROM "users" WHERE "birthYear" = $1 LIMIT 1';
          break;
        case 'student':
          findByQuery = 'SELECT * FROM "users" WHERE "student" = $1 LIMIT 1';
          break;
      };

      const value = property[key];
      const user = (await query(findByQuery, [value])).rows[0];
      return user;
    };
    ```

#### User must have a unique email
1. Add a model test:
    ```js
    it('must have unique email', async () => {
      await User.create({
        firstName: 'Elowyn',
        lastName: 'Platzer Bartel',
        email: 'elowyn@example.com',
        birthYear: 2015,
        student: true,
        password: 'password',
      });
      const duplicateUser = await User.create({
        firstName: 'Elowyn',
        lastName: 'Platzer Bartel',
        email: 'elowyn@example.com',
        birthYear: 2015,
        student: true,
        password: 'password',
      });

      expect(duplicateUser).toEqual(['Email already taken'])
      const users = await User.all();
      expect(users.length).toBe(1);
    });
    ```

1. Add the validation to the User model. Note, for extensibility of validations, add more if statements. Validations will get pushed to the errors array and finally be returned:
    ```js
    const errors = [];
    if (await this.findBy({email: properties.email})) {
      const error = 'Email already taken'
      errors.push(error);
    };
    if (errors.length > 0) { return errors };
    ```

#### Test the current user lib function independently
1. Add the happy path test, "break it" to see a good red, then allow it to pass.
    ```js
    const expect = require('expect');
    const jwt = require('jsonwebtoken');

    require('../helpers/testSetup');

    const currentUser = require('../../lib/currentUser');
    const User = require('../../models/user');
    const userSerializer = require('../../serializers/user');

    describe('currentUser', () => {
      it('returns a User when passed a valid token', async () => {
        const createdUser = await User.create({
          firstName: 'Elowyn',
          lastName: 'Platzer Bartel',
          email: 'elowyn@example.com',
          birthYear: 2015,
          student: true,
          password: 'password',
        });
        const serializedUser = userSerializer(createdUser);
        const validToken = jwt.sign({ user: serializedUser }, process.env.JWT_SECRET);

        const user = currentUser(validToken);
        expect(user).toEqual(serializedUser); //break it here for example with `.toEqual(createdUser)`
      });
    });
    ```
1. Add the sad path test...
    ```js
    it('returns undefined when passed an invalid token', async () => {
      const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

      const user = currentUser(invalidToken);
      expect(user).toEqual(undefined);
    });
    ```
1. Add tests for user login sad path (auth feature test):
    ```js
    it('users cannot login without valid credentials', async () => {
      const userParams = {
        firstName: 'Elowyn',
        lastName: 'Platzer Bartel',
        email: 'elowyn@example.com',
        birthYear: 2015,
        student: true,
        password: 'password',
      };

      const user = await User.create(userParams);
      const wrongPasswordRes = await request(app)
        .post('/login')
        .send({ email: 'elowyn@example.com', password: 'wrong password' })
        .expect(200);
      expect(wrongPasswordRes.body.jwt).toBe(undefined);
      expect(wrongPasswordRes.body.user).toEqual(undefined);
      expect(wrongPasswordRes.body.error).toEqual(['Email or Password is incorrect']);

      const noUserRes = await request(app)
        .post('/login')
        .send({ email: 'wrongEmail@example.com', password: 'password' })
        .expect(200);
      expect(noUserRes.body.jwt).toBe(undefined);
      expect(noUserRes.body.user).toEqual(undefined);
      expect(noUserRes.body.errors).toEqual(['Email or Password is incorrect']);
    });
    ```

#### User find
1. Add the model test:
    ```js
    it('can be found by id', async () => {
      const user = await User.create({
        firstName: 'Elowyn',
        lastName: 'Platzer Bartel',
        email: 'elowyn@example.com',
        birthYear: 2015,
        student: true,
        password: 'password',
      });

      const foundUser = await User.find(user.id);
      expect(foundUser.firstName).toEqual('Elowyn');
      expect(foundUser.lastName).toEqual('Platzer Bartel');
      expect(foundUser.email).toEqual('elowyn@example.com');
      expect(foundUser.birthYear).toEqual(2015);
      expect(foundUser.student).toEqual(true);
    });
    ```

#### User show for a logged in user
1. Add the feature test:
    ```js
    it('can be shown for a logged in user only', async () => {
      const user = await User.create({
        firstName: 'Elowyn',
        lastName: 'Platzer Bartel',
        email: 'elowyn@example.com',
        birthYear: 2015,
        student: true,
        password: 'password',
      });
      serializedUser = await userSerializer(user);
      token = jwt.sign({ user: serializedUser }, process.env.JWT_SECRET);

      const resNotLoggedIn = await request(app)
        .get(`/users/${user.id}`)
        .expect(404);

      const resLoggedIn = await request(app)
        .get(`/users/${user.id}`)
        .set('jwt', token)
        .expect(200);

      const showUser = resLoggedIn.body.user;
      expect(resLoggedIn.jwt).toBe(undefined);
      expect(showUser.id).not.toBe(undefined);
      expect(showUser.firstName).toEqual('Elowyn');
      expect(showUser.lastName).toEqual('Platzer Bartel');
      expect(showUser.email).toEqual('elowyn@example.com');
      expect(showUser.birthYear).toEqual(2015);
      expect(showUser.student).toEqual(true);

      expect(showUser.passwordDigest).toEqual(undefined);
      expect(showUser.createdAt).toEqual(undefined);
      expect(showUser.updatedAt).toEqual(undefined);
    });
    ```

1. Add the route and controller action:
    ```js
    router.get('/:id', usersController.show);
    ```
    ```js
    exports.show = async (req, res, next) => {
      const user = await User.find(req.params.id);
      const serializedUser = await userSerializer(user);
      res.json({ user: serializedUser });
    }
    ```

#### Update show for "no user found with that id"
1. Update the test description to "can be shown with a valid user id for a logged in user only" and add the following request between the two requests of the last test:
    ```js
    const resLoggedInWrongId = await request(app)
      .get(`/users/${user.id+10}`)
      .set('jwt', token)
      .expect(404);
    ```
1. Update users controller show action to:
    ```js
    exports.show = async (req, res, next) => {
      try {
        const user = await User.find(req.params.id);
        const serializedUser = await userSerializer(user);
        res.json({ user: serializedUser });
      } catch (e) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
      }
    }
    ```

#### Feature test for User tries to login with duplicate email
1. Add to end of create user feature test:
    ```js
    const duplicateEmailRes = await request(app)
      .post('/users')
      .send({
        firstName: 'Elowyn',
        lastName: 'Platzer Bartel',
        email: 'elowyn@example.com',
        birthYear: 2015,
        student: true,
        password: 'password',
      })
      .expect(200);

      expect(duplicateEmailRes.body.jwt).toBe(undefined);
      expect(duplicateEmailRes.body.user.id).toBe(undefined);
      expect(duplicateEmailRes.body.user.errors).toEqual(['Email already taken']);
    ```
1. Update the create user action in the controller:
    ```js
    const user = await User.create(req.body);
    if (user.errors) {
      res.json({ user: user });
    } else {
      const serializedUser = await userSerializer(user);
      const token = jwt.sign({ user: serializedUser }, process.env.JWT_SECRET);
      res.json({ jwt: token, user: serializedUser });
    }
    ```

#### Model - User can be updated
1. model test:
    ```js
    it('can be updated', async () => {
      const originalUser = await User.create({
        firstName: 'Elowyn',
        lastName: 'Platzer Bartel',
        email: 'elowyn@example.com',
        birthYear: 2015,
        student: true,
        password: 'password',
      });
      const updatedUser = await User.update({
        id: originalUser.id,
        firstName: 'Freyja',
        lastName: 'Puppy',
        email: 'freyja@example.com',
        birthYear: 2016,
        student: false,
        password: 'puppy password',
      })

      expect(updatedUser.firstName).toBe('Freyja');
      expect(updatedUser.lastName).toBe('Puppy');
      expect(updatedUser.email).toBe('freyja@example.com');
      expect(updatedUser.birthYear).toBe(2016);
      expect(updatedUser.student).toBe(false);
      expect(updatedUser.passwordDigest).not.toBe(originalUser.passwordDigest);
    });
    ```
1. model method:
    ```js
    exports.update = async properties => {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const passwordDigest = bcrypt.hashSync(properties.password, salt);

      const updatedUser = (await query(`UPDATE "users" SET
        "firstName"=($1),
        "lastName"=($2),
        "email"=($3),
        "birthYear"=($4),
        "student"=($5),
        "passwordDigest"=($6) WHERE id=($7) RETURNING *`, [
        properties.firstName,
        properties.lastName,
        properties.email,
        properties.birthYear,
        properties.student,
        passwordDigest,
        properties.id,
      ])).rows[0];

      return updatedUser;
    }
    ```

#### And so on...
