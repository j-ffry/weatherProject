//protecting secret info with environment variables
//.gitignore includes .env file to not commit onto public repo
require('dotenv').config();

const express = require("express");
//https exists within node module, does not require additional npm installation
//allows us to make requests to external servers
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
    // || process.env.API_KEY || fetching API key in "secret" .env file
    var query = req.body.cityName;
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + process.env.API_KEY + "&units=imperial";
    https.get(url, function(response){
        console.log(response);

        response.on("data", function(data){
            //parsing through JSON Data into an JS Object || JSON.parse(data)      ||
            // turn JS object into JSON                   || JSON.stringify(object)||
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            console.log(weatherDescription);
            console.log(temp);

            res.write("<h1> The temperature in " + query + " is " + temp + "F</h1>");
            res.write("<p>The weather is currently " + weatherDescription + "</p>");
            res.write("<img src=" + imgURL + ">");
            res.send();
        });
    });
});



// app.get("/", function(req, res){
//     // || process.env.API_KEY || fetching API key in "secret" .env file
//     var query = "Dallas";
//     var url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + process.env.API_KEY + "&units=imperial";
//     https.get(url, function(response){
//         console.log(response);

//         response.on("data", function(data){
//             //parsing through JSON Data into an JS Object || JSON.parse(data)      ||
//             // turn JS object into JSON                   || JSON.stringify(object)||
//             const weatherData = JSON.parse(data);
//             const temp = weatherData.main.temp;
//             const weatherDescription = weatherData.weather[0].description;
//             const icon = weatherData.weather[0].icon;
//             const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

//             console.log(weatherDescription);
//             console.log(temp);

//             res.write("<h1> The temperature in Dallas is " + temp + "F</h1>");
//             res.write("<p>The weather is currently " + weatherDescription + "</p>");
//             res.write("<img src=" + imgURL + ">");
//             res.send();
//         });
//     });
//     // only 1 res.send() per app.get() call.
//     // res.send("<h1>Hello world!</h1>");

// });



app.listen(3000, function(){
    console.log("Server is running on port 3000");
});