const { getWeather } = require("../services/weatherService");
const WeatherData = require('../models/WeatherData');
const RolledData = require('../models/RolledData'); 
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const app = express();
app.use(cors());
app.use(bodyParser.json());

async function collectWeatherData(city) {
    console.log("CITY",city);
    const weatherData = await getWeather(city);
    const min_temp= weatherData['main']['temp_min']
    const max_temp= weatherData['main']['temp_max']
    const temp = weatherData['main']['temp']
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
      temp,
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

async function SearchRolledData(city){
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  const weatherData = await getWeather(city);
  console.log(city)
  console.log(formattedDate)
  const rolledDataEntry = await RolledData.findOne({ city: city, date: formattedDate });
  console.log("MATCHED",rolledDataEntry);
  return rolledDataEntry
}
async function RolledWeatherData(city){
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
  const day = String(today.getDate()+1).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  const weatherData = await getWeather(city);
  console.log(city)
  console.log(formattedDate)
  const rolledDataEntry = await RolledData.findOne({ city: city, date: formattedDate });
  console.log("MATCHED",rolledDataEntry);
  var updated_temp = ((rolledDataEntry['temp']*rolledDataEntry['count'])+weatherData['main']['temp'])/(rolledDataEntry['count']+1);
  var updated_count=rolledDataEntry['count']+1;
  var updated_dominant_weather= rolledDataEntry['dominant_weather'].get(weatherData['weather'][0]['main'])+1;
  
  console.log("updated_dominant_weather",updated_dominant_weather)

  if(rolledDataEntry['min_temp']>weatherData['main']['temp_min']){
    var updated_min_temp=weatherData['main']['temp_min'];
  }
  else{
    var updated_min_temp=rolledDataEntry['min_temp'];
  }
  if(rolledDataEntry['max_temp']<weatherData['main']['temp_max']){
    var updated_max_temp=weatherData['main']['temp_max'];
  }
  else{
    var updated_max_temp=rolledDataEntry['max_temp'];
  }
  if (rolledDataEntry){
    rolledDataEntry.min_temp = updated_min_temp; // Keep the lowest min_temp
    rolledDataEntry.max_temp = updated_max_temp; // Keep the highest max_temp
    rolledDataEntry.count =updated_count; // Increment the count
    rolledDataEntry.temp = updated_temp;
    const weatherKey = weatherData['weather'][0]['main'];
    if (!rolledDataEntry.dominant_weather || !(rolledDataEntry.dominant_weather instanceof Map)) {
        rolledDataEntry.dominant_weather = new Map();
    }
    rolledDataEntry.dominant_weather.set(weatherKey, updated_dominant_weather);

  }
  await rolledDataEntry.save();
  console.log('Data entry updated:', rolledDataEntry);
} 

async function CreateRolledData(){
  const cities= ['Delhi','Hyderabad','Bangalore','Kolkata','Chennai','Mumbai'];
  for (const city of cities) {
    console.log(city)
    const min_temp=10000
    const max_temp=-10000
    const temp=0
    const count =0 
    const dominant_weather = {'Clear':0,'Clouds':0,'Haze':0,'Rain':0,'Drizzle':0,'Thunderstorm':0,'Snow':0,'Mist':0,'Fog':0,'Smoke':0,'Dust':0,'Sand':0,'Ash':0,'Squall':0,'Tornado':0}
    const newRolledData = new RolledData({
      city,
      min_temp,
      max_temp,
      temp,
      count,
      dominant_weather
    });
    await newRolledData.save();
    console.log("DATA SAVED")
  }
  
} 


router.get('/', async (req, res) => {
    const data = await WeatherData.find()
    res.json({data})
  });

router.get('/start_rolled_data', async (req, res) => {
  CreateRolledData()
  res.status(201).json({message: 'ROLLED DATA STARTED SUCCESFULLY'}) 
});
router.get('/update_rolled_data', async (req, res) => {
  const cities= ['Delhi','Hyderabad','Bangalore','Kolkata','Chennai','Mumbai'];
  for (const city of cities) {
    await collectWeatherData(city)
    await RolledWeatherData(city)
  }
  
  res.send('ROLLED DATA UPDATED SUCCESFULLY');
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

  router.post('/aggregate', async (req, res) => {
    const {city} = req.body;
    const weatherData = await SearchRolledData(city);
    res.status(201).json({weatherData}) 
  });




module.exports = router;
