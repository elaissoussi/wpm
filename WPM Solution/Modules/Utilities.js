
//--------------------------  Expose the utilies Model------------------------------------
exports.Utilities = (function() {
  
    //  expose the public methods 
    return {
      
        gitGlobalVariables  : gitGlobalVariables
      
           }
})();

// --------------------------------------- get the OS System ------------------------------------
/*  private 
*  get the OS name 
*/

function getOS() {
	if (os.isWindows)
                    return "Windows" ;
    
    else if(os.isLinux) 
                    return "Linux" ;
    
    else if(os.isMac) 
                    return "Mac" ;
}

//------------------------------------ Git global Variables ---------------------------------------------

/** private 
*  set the Glabl varibels of the Git model 
*/

function gitGlobalVariables(){
  
  // getOS() system 
  var gb  ; 
  switch(getOS()){
  
  case "Windows" : 
                 gb = { 
                    PS  :"\\" ,
                    BIC :'cmd /u /c'
                  } ;

                  break ; 
                 
  case   "Linux" :
                  gb = {
                  PS  : "/" ,
                  BIC : ''} ;

                  break ;
  
  case   "Mac"   : 
                  gb = {
                  PS  :"/" ,
                  BIC :'bash -c'
                  };

                  break ;                
  
  default        :
                  gb = {
                  PS  : "" ,
                  BIC : 'b'
                  };

                  break ;                       
  }

  return gb ;

}


//--------------------- format the path from backslach \ to \\ -------------------
/*
* Public 
* fix tha path format before use-it in the windows's OS
*/
function parsePath(path){
     if(getOS() == "Windows"){
     //replace \ by \\  	
     var path = path.replace(/\//g, "\\") ;  
     	return path;
     }
     // no problem with  MAC or Linux
     else
     {
       return path;
     }
     
}


