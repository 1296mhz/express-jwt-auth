const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mongoose    = require('mongoose');

const config = require('./config');
const User   = require('./app/models/User');

const indexRouter = require('./app/routes/index');
const apiRoutes = require('./app/routes/api');

var port = process.env.PORT || 3001;

mongoose.connect(config.database, { useNewUrlParser: true }); // connect to database
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.use('/', indexRouter);
app.use('/api', apiRoutes);

app.listen(port);
console.log('Magic happens at http://localhost:' + port);

module.exports = app;