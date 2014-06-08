/**
WPM Specs : 
1.	lister les packages disponibles sur le dépôt : catalog : getAllPackages.
2.	chercher  un seul package avec ces dépendences : search nomPachage@version : getPackage
3.	Télécharger et installer un paquet et ses dépendances. install nomPackaage : downLoad
4.	Désinstaller un package : remove nomPackage : removePackage
5.	Lister   tous les paquets installés. list : getAllInstaledPackages 
6.	Mettre à jour le plus récent catalogue de paquet. update nomPackaage 
7.	Créer et initialiser  un package. create nomPackage : createPackage
8.	Publier son package publish  nomPackage.    
9.	mettre  à jour au dépôt local : upgrade.

*/
//--------------------------------------- Global Variable -----------------------------------------
  

var 
    git = require('GIT.js').GIT ,
    util = require('Utilities.js').Utilities ,
 	gb = util.gitGlobalVariables(),
 	PS = gb['PS'] ; 	
  
//--------------  Expose the module ------------------------------------------------------------
exports.clientWPM = (function() {
	   
    //  expose the public methods 
    return {
    	
       
		//--------- WPM client API ---------
		
		//create a package.json main.js .git
        create   : git.init,	
		// get all packages 
		catalog  : getAllPackages,
		// get a package by name or version 
		search   :  getPackage,
		//install
		install  : installPackage,
		//removePackage
		uninstall: removePackage,
		//update
		update   : updatePackage,
		// publish
        publish  : publishPackage,
        //upgrade
        upgrade  : upgradePackages
    }
})();






//-------------------------- --CATALOG -----------------------------------------------------------------

function getAllPackages(callback) {

    var 
    	xhr = new XMLHttpRequest() , resultObj ;
        xhr.open("GET","http://127.0.0.1:8081/wpm/packages/");
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
           
        } else  {
               if(callback){
                    callback.call(this, {
                        error : "error in the catalog command"
                    })
               }
               
            }
    };
  xhr.send();

}

//--------------------------------------search name@version-------------------------



function getPackage(name, version, callback) {

  	var 
  		xhr = new XMLHttpRequest() , resultObj ;
        xhr.open("GET","http://127.0.0.1:8081/wpm/packages/"+name+"/"+version);
    	//xhr.send();
    	xhr.onreadystatechange = function() {
        //  we verify the state of the request is ok = 4 and its statue ok=200
        if ((this.readyState == 4) && (this.status == 200)) {
            //we verify the type of the content  is JSON      
            //if (this.getResponseHeader("Content-Type").indexOf("application/json") > -1 ) {
                
                resultObj = this.responseText;
                if (callback) {
                    callback.call(this, {
                        success: resultObj

                    });
                }
            //}
            
        }
        else  {
             
             if(callback){
                    callback.call(this, {
                        error : "invalid package name or version"
                    })
               }
               
            }
    };
    
    xhr.send();
}


//--------------------------------------------Publish Package-----------------------------------------------------------
/*

Private function 
read the credentail of user and append it to the data that will be send

*/
function readCredentials(login, password, packagejson) {

    var
    len = packagejson.length,
    s2 = packagejson.substring(0, len - 1);
    // create a author object
    var author = ',"author" : { "login" :"' + login + '"  , "password" :"' + password + '"  }}';
    // add the author to the package.json
    s2 = s2 + author;
    // return package.json + credentials  
    return s2;
}



/* 
Private function
read the packag.json from the package
*/ 
function getPackageJSON(path, pName) {
    var pjson = File(path + PS + pName + PS + "package.json");
    // read the package.json
    if (pjson.exists) {
        var stream = TextStream(pjson, "Read")
        var jsondata = "";
        // read the package.json
        do {
            jsondata = jsondata + stream.read();
        } while (stream.end() == false)

        stream.close();
    }
    // read the credentials of user a and add it to the package.json
    return jsondata;
}



/* 
Private function
send the package to the datastore metadata
*/ 

function sendPackageJSON(path, packageName, login, password,callback) {

    var packagejson = getPackageJSON(path, packageName);
    var jsondata    = readCredentials(login, password, packagejson);//todo: security check
    // send the package to the datastore
    // create the xhr object without a proxy handler 
    var xhr = new XMLHttpRequest();
    // open the connexion with the  server http://@ip:port/pattern/ 
    xhr.open("POST", "http://127.0.0.1:8081/wpm/packages/");
    // set the request Header to JSON
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(jsondata);
    // event  handler of the xhr change  state 
    xhr.onreadystatechange = function() {
        //  we verify the state of the request is ok = 4 and its statue ok=200
        if ((this.readyState == 4) && (this.status == 200)) {
            //we verify the type of the content  is JSON object 
            // handle the error form  by reading the server response          	
            var resultObj = this.responseText;
            // all is ok 
            if (callback) {
                callback.call(this, {
                    success: resultObj

                });
            }
        } //  the opertaion is not performed so !!!
        else {
            if (callback) {
                callback.call(this, {
                    error: "error in when sending the package metadata"
                })
            }

        }
    };
    }


