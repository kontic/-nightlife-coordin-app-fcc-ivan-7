var express = require('express')
  , Nightlife = require('../models/nightlife')
  , router = express.Router();



router.post('/', function(req, res){
  Nightlife.findOne({username: req.user.name, barid: req.body.business}, function(err, nightlife_item){
    if (err) throw err;
    if (!nightlife_item){
      //add new nightlife item
      var nightlife = new Nightlife({
        username: req.user.name,
        barid: req.body.business
      });
      nightlife.save().then(function(){
        Nightlife.aggregate(
        {$group: {_id: '$barid', numberOfUsers: {$sum: 1}}},function(err, barOccupation){
          if (err) throw err;
          for(var i = 0; i < barOccupation.length; i++){
            if(req.body.business === barOccupation[i]._id){
              res.setHeader( 'Content-Type', 'application/json' );
              res.status(200);
              res.send({num_going: barOccupation[i].numberOfUsers});
              break;
            }
          }
        });
      });
    }else{
      //remove nightlife item
      nightlife_item.remove().then(function(){
        Nightlife.aggregate(
        {$group: {_id: '$barid', numberOfUsers: {$sum: 1}}},function(err, barOccupation){
          if (err) throw err;
          var test = true;
          for(var i = 0; i < barOccupation.length; i++){
            if(req.body.business === barOccupation[i]._id){
              test = false;
              res.setHeader( 'Content-Type', 'application/json' );
              res.status(200);
              res.send({num_going: barOccupation[i].numberOfUsers});
              break;
            }
          }
          if(test){
            res.setHeader( 'Content-Type', 'application/json' );
            res.status(200);
            res.send({num_going: 0});
          }
        });
      });
    }
  });
});

module.exports = router;