const express = require('express');
const router = express.Router();
const _ = require('underscore');
const User = require('../models/User');
const config = require('../../config');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

router.get('/setup', function (req, res) {
  res.send('Create user - press: /setup/username');
});

router.get('/setup/:name', async function (req, res) {
  const userName = req.params.name
  // create a sample user
  const user = new User({
    name: userName,
    password: 'password',
    admin: true,
    balance: 0,
    inventories: [],
  });

  try {
    const resultUser = await user.save();

    if (resultUser) {
      console.log('User saved successfully', resultUser);
      res.json({ success: true });
    } else {
      res.json({ success: fasle });
    }
  } catch (err) {
    console.log("Err ", err)
    res.json({ success: false });
  }
});

module.exports = router;
