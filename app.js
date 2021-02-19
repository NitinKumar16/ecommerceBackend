require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//My Routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order")


//DB connection
mongoose.connect(process.env.DATABASE, 
{
    useNewUrlParser: true, 
    useUnifiedTopology:true, 
    useCreateIndex:true
}).then(()=>{
    console.log("DB CONNECTED");  
}).catch(()=>{
    console.log("OOPss Database has some error");
});

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


//My Routes
app.use("/api" ,authRoutes);
app.use("/api" ,userRoutes);
app.use("/api" ,categoryRoutes);
app.use("/api" ,productRoutes);
app.use("/api" ,orderRoutes);

//Port
const port =process.env.PORT || 3000;

//Starting a server
app.listen(port, ()=>{
    console.log(`The app is running on port ${port}`);
});