// push the package to the depot   
function pushPackage(path, packageName, login, password , callback) {

       var success ="" , error="" ;
       var path = path + PS + packageName ;
       
       git.add(path,'', 
       function(result) {
       success += (result['success'])?result['success'] + "\n":"" ; 
       error += (result['error'])?result['error']  + "\n":"";
       }
        );
      //var commit = 'git commit -m "Initial Commit "';
       git.commit(path," Initial Commit", 
       function(result) {
	   success += (result['success'])?result['success']+ "\n" :"" ; 
       error += (result['error'])?result['error'] + "\n":"";       	
       	}
       );

      // var push = 'git push  origin master';
       git.push(path,'http://' + login + ':' + password + '@10.0.0.226/' + packageName + '.git', 'master' , 
       function(result) {
       	success += (result['success'])?result['success']:"" ; 
        error += (result['error'])?result['error']:"";
       	}
       );
       
       callback.call(this, {
                            error   : error ,
                            success : success
                        });
                       
}

 
/*
Public function 
publish the package to  central repository

*/

function publishPackage(path, packageName, login, password , callback) {
	var success = "" , error = "";
       
    // send the package  
     sendPackageJSON(path, packageName, login, password ,
       function(result) {
       success += (result['success'])?result['success']+ "\n" :"" ; 
       error += (result['error'])?result['error'] + "\n":"";
       }
      ) ;
      
    // publish the package
     pushPackage(path, packageName, login, password ,
       function(result) {
       success += (result['success'])?result['success']:"" ; 
       error += (result['error'])?result['error']:"";
       }
     );
     
     callback.call(this, {
                            error : error ,
                            success : success
                        }) ;
                        
}


// ------------------------- remove Package --------------------
/*
* Public 
* remove package using it name and or sepcifying iits version
*/

function  removePackage(name , version , callback){
	
	var xhr = new XMLHttpRequest();
    xhr.open("DELETE","http://127.0.0.1:8081/wpm/packages/"+name+"/"+version+"");
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


//------------------------------- install nomPackage  --------------------------------------------
/*

Reflex about managing install function 

install  packageName 

-->  name of tha package 
     --> test if the package  
     --> conflict in dependecies  :  create cycle or we have aready in different version  
-->  name of the author of the package
     --> send a request and get the response to the datastore to get the authorName of the package 
--> clone the package from the central repositories in spécial repositories 
     --> create a folder name wpm_dependencies 
 
 install 

--> go to the dependencies object in package.json 
--> foreach install packageName 

*/

/*
Private function 
Allow geting  the name of the author 

we suppose that the path contain the name of the packageName 

*/

function installPackage( packageName , version , path ){ 
	
	//----------------------variables------------------------------
	var  pack , author ,error= "" , success = "", author  ;
     
	  getPackage(packageName, version, 
	 		 function(result) {
	  					 pack = result['success'] ; 
      					 error += (result['error'])?result['error'] + "\n":"";
							  });
   // get the package.json from the datstore 	
	if( pack ){
				pack = JSON.parse(pack);	
	// verify and create wpm_dependencecies folder 
    			var folder = Folder(path + PS + 'wpm_dependancies');
     
     			if( ! folder.exists){
        			    folder.create(); 
       				 } 
    //---------------------------------------dependencies-------------    
    	if(Object.keys(pack.dependencies).length){
    	
      		  // in dependencies 	
           		   for( i in pack.dependencies ){
                       
                      var dep ;   
              		  getPackage( i, pack.dependencies[i], 
	  					function(result) {
	  							     dep = result['success'] ; 
      								 error += (result['error'])?result['error'] + "\n":"";
	                               });
	              if( dep ){
						dep = JSON.parse(dep);
						 var url	='http://10.0.0.226/'+dep.author+'/'+dep.name+'.git';         
   					     git.clone(path + PS + 'wpm_dependancies' , url , 
     					  function(result) {
      						   success += (result['success'])?result['success']:"" ; 
       						   error += (result['error'])?result['error']:"";
     							  }
    						);
					   }	  
                        
              }
    }
   //------------------------------Pack--------------------------------- 
         
    var url	='http://10.0.0.226/'+pack.author+'/'+pack.name+'.git';         
    git.clone(path + PS + 'wpm_dependancies' , url , 
       function(result) {
        success += (result['success'])?result['success']:"" ; 
        error += (result['error'])?result['error']:"";
       }
    );
    
    	
	
   }  
   
        

	
	


}

//---------------------------------UPDATE  Package -----------------------------------------

function  updatePackage(name , version ,callback){
	
	
	var xhr = new XMLHttpRequest();
    xhr.open("PUT","/wpm/packages/"+name+"/"+version+"");
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


function  upgradePackages(){};
