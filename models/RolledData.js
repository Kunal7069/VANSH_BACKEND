const mongoose = require('mongoose');


function getCurrentDate(){
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }
const rolledDataSchema = new mongoose.Schema({
  city : String,
  date : { type: String, default: getCurrentDate },         
  min_temp : Number,
  max_temp: Number,
  temp : Number,
  count: Number,
  dominant_weather : {
    type: Map,  
    of: Number
  }
});

module.exports = mongoose.model('RolledData', rolledDataSchema);