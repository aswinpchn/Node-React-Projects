let express = require('express');
let router = express.Router();

let database = require('../database/mongodb');
let { client } = require('../database/mongodb');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({ message: 'respond with a resource', error: null});
});

/* POST create user for fitness gamification */
router.post('/createuser', async function(req, res, next) {
  let fullName = req.body.fullName;
  let email = req.body.email;
  let phone = req.body.phone;
  let password = req.body.password;
  let data = { fullName: fullName, phone: phone, email: email, password: password, creationTime: new Date()};
  
  try {
    let result = await client.db('gamification').collection('user').findOne({email: email});
    if (result) {
      throw Error('User already exists');
    } else {
      result = await client.db('gamification').collection('user').insertOne(data);
      res.status(200).send();
    }
  } catch (e) {
    if (e.message == 'User already exists') {
      res.status(500).send(e.message);
    } else {
      res.status(500).send(e);
    }
  }
  
});

/* GET get user details for login */
router.post('/login', async function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  try {
    let result = await client.db('gamification').collection('user').findOne({email: email});
    console.log(result);
    if (!result) {
      throw Error('User with email doesnt exist');
    } else {
      if (result.password == password) {
        res.status(200).send(result);
      } else {
        throw Error('Wrong password');
      }
    }
  } catch (e) {
    if (e.message == 'User with email doesnt exist' || e.message == 'Wrong password') {
      res.status(500).send(e.message);
    }else {
      res.status(500).send(e);
    }
  }
});

/* POST update user for fitness gamification */
router.post('/updateuser', function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let data1 = { email: email };
  let data2 = { email: email, password: password };
  database.updateOneData(data1, data2, 'user', function (err, details) {
    if (err){
      res.send({
        message: err.stack,
        error: err
      });
    } else {
      res.send({
        message: "user updated successfully",
        error: null
      });
    }
  });
});

/* DELETE update user for fitness gamification */
router.delete('/deleteuser', function(req, res, next) {
  let email = req.body.email;
  let query = { email: email };
  database.deleteOneData(query, 'user', function (err, details) {
    if (err){
      res.send({
        message: err.stack,
        error: err
      });
    } else {
      res.send({
        message: "user deleted successfully",
        error: null
      });
    }
  });
});

module.exports = router;
