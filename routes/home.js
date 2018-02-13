var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    var Query = Stack.ContentType('menus').Query()
        .includeReference('introduction.order_of_sub_items')
        .includeReference('reference.order_of_sub_items')
        .includeReference('reference.order_of_sub_items.api_details.api_requests_collection.api_request')
        .toJSON()
        .find()
        .spread(function success(result) {
            res.render('pages/home.html', {
                entry: result[0],
            });
        }, function error(error) {
            next(error);
        });
});

module.exports = router;
