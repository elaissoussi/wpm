/*  if you want to add an collection of object in datastore you must add it in side of */

var p1 = {
   
   "name": "p1",
   "version": "1.7.0",
   "description": "Sample package for CommonJS",
    "author": {
      "login" : "user",
      "password":"user"
    } 
   ,
          
    "dependencies": {
       "webkit": "1.2",
       "p2" : "1.2"
   }
   , 
      "maintainers": [
       {
           "name": "mon",
           "email": "mon@example.com",
           "web": "http://www.wpm.com" 
       } 
   					 ]
   }
 ;  
 
 
 /*     
 	 var  pack  =  ds.Package.createEntity();
//     //-----------String --------------- 
//     
   pack.name = p1.name;
      pack.version = p1.version;
      pack.description = p1.description;
      
  //------------objet---------------
 
// author 	
	  var aut = ds.Author.find("login =:1",p1.author.login); 
	  
	  if( !aut){
//	        var a = ds.Author.createEntity();
//	        a.login = p1.author.login;
//	        a.password = p1.author.password ;
//	        a.save();
//     		pack.author = ds.Author.find("login =:1",p1.author.login);
	  }else {
     
 	  pack.author = ds.Author.find("login =:1",p1.author.login);
      pack.save();
       
     } 

  //dependencies 
  
    for( i in p1.dependencies){
    	// key is i   && value is   p1.dependencies[i] ;
    	  var  dep = ds.Dependency.find("nom = :1", i);
    	  if( !dep ){
    	  
					var d = ds.Dependency.createEntity() ;
					d.nom = i ;
					d.version = p1.dependencies[i] ;
					d.pack = pack ; 
					d.save() ;
					    	              
    	  }else{
                    dep.pack = pack ;
                    dep.save() ;   
          }
    }
    
      
// maintainers 
      
     var mains  = ds.Maintainer.find("name =:1",p1.maintainers[0].name);
     if( !mains ){
     
             var m = ds.Maintainer.createEntity();
             m.name = p1.maintainers[0].name;
             m.email= p1.maintainers[0].email;
            m.web  = p1.maintainers[0].web ;
             m.pack = ds.Package.find(" name =:1 ",p1.name);
             m.save();

     }else{
          mains.pack = pack ;
          mains.save();
        }
     


    
     
         */



// dependencies 
 var   pack = ds.Package.find("name = :1",p1.name);
  
if( pack ){  
  
  var deps = {} ;
  for( i =0 ; i < pack.dependancies.length ; i++ ){
          deps[pack.dependancies[i].nom] =  pack.dependancies[i].version;
  } ;
 
 var   reponsePackage = {
           "name": ""+pack.name+"",
           "version":""+pack.version+"",
           "author":""+pack.author.login+"",
            "dependencies" : deps
            };            
JSON.stringify(reponsePackage) ;
}