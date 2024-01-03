const express = require('express'); // to create a webserver
const axios = require('axios'); // fetch weather data from an OpenWeather API
const cors = require('cors'); // middleware to handle requests from different domains
require('dotenv').config(); // loading environment variables

const app = express(); // instance of express app
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // parse incoming json requests

// POST endpoint to get weather
app.post('/getWeather', async (req, res) => {
    try {
        const { cities } = req.body;

        if (!cities || !Array.isArray(cities)) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        const weatherResults = await getWeatherData(cities);

        res.json({ weather: weatherResults });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to fetch real-time weather data
async function getWeatherData(cities) {
    const apiKey = `${process.env.API_KEY}`;
    const weatherResults = {};

    for (const city of cities) {
        try {
            const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
            const temperature = response.data.main.temp;
            const temperatureInCelsius = Math.round(temperature - 273.15);
            weatherResults[city] = `${temperatureInCelsius}C`;
        } catch (error) {
            console.error(`Error fetching weather for ${city}: ${error.message}`);
            weatherResults[city] = 'N/A';
        }
    }

    return weatherResults;
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
