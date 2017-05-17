const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();


hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// Express middlewear
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });

    // next must be called or all other handlers will never be called.
    next();
});

// Middleware to implement maintenance mode
// app.use((req, res, next) => {
//     // We don't want the 'next' step to execute.
//     res.render('maintenance.hbs');
// });


// This call exposing the '/public directory (static HTML) needs to be 
// called last or it will still be accessible.
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

// handler for http get request
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to the home page'
    });
});

app.get('/about', (req, res) => {
   res.render('about.hbs', {
       pageTitle: 'About Page',
   });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Error handling request'
    });
})

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});