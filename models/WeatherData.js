const mongoose = require('mongoose');

function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().slice(0, 8); // Extract HH:mm:ss from the time
}

const weatherDataSchema = new mongoose.Schema({
  city : String,
  date : { type: Date, default: Date.now },         
  time : { type: String, default: getCurrentTime },
  min_temp : Number,
  max_temp: Number,
  pressure : Number,
  sea_level : Number ,
  grnd_level : Number,
  wind_speed : Number,
  wind_degree : Number,
  cloud_count : Number,
  humidity: Number
});

module.exports = mongoose.model('WeatherData', weatherDataSchema);