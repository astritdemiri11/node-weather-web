const pathLib = require('path');

const expressLib = require('express');
const hbsLib = require('hbs');

const geocodeAsync = require('./utils/geocode');
const forecastAsync = require('./utils/forecast');

const app = expressLib();
const port = process.env.PORT || 3000;

const publicDir = pathLib.join(__dirname, '../public');

app.use(expressLib.static(publicDir));
app.set('view engine', 'hbs');

// const viewsDir = path.join(__dirname, '../views');
// app.set('views', viewsDir);

const partialsDir = pathLib.join(__dirname, '../views/partials');
hbsLib.registerPartials(partialsDir);

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Astrit Demiri'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Astrit Demiri'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Astrit Demiri',
        message: 'Some random message'
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Astrit Demiri',
        message: 'Help article not found'
    });
});


app.get('/api/weather', (req, res) => {
    const address = req.query.address;

    if(!address) {
        return res.send({
            error: 'You must provide an address'
        });
    }

    geocodeAsync(address, (error, { latitude = 0, longitude = 0 } = { }) => {
        if(error) {
            return res.send({ error });
        }

        forecastAsync(latitude, longitude, (error, current) => {
            if(error) {
                return res.send({ error });
            }

            const location = current.location;
            const forecast = `Weather is ${current.type}, ${current.temperature} degrees`;

            return res.send({ location, forecast, address });
        });
    });
});

app.get('/api/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        });
    }

    res.send({
        products: []
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Astrit Demiri',
        message: 'Page not found'
    });
});


app.listen(port, () => {
    console.log('Server is up on port ' + port);
});