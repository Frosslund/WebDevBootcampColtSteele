var request = require("request");

request("http://dataservice.accuweather.com/translations/v1/languages?apikey=sweden", function(error, response, body){
   if(error){
       console.log("Something went wrong.");
       console.log(error);
   } else {
       if(response.statusCode == 200){
           console.log(body);
       }
   }
});