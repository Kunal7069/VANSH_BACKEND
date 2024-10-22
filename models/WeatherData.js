const mongoose = require('mongoose');

function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().slice(0, 8); // Extract HH:mm:ss from the time
}
function getCurrentDate(){
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

const weatherDataSchema = new mongoose.Schema({
  city : String,
  date : { type: String, default: getCurrentDate },         
  time : { type: String, default: getCurrentTime },
  temp : Number,
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