'use strict';
const debug = require('debug');
const express = require('express');
const http = require('http');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require("mongoose");
const autoIncrement = require('mongoose-auto-increment');
const cors = require('cors');

const configJson = fs.readFileSync('./config.json');
const config = JSON.parse(configJson);

const routes = require('./routes/index');
const GifRtr = require('./routes/gifRtr');
const CategoryRtr = require('./routes/categoryRtr');

const app = express();

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* For urls:
- Get	    - return all	giphys -> ( ''/gyphys)
- Get	    - return the	giphy	by	categoryId -> ( ''/gyphys/categories/:id)
- Get	    - return all	categories -> ( ''/categories)
- Post	    - create	a new	giphy -> ( ''/gyphys)
- Post	    - create a new	category -> ( ''/categories)
- Put       - update	a	category - ( ''/categories/:id)
- Delete	- delete	a	giphys	by	ID. -> ( ''/categories/:id) */

app.use('/', routes);
app.use('/gyphys', GifRtr);
app.use('/categories', CategoryRtr);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler - print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler - no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Mongodb Connect
mongoose.Promise = global.Promise;
mongoose.connect(config.serverInfo.mongodburl)
    .then(() => {
        console.log(`Successfully connected to MongoDB @ ${config.serverInfo.mongodburl}`);
    }).catch(err => {
        console.log('Could not connect to the database. Exiting now...');
        process.exit();
    });

// Server Start
const server = http.Server(app);
server.listen(config.serverInfo.port, function(error, res) {
    if (error) {
        console.log(error.message);
        return;
    }
    console.log(`Server Running @ localhost:${config.serverInfo.port}`);
});