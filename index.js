const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();

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


app.get('/api/v1/',(req,res) => {
   res.status(200).json({message:'success',data:'server running'});
});

app.listen(PORT,()=> {
   console.log('Server running..');
})