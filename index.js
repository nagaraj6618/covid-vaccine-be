const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();

const patientRoute = require('./route/patientRoute');
const appointmentRoute = require('./route/appointmentRoute');
const authRoute = require('./route/authRoute');
const vaccineCenter = require('./route/centerRoute');

function dbConnection () {
   mongoose.connect(process.env.MONGODB_URL)
   .then(()=> console.log('DB Connected'))
   .catch((error)=>console.log('DB not connected:',error));
}
dbConnection();

//middlewares 
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}));


//route page;
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/center',vaccineCenter);
app.use('/api/v1/book',appointmentRoute);
app.use('/api/v1/patient',patientRoute);


app.get('/api/v1/',(req,res) => {
   
   res.status(200).json({message:'success',data:'server running'});
});

app.listen(PORT,()=> {
   console.log('Server running..');
})