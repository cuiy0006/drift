var express = require('express');
var router = express.Router();

let bottle = require('../models/bottle');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/throw', function(req, res, next){
  let body = req.body;
  let owner = body.owner;
  let type = body.type;
  let content = body.content;

  if(!owner || !type || !content){
    return res.json({code: 0, msg: 'information not complete...'});
  }

  if(['male', 'female'].indexOf(type) === -1){
    return res.json({code: 0, msg: 'type error...'});
  }

  bottle.throw(body, function(result){
    res.json(result);
  });
});

router.get('/pick', function(req, res, next){
  let user = req.query.user;
  let type = req.query.type;

  console.log(user, type);

  if(!user || !type){
    return res.json({code: 0, msg: 'information not complete...'});
  }

  if(['male', 'female'].indexOf(type) === -1){
    return res.json({code: 0, msg: 'type error...'});
  }

  bottle.pick(req.query, function(result){
    res.json(result);
  });
});

module.exports = router;
