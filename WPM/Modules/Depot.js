// require WPMServer module to perfome operation on the repository  
var wpmServer = require('WPMServer.js').WPMServer;

function packages(request, response) {
     
    // get the used method  
    var
     method = request.method ,
    // for the POST
     body = request.body ,
    //  get the passed arguments  
     params = request.url ,
    //  result variable  to be returned 
     result  ;
    // switch using method
    switch (method) {
        // list and get Packages
    case "GET":
         // change the name after 
        result  = wpmServer.getPackages(params);
        break;
         
        // create a new objetc         
    case "POST":
    
        result = wpmServer.createPackage(body);
        break;
        // delete a objet 
    case "DELETE":
         result = wpmServer.removePackage( name , version);
         break ;
    
        // update a package 
    case "PUT":
        break;


   // case default : "" 

    }


    // return 
    response.contentType = 'application/json';
    response.statusCode = '200';
    return result;
}

