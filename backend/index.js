const express = require('express')
const mongoose = require('mongoose')
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const pinRoute = require("./routes/Pins");
const userRoute = require("./routes/Users")




app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("connected to database succesully")
}).catch((err) => {
    console.log('connection failed');
});


app.use("/api/pins", pinRoute);  
app.use("/api/users", userRoute);

app.listen(5000, () => {
    console.log("backend server is running 5000! ");

})