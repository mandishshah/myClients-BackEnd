var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var cors = require('cors')

// configure app
app.use(morgan('dev')); // log requests to the console
app.use(cors());

// configure body parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/myClients');
var Client = require('./app/models/client');

var router = express.Router();

// Middleware to use for all requests
router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
});

// Test Route
router.get('/', function(req, res) {
  res.json({
    message: 'hooray! welcome to our api!'
  });
});

router.route('/clients')
  .post(function(req, res) {
    var client = new Client();
    client.firstName = req.body.firstName;
    client.lastName = req.body.lastName;
    client.email = req.body.email;

    client.save(function(err) {
      if (err)
        res.send(err);
      res.json({
        message: 'Client created!'
      });
    });
  })
  .get(function(req, res) {
    Client.find(function(err, clients) {
      if (err)
        res.send(err);

      res.json(clients);
    });
  });

router.route('/clients/:client_id')
  .get(function(req, res) {
    Client.findById(req.params.client_id, function(err, client) {
      if (err)
        res.send(err);
      res.json(client);
    });
  })
  .put(function(req, res) {
    Client.findById(req.params.client_id, function(err, client) {

      if (err)
        res.send(err);
      client.firstName = req.body.firstName;
      client.lastName = req.body.lastName;
      client.email = req.body.email;

      client.save(function(err) {
        if (err)
          res.send(err);

        res.json({
          message: 'Client updated!'
        });
      });

    });
  })
  .delete(function(req, res) {
    Client.remove({
      _id: req.params.client_id
    }, function(err, client) {
      if (err)
        res.send(err);

      res.json({
        message: 'Client Successfully deleted'
      });
    });
  });


app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);
