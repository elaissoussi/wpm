/*
test operations on  dataStore 

-getAllPackages 
-getPackage 

-
NB : 
the method use it os the Post
we send the data in string Format : JSON.stringify
then we parse it to JSON by using  : JSON.parse 

*/  
/*		

   var xhr=new XMLHttpRequest(); // create the xhr object
   var resultObj ;
   xhr.onreadystatechange = function ()
     {
      if (xhr.readyState == 4 && xhr.status == 200) { // server answered
     
     //  xhr.setRequestHeader( "Content-Type", "application/json" );
     resultObj = this.responseText ;
     var p = document.getElementById('packages');
     p.innerHTML = resultObj; 
         
    }
}
xhr.open('GET','/wpm/getPackage?name=jQuery',true); //call the testIP handler
xhr.send(); //Send the XHR

*/
/*
var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
xmlhttp.open("POST", "/json-handler");
xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
xmlhttp.send(JSON.stringify({name:"John Rambo", time:"2pm"}));

*/


// GET data from the client side using git methode
    // we shud control if the version is given or not 
//    var parametres = request.urlQuery;
//    var params = parametres.match(/[=]\w+/g);
//    var length = params.length;

//    for (var i = 0; i < length; i++) {
//        var p = params[i];
//        params[i] = p.substring(1);

//    }
//    var name = params[0];
//    var version = params[1];



//var   data = ds.Package.getAllPackages();
//var s = JSON.stringify(data.maintainers);
//var ss = JSON.parse(s);
//ss ;
/*var  maintainers = data.maintainers.query("name == :1","memo")  ;
maintainers ; */   


// manage dependecies 
var  bootstrap = ds.Package.query("name == bootstrap").first() ;
var  jquery    = ds.Package.query("name == jQuery").first();
//bootstrap.dependencies= jquery ;
//bootstrap.save();
//bootstrap  ;
//bootstrap.dependencies
