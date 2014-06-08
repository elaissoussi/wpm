
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var button4 = {};	// @button
	var button2 = {};	// @button
	var button1 = {};	// @button
// @endregion// @endlock

// eventHandlers// @lock

	button4.click = function button4_click (event)// @startlock
	{// @endlock
		
		
		var p = document.getElementById("packages");
		removePackage("test1","test1", function(data){
		      var resultObj = (data['success'])?data['success']:data['error'] ;
               p.innerHTML = resultObj; 
		
		});



	};// @lock

	button2.click = function button2_click (event)// @startlock
	{// @endlock
		
		var p = document.getElementById("packages");
		createPackage("NamePackageRest","versionPackageRest", function(data){
		      var resultObj = (data['success'])?data['success']:data['error'] ;
               p.innerHTML = resultObj; 
		
		});
	};// @lock


//  WPMClient 


	button1.click = function button1_click (event)// @startlock
	{// @endlock
        var  p = document.getElementById('packages');
		//getPackage("testname","testVersion",function(data){
		  		getPackage("mealissou","0.0.1",function(data){       
		          var resultObj = (data['success'])?data['success']:data['error'] ;
                   p.innerHTML = resultObj; 
		});

	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button4", "click", button4.click, "WAF");
	WAF.addListener("button2", "click", button2.click, "WAF");
	WAF.addListener("button1", "click", button1.click, "WAF");
// @endregion
};// @endlock



//  get package infos 
function getPackage(name, version, callback) {

    // create the xhr object without a proxy handler 
    var xhr = new XMLHttpRequest();
    // open the connexion with a www... in sychronos way , "false" with PUT Method
    // we need the name and optionnaly the version of the package 
    //    the host/wpmdepot/depottype/packagename?packagversion = x ;
    
    // send the data to the server 
    xhr.open("GET","/wpm/packages/"+name+"/"+version);
    xhr.send();
    //xhr.send(JSON.stringify({name : name ,version : version }));
    // once the exchange 
    xhr.onreadystatechange = function() {
        //  we verify the state of the request is ok = 4 and its statue ok=200
        if ((this.readyState == 4) && (this.status == 200)) {
            //we verify the type of the content  is JSON      
            if (this.getResponseHeader("Content-Type").indexOf("application/json") > -1 ) {
                
                resultObj = this.responseText;
                if (callback) {
                    callback.call(this, {
                        success: resultObj

                    });
                }
            }
            else  {
               if(callback){
                    callback.call(this, {
                        error : "invalid package name or version"
                    })
               }
               
            }
        }
    };


}


//-----------------------------------create Package --------------------------------------------------


function createPackage(name,version,callback){
  // create the xhr object without a proxy handler 
    var xhr = new XMLHttpRequest();
   // create function on the server 
    xhr.open("POST","/wpm/packages/");
    // set the request Header to JSON
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    // send the data to the server 
    xhr.send(JSON.stringify({name: name , version: version}));
    // event  handler of the xhr change  state 
   
    xhr.onreadystatechange = function() {
        //  we verify the state of the request is ok = 4 and its statue ok=200
        if ((this.readyState == 4) && (this.status == 200)) {
            //we verify the type of the content  is JSON object          	
            var resultObj = this.responseText ;
                // all is ok 
                if (callback) {
                    callback.call(this, {
                        success: resultObj

                    });
                }
            } //  the opertaion is not performed so !!!
            else  {
               if(callback){
                    callback.call(this, {
                        error : "invalid operation !! the content-type is not a JSON object"
                    })
               }
               
            }
    };

}

// ------------------------- remove Package --------------------
/*
* Public 
* remove package using it name and or sepcifying iits version
*/

function  removePackage(name , version , callback){
	
	var xhr = new XMLHttpRequest();
    xhr.open("DELETE","/wpm/packages/"+name+"/"+version+"");
    xhr.send();
    xhr.onreadystatechange =  function(){
        if((this.readyState == 4)  &&  (this.status == 200)){
         var resultObj = this.responseText ;
         
         if(callback){
         callback.call(this , { success : resultObj})
            }
        
           }
        else{
        	
        if(callback){
              callback.call(this, {error : "invalid operation !!!!"})
                   }
        
        }
    };

}

//-----------------------Publish ---------------------------------------------------------

