var express = require('express')
  , Nightlife = require('../models/nightlife')
  , request = require('request')
  , router = express.Router();



router.get('/', function(req, res){

  var sess = req.session;
  sess.search_location = req.query.search_location;
  
  var test = -1;

  request.get({
    url: 'https://api.yelp.com/v3/businesses/search?location=' + req.query.search_location + '&categories=nightlife',
    headers: {
      Authorization: 'Bearer ' + process.env.YELP_KEY
    }
  }
  , function(err, resp, body){
      if (err) throw err;
      
      var search_data = JSON.parse(body);

      for(var i = 0; i < search_data.businesses.length; i++){
        
        (function(id, index){
          request.get({
            url: 'https://api.yelp.com/v3/businesses/' + encodeURIComponent(id) + '/reviews',
            headers: {
              Authorization: 'Bearer ' + process.env.YELP_KEY
            }
          }
          , function(err, resp, body){
              if (err) throw err;
              var search_rev_data = JSON.parse(body);
              
              search_data.businesses[index].one_review = search_rev_data.reviews[0].text;

              test++;
              if(test === search_data.businesses.length - 1){
                
                Nightlife.aggregate(
                {$group: {_id: '$barid', numberOfUsers: {$sum: 1}}},function(err, barOccupation){
                  if (err) throw err;
                  if(req.isAuthenticated()){
                    for(var i = 0; i < search_data.businesses.length; i++){
                      search_data.businesses[i].num_going = 0;
                      for(var j = 0; j < barOccupation.length; j++){
                        if(search_data.businesses[i].id === barOccupation[j]._id){
                          search_data.businesses[i].num_going = barOccupation[j].numberOfUsers;
                          break;
                        }
                      }
                    }
                  }

                  res.setHeader( 'Content-Type', 'application/json' );
                  res.status(200);
                  res.send(JSON.stringify(search_data.businesses, null, '  '));
                });
              }
            }
          );
        })(search_data.businesses[i].id, i);
      }
    }
  );

  
});


module.exports = router;