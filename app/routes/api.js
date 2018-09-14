const express = require('express');
const apiRoutes = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../../config');

// http://localhost:3001/api/authenticate
apiRoutes.post('/authenticate', async function (req, res) {
    console.log(req.body)
   try {
      const user = await User.findOne({
         name: req.body.username
      });

      if (!user) {
         res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {

         // check if password matches
         if (user.password != req.body.password) {
            res.json({ success: false, message: 'Authentication failed. Wrong password.' });
         } else {

            // if user is found and password is right
            // create a token
            var payload = {
               admin: user.admin
            }
            var token = jwt.sign(payload, config.secret, {
               expiresIn: 86400 // expires in 24 hours
            });

            res.json({
               success: true,
               message: 'Enjoy your token!',
               username: user.name,
               token: token
            });
         }
      }
   } catch (err) {
      res.json({ success: false, message: err });
   }
});

// route middleware to authenticate and check token
apiRoutes.use(async function (req, res, next) {

   // check header or url parameters or post parameters for token
   //req.param('token')
   var token = req.body.token || req.headers['x-access-token'];

   // decode token
   if (token) {
      // verifies secret and checks exp
      try {
         const decoded = await jwt.verify(token, config.secret);

         if (!decoded) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });
         } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            next();
         }

      } catch (err) {
         return res.json({ success: false, message: 'Failed to authenticate token.' });
      };
   } else {
      // if there is no token
      // return an error
      return res.status(403).send({
         success: false,
         message: 'No token provided.'
      });
   }
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function (req, res) {
   res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', async function (req, res) {
   const users = await User.find();
   if (users) {
      res.json(users);
   } else {
      res.json({ status: false });
   }
});

apiRoutes.get('/check', function (req, res) {
   res.json(req.decoded);
});

module.exports = apiRoutes;