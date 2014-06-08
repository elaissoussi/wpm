//--------------------------------------- Global Variable -----------------------------------------
    
// get an instance of the git object Model 
git = require('GIT.js').GIT;
   
//--------------  expose the module ------------------------------------------------------------
exports.clientWPM = (function() {
	   
    //  expose the public methods 
    return {
        // GIT Functions. 
        history  : git.log,
        create   : git.init,
        status   : git.status,
        add      : git.add,
        remove   : git.reset,
        commit   : git.commit,
        tree     : git.branch,
        branch   : git.newBranch,
        checkout : git.checkout,
        remote   : git.remote,
		push  	 : git.push,
		pull 	 : git.pull,
		reset	 : git.reset,
		merge	 : git.merge,
		clone	 : git.clone
    }
})();




