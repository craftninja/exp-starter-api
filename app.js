const express = require('express');
const swaggerTools = require('swagger-tools');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const swaggerSpec = require(path.resolve(__dirname, 'spec', 'spec.json'));

if (!swaggerSpec) {
  throw new Error('No swagger spec was found under ./spec/spec.json!');
}

const index = require('./routes/index');
const login = require('./routes/login');
const users = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', index);
app.use('/login', login);
app.use('/users', users);

// app.use(function(req, res, next) {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});

swaggerTools.initializeMiddleware(swaggerSpec, middleware => {
  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerValidator({ validateResponse: true }));
  app.use(middleware.swaggerRouter({
    controllers: path.resolve(__dirname, 'routes'),
    useStubs: false
  }));
  app.use(middleware.swaggerUi());
});

module.exports = app;
