
//----------------------------  create Package -----------------------------------------------------------------

model.Package.methods.createPackage = function(body) {
	
    // get the user credentials 
    var jsonPackage = JSON.parse(body),
        author = jsonPackage.author ;
    if (verifyUser(author)) {
           
      var  pack  =  ds.Package.createEntity();
     //-----------String --------------- 
     
      pack.name = jsonPackage.name;
      pack.version = jsonPackage.version;
      pack.description = jsonPackage.description;
      
     //------------Object------------------ 
 	  pack.author = ds.Author.find("login =:1",jsonPackage.author.login);
      pack.save();

	 //------------Collection packages  
	  //if(Object.keys(jsonPackage.dependencies).length){
	  if( typeof jsonPackage.dependencies != 'string'){
	    for( i in jsonPackage.dependencies){
    	// key is i   && value is   p1.dependencies[i] ;
    	  var  dep = ds.Dependency.find("nom = :1", i);
    	  if( !dep ){
    	  
					var d = ds.Dependency.createEntity() ;
					d.nom = i ;
					d.version = jsonPackage.dependencies[i] ;
					d.pack = pack ; 
					d.save() ;
					    	              
    	  }else{
                    dep.pack = pack ;
                    dep.save() ;   
          }
    	}
     }	
        try {
            pack.save();
        }
        catch (e) {

            return e.message;
        }

    }

};


model.Package.methods.getPackages = function(params) {

    params = params.replace("/wpm/packages/", "");
    params = params.split("/");
   
    var 
        name = params[0],
        version = params[1] ,
        dependencies = params[2],
        result  ;

    // get all packages 
    if ( !name ) {
    	//  we get thing in array 
        ps = ds.Package.all();
        result = JSON.stringify(ps);

    } 
    // get a specifique package
    else {
    	var p ;
        // name without  version  
        if (!version) 
        {	
            p = ds.Package.query("name == :1", name);
        }
        //name with version
        else {
            p = ds.Package.query("name == :1 && version ==:2", name, version);                     
        }
             
        if(p){
         
         var deps = {} ;
 	     for( i =0 ; i < p.dependancies.length ; i++ ){
  		        deps[p.dependancies[i].nom] =  p.dependancies[i].version;
 				 } 
 				 
         var   reponsePackage = {
           "name": ""+p.name+"",
           "version":""+p.version+"",
           "author":""+p.author.login+"",
            "dependencies" : deps
            }; 
         }    
             
            result = JSON.stringify(reponsePackage);
    }

    return result;

};





model.Package.methods.getDependencies = function(name, version, callback) {


    // the version is not null 
    if (version) {
        // get a package throught its name and its version	
        var data = ds.Package.query("name ==:1 && version ==:2", name, version);
        var dependencies = JSON.stringify(data.dependencies.toArray());

        // callback 
        if (callback) {
            //  all is ok
            if (packages) {
                callback.call(this, {
                    success: dependencies
                });
            }
            // hand the error 
            else callback.call({
                error: " invalid opertion"
            });
        }

    } // the verion is not mensioned 
    else {
        // get a package just from its name 
        var data = ds.Package.query("name ==:1", name);
        var dependencies = JSON.stringify(data.dependencies.toArray());

        // callback 
        if (callback) {
            //  all is ok
            if (packages) {
                callback.call(this, {
                    success: dependencies
                });
            }
            // hand the error 
            else callback.call({
                error: " invalid opertion"
            });
        }


    }

    return dependencies;

};


model.Package.methods.getMaintainers = function(name, version, callback) {


    // the version is not null 
    if (version) {
        var data = ds.Package.query("name ==:1 && version ==:2", name, version);
        var maintainers = JSON.stringify(data.maintainers.toArray());
        // callback 
        if (callback) {
            //  all is ok
            if (packages) {
                callback.call(this, {
                    success: maintainers
                });
            }
            // hand the error 
            else callback.call({
                error: " invalid opertion"
            });
        }

    } // the verion is not mensioned 
    else {
        // get a package just from its name 
        var data = ds.Package.query("name ==:1", name);
        var maintainers = JSON.stringify(data.maintainers.toArray());

        // callback 
        if (callback) {
            //  all is ok
            if (packages) {
                callback.call(this, {
                    success: maintainers
                });
            }
            // hand the error 
            else callback.call({
                error: " invalid opertion"
            });
        }


    }

    return maintainers;


};


model.Package.methods.getContributors = function(name, version, callback) {


    // the version is not null 
    if (version) {
        // get a package throught its name and its version	
        var data = ds.Package.query("name ==:1 && version ==:2", name, version);
        var contributors = JSON.stringify(data.contributors.toArray());
        // callback 
        if (callback) {
            //  all is ok
            if (packages) {
                callback.call(this, {
                    success: contributors
                });
            }
            // hand the error 
            else callback.call({
                error: " invalid opertion"
            });
        }

    } // the verion is not mensioned 
    else {
        // get a package just from its name 
        var data = ds.Package.query("name ==:1", name);
        var contributors = JSON.stringify(data.contributors.toArray());

        // callback 
        if (callback) {
            //  all is ok
            if (packages) {
                callback.call(this, {
                    success: contributors
                });
            }
            // hand the error 
            else callback.call({
                error: " invalid opertion"
            });
        }


    }

    return contributors;

};

// create package 

// remove package
model.Package.methods.removePackage = function(name, version) {
  
    var pack ;
     
    if (name && version)  
         pack = ds.Package.query("name == :1  &&  version == :2", name, version);
    else if (name) 
         pack = ds.Package.query("name == :1", name);

    try {
        return pack.remove(); // remove  the package from the dataStore
    }
    catch (e) {

        return e.message;
    }

};

//update package 
model.Package.methods.updatePackage = function() {



};




// verify the creedentials of the user 
 
function verifyUser(author) {
    // get the user from the datastore
    var user = ds.Author.query("login == :1  &&  password == :2", author.login, author.password);
    if (user != '') return true;
    else return false;
}