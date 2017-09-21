# README

### set it up

1. `$ yarn install`
1. `$ nodemon start`
    * `$yarn global add nodemon` if you don't have it... this will restart your server on *most* changes

### how did this get made?

1. Create basic app
  1. `$ express exp-starter-app` and cd into the created directory
  1. `$ yarn install`
  1. `$ git init`
  1. `$ echo node_modules/ >> .gitignore`
  1. `$ touch README.md` and start taking amazing notes
1. Remove all code not needed for API
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
1. Testing is the best-thing
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
