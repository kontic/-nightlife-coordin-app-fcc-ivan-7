var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var sess = req.session;
  if(!sess.search_location){
    res.render('index', { 
      isAuthenticated: req.isAuthenticated(),
      user: req.user,
      reload: false   //to prevent some errors when app just start
    });
  }else{
    res.render('index', { 
      isAuthenticated: req.isAuthenticated(),
      user: req.user,
      search_location: sess.search_location,
      reload: true
    });
  }
  
  
  
  
});

module.exports = router;




