
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var button5 = {};	// @button
// @endregion// @endlock

// eventHandlers// @lock

	button5.click = function button5_click (event)// @startlock
	{// @endlock
		
    publishPackage();
    
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button5", "click", button5.click, "WAF");
// @endregion
};// @endlock



function publishPackage(callback){
   //1-add the package in dataStore
   //1-1 read the package.json
    
    var path  ="C:\\WorkSpaceWakanda\\Depot\\init";
    var pName ="p0"; 
    PS = "\\";
    var  pjson 	 = File(path+PS+pName+PS+"package.json");
	
	if(pjson.exists)  {
		
	var  stream  = TextStream(pjson ,"Read")
	var jsondata = "" ;
	
	do {
		
	  jsondata  =  jsondata + stream.read();
	   
	  }while( stream.end() == false)
 		
 	stream.close(); 
 	 
     }
   
     
   // send the package to the datastore
   // create the xhr object without a proxy handler 
    var xhr = new XMLHttpRequest();
   // create function on the server 
    xhr.open("POST","http://http://127.0.0.1:8081//wpm/packages/");
    // set the request Header to JSON
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //  get the path and the package name  
    
    // infos infos about the package  in JSON Format
    // send the data from the package.json the the server
    
    
    xhr.send(jsondata);
    //xhr.send(JSON.stringify());
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
                        error : "error creating a new package"
                    })
               }
               
            }
    };

}
