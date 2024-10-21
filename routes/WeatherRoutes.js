const { getWeather } = require("../services/weatherService");
const WeatherData = require('../models/WeatherData'); 
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const app = express();
app.use(cors());
app.use(bodyParser.json());

async function collectWeatherData(city) {
   
    const weatherData = await getWeather(city);
    console.log("DATA",weatherData)
    const min_temp= weatherData['main']['temp_min']
    const max_temp= weatherData['main']['temp_max']
    const pressure = weatherData['main']['pressure']
    const sea_level = weatherData['main']['sea_level']
    const grnd_level= weatherData['main']['grnd_level']
    const wind_speed = weatherData['wind']['speed']
    const wind_degree = weatherData['wind']['deg']
    const cloud_count = weatherData['clouds']['all']
    const humidity = weatherData['main']['humidity']
  

    const newWeatherData = new WeatherData({
      city,
      min_temp,
      max_temp,
      pressure,
      sea_level,
      grnd_level,
      wind_speed,
      wind_degree,
      cloud_count,
      humidity
    });

    await newWeatherData.save();
    console.log("DATA SAVED")
    
}


router.get('/', async (req, res) => {
    const data = await WeatherData.find()
    res.json({data})
  });

router.post('/save', (req, res) => {
    const {city} = req.body;
    collectWeatherData(city);
    res.status(201).json({message: 'WEATHER DATA SAVED SUCCESFULLY'}) 
  });
  
router.post('/live_search', async (req, res) => {
    const {city} = req.body;
    const weatherData = await getWeather(city);
    res.status(201).json({weatherData}) 
  });



module.exports = router;
