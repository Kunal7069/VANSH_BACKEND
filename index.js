const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const WeatherRoutes = require('./routes/WeatherRoutes');

const app = express();
app.use(
  cors({
    origin: "*", // Your frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
app.get('/', (req, res) => {
  res.send('Backend is activated');
});
app.use('/api', WeatherRoutes);
async function periodicAPICall() {
  try {
      // Example API call, modify as needed
      const response = await fetch('https://vansh-weather-app.onrender.com/'); // Replace with your API
      const data = await response.json();
      console.log('Periodic API call data:', );
  } catch (error) {
      console.error('Error during periodic API call:', error);
  }
}
setInterval(periodicAPICall, 10000); 

// async function periodicAPICall2() {
//   try {
//       // Example API call, modify as needed
//       const response = await fetch('http://127.0.0.1:5000/api/update_rolled_data'); // Replace with your API
//       const data = await response.json();
//       console.log('Periodic API call data:', data);
//   } catch (error) {
//       console.error('Error during periodic API call:', error);
//   }
// }
// setInterval(periodicAPICall2, 5000); 

// async function periodicAPICall3() {
//   try {
//       // Example API call, modify as needed
//       const response = await fetch('https://vansh-weather-app.onrender.com/api/start_rolled_data'); // Replace with your API
//       const data = await response.json();
//       console.log('Periodic API call data 24 hrs:', data);
//   } catch (error) {
//       console.error('Error during periodic API call:', error);
//   }
// }
// setInterval(periodicAPICall3, 86400000); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});