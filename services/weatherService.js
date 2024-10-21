const dotenv = require('dotenv');
const axios = require('axios');

const API_KEY = process.env.API_KEY;
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';
console.log("API KEY",API_KEY)
async function getWeather(city) {
  try {
    const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    console.log('Request URL:', url); // Log the full request URL
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = {getWeather};