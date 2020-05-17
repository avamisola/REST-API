'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

//connect to db
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './fsjstd-restapi.db'
});

//check sql db connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// TODO setup your api routes here

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

//middleware for try/catch blocks
function asyncHandler(cb){
  return async (req, res, next)=>{
      try {
          await cb(req,res, next);
      } catch(err){
          next(err);
      }
  };
}

//user authentication function
const authenticateUser = async (req, res, next) => {
  let message = null;
  const credentials = auth(req);
  if (credentials) {
      const user = await User.findOne({
          where: {
              emailAddress: credentials.name,
          }
      })
      if (user) {
          const authenticated = bcryptjs
              .compareSync(credentials.pass, user.password);

          if (authenticated) {
              req.currentUser = user;
          } else {
              message = `Authentication failure for username: ${user.emailAddress}`
          }
      } else {
          message = `User not found for username: ${credentials.name}`;
      }
  } else {
      message = 'Auth header not found';
  }
  if (message) {
      console.warn(message);

      res.status(401).json({ message: 'Access Denied' });
  } else {
      next()
  }
}
