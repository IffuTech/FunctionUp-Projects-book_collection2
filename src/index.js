const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const route = require('./routes/route.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connectToDB = () => {
    mongoose
        .connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Mongodb connected....");
         
        })
        .catch((err) => console.log(err.message));

    mongoose.connection.on("connected", () => {
        console.log("Mongoose connected to db...");
    });

    mongoose.connection.on("error", (err) => {
        console.log(err.message);
    });

    mongoose.connection.on("disconnected", () => {
        console.log("Mongoose connection is disconnected...");
    });

    process.on("SIGINT", () => {
        mongoose.connection.close(() => {
            console.log(
                "Mongoose connection is disconnected due to app termination..."
            );
            process.exit(0);
        });
    });
};

connectToDB(); // Call the function to connect to the database

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000));
});
