
// the Git Module. 

exports.GIT = (function () {
	
	// public functions 
	return {
	// git init 
	init  : init , 
	// git add
	add   : add ,
	// git commit 
	commit: commit,
	//status 
	status : status,
	//git log 
	log : log , 
	// git checkout
	checkout : checkout,
	//git reset Head 
	reset  : reset,
	//git current branch 
	branch : branch ,
	//git branch newBranch 
	newBranch : newBranch ,
	// checkout branchname 
	checkout : checkout , 
	// git merge 
	merge : merge ,
	// remote   
	remote : remote ,
	//push to the repo
	 push  :  push ,
	 // pull from  the repo
	 pull  :  pull ,
	 //reset the commit 
	 reset : reset ,
	 //clone a project
     clone : clone ,
    // the  path separator based on the OS
	  PS : PS ,
    // the workSystem using the  built-in commands of the OS  
      BIC : BIC   
	
   }
   
})();
//------------------------------------Utilities ----------------------

var utility = require('Utilities.js').Utilities ,
     
    gb = utility.gitGlobalVariables();


//---------------------------------- Global variables  ------------------------------------------

var 
    // the  path separator based on the OS
    PS = gb['PS'] , 
    
    //   the workSystem using the  built-in commands of the OS  
    BIC= gb['BIC']  ;



//-------------------------------- repository ------------------------------------------------------

/*
 * repository() - private we use it just to verify  the validation of  the path
 * checks the given path for git repo and if it exists
 */
 

 
function repository(path) {
    
    // add the  .git in the path folder 
    path = path + PS +".git";
    // create a folder representation of the folder 
    var folder = Folder(path);
    // does the path exist
    if (folder.exists) {
        return true;
    }
    else {
        return false;
    }

    // return false if path invalid
}




//-------------------------------- Create a repo  ------------------------------------------------------
/*
 * init() - public
 * creates a new directory, initializes a git repo, and adds a readme, then passes result into callback
 */
function init(nameFile, description, path, callback) {
    // is path valid
    var folder = Folder(path);

    if (folder.exists) {
        // get the  directory's content
        var contents = folder.folders;
        // create initial readme text
        var readme_txt = '# ' + nameFile + '\n\n' + description;
        // if the dir is not empty
        if (contents.length) {
            // iterate over items
            for (var repo = 0; repo < contents.length; repo++) {
                // does the repo already exist
                if (contents[repo].name === nameFile) {
                    // pass error object into callback
                    if (callback) {
                        callback.call(this, {
                            error: 'Directory already exists'
                        });
                    }
                    // doesn't exist
                }
                else {
                    // last in iteration
                    if (repo === contents.length - 1) {
                        // call ready()
                        ready();
                    }
                }
            }
            // otherwise go ahead to reday() function
        }
        else {
            ready();
        }


        // called if all is good in the hood
        function ready() {
            // make sure the path format is good
            if (path.charAt(path.length - 1) !== PS ) {
                path += PS ;
            }
            // create the dir
            Folder(path + nameFile).create();
            // init git repo
            var command = 'git init ';
            var stdin = ""; // must be an empty String or buffer;
            var result = SystemWorker.exec( BIC +' "'+ command + '"', stdin, path + nameFile);

            if (result != null) {
                var stdout = result.output.toString();
                var stderror = result.error.toString();
                var stdStatus = result.exitStatus;

                // if error, pass error object into callback
                if (stderror != "") {
                    if (callback) {
                        callback.call(this, {
                            error: stderror
                        });
                    }
                    // if successful  pass the result objet
                }
                else if (stdout) {
                    // create readme file and place text inside
                    var file = File(path + nameFile + PS +'README.md');
                    file.create();

                    var stream = TextStream(file, "write");
                    stream.write(readme_txt);
                    stream.close();

                    if (callback) {
                        callback.call(this, {
                            success: stdout

                        });

                    };
                }
            }
        } // invalid path
    }
    else {
        if (callback) {
            callback.call(this, {
                error: 'Invalid Repository'
            });
        }
    }
}




//-------------------------------- log ------------------------------------------------------

/* log, add , remove , unstage  - public
 * set process to run in specified directory and passes an array of commit objects into the callback
 */
 
function log(path, callback) {
    var stdin = "",
        // must be an empty String or buffer;
        command = '';
    command += 'git log --pretty=format:" commit: %h , author: %an <%ae>, date: %ar , message: %s" ';

    // if the path is a valid repository, get the commit log
    if (repository(path)) {
        // execute bash command
        var stdin = ""; // must be an empty String or buffer;
        var result = SystemWorker.exec( BIC +' "'+ command + '"', stdin, path);
        if (result != null) {
            var stdout = result.output.toString();
            var stderror = result.error.toString();
            var stdStatus = result.exitStatus;

            // if error, pass error object into callback
            if (stderror != "") {
                if (callback) {
                    callback.call(this, {
                        error: stderror
                    });
                }
                // if successful  pass the result objet
            }
            else if (stdout) {

                if (callback) {
                    callback.call(this, stdout);
                }
            }
        } // can't find the Repository
        else {
            if (callback) {
                callback.call(this, {
                    error: 'Invalid Repository'
                });
            }
        }
    }
}


//-------------------------------- Destroy ------------------------------------------------------
/*  
 * destroy() - public
 * deletes git repo and optionally all contents  
 */
/*
 * Problem  : Can't find variable: => .git folder
 */
function destroy(path, callback) {
    // if the path exists
    var folder = Folder(path);
    if (folder.exists) {
        //if delete all contents
        folder.removeContent();
        //  remove the depo .git  because it hidden dir
        var repoPath = path + PS + ".git";
        var repo = Folder(repoPath);
        repo.removeContent();

        if (repo.exists) {
            //remove depo
            remove(repo);
            //folder.remove();
            remove(folder);
            //pass success into callback
            if (callback) {
                callback.call(this, {
                    success: 'Repository destroyed and contents deleted'
                });
            }
        }


    }
    else {
        if (callback) {
            callback.call(this, {
                error: 'Invalid path'
            });
        }

    }
}




//-------------------------------- Commit ------------------------------------------------------
/** commit() - public
 * commits the current staged files to the working branch
 */

function commit(path, message, callback) {

    if (repository(path)) {
     
     var  
         message ,
         stdin = "" , // must be an empty String or buffer;
         result = SystemWorker.exec(BIC + ' " git commit -m  " ' + message + '"', stdin, path);

        if (result != null) {
            var stdout = result.output.toString();
            var stderror = result.error.toString();
            var stdStatus = result.exitStatus;

            if (callback) {
                if (stderror != "") {
                    callback.call(this, {
                        error: stderror
                    });
                }

                // all is good
                else if (stdout) {
                    callback.call(this, {
                        message: stdout
                    });
                }
            }
        }

    }
    else {
        callback.call(this, {
            error: 'Invalid repository'
        });
    }
}




//-------------------------------------- Stage ------------------------------------------------------
/*
 * stage() - private
 * adds or removes the array of files in the specified repository for commit
 */
function stage(operation, path, files, callback) {
    // move to repo
    if (repository(path)) {
        // store any errors
        var errs = [],
            succs = [];
        if (!files.length && callback) {
            callback.call(this, {
                errors: errs,
                added: succs
            });
        }
        else {

            var folder = Folder(path);
            folder.forEachFile(function(file) {

                // execute git add for file
                var command = 'git  ' + operation + file.name;
                var stdin = ""; // must be an empty String or buffer;
                var result = SystemWorker.exec(BIC + ' "'+ command + '"', stdin, path);

                if (result != null) {
                    var stdout = result.output.toString();
                    var stderror = result.error.toString();
                    var stdStatus = result.exitStatus;

                    if (stderror != "") {
                        errs.push(stderror);

                        if (callback) {
                            callback.call(this, {
                                errors: stderror
                            });
                        }
                        // all is good
                    }
                    else {
                        succs.push(file.name);
                        if (callback) {
                            callback.call(this, {
                                added: succs
                            });
                        }
                    }
                }
            });

        }
    }


    else {
        if (callback) {
            callback.call(this, {
                error: 'Invalid repository'
            });
        }

    }
}


/*
 * add() - public
 * adds the array of files in the specified repository for commit
 */
function add(path, files, callback) {
    stage('add', path, files, callback);
}

/*
 * remove() - public  
 * removes modification in the array of files in the specified repository for commit
 */
function remove(path, files, callback) {
    stage('checkout ', path, files, callback);
}

/*
 * reset() - public
 * removes the array of files in the specified repository for commit
 */
function reset(path, files, callback) {
    stage('reset HEAD ', path, files, callback);
}





//----------------------------------------branch ---------------------------------------------------------
/*
 * branch () - public
 * gets the current branch that HEAD points to and passes to callback
 */
function branch(path, callback) {
    if (repository(path)) {
        var command = 'git branch ';
        stdin = ""; // must be an empty String or buffer;
        result = SystemWorker.exec(BIC +' "'+ command + '"', stdin, path);
        if (result != null) {
            var stdout = result.output.toString();
            var stderror = result.error.toString();
            var stdStatus = result.exitStatus;

            // if error, pass error object into callback
            if (stderror != "") {
                if (callback) {
                    process.chdir(back);
                    callback.call(this, {
                        error: stderror
                    });
                }
                // all is good
            }
            else if (stdout) {
                var tree = {
                    current: null,
                    others: []
                },
                    branches = stdout.split('\n');
                // iterate over the branches 
                for (var i = 0; i < branches.length; i++) {

                    if (branches[i].indexOf('*') > -1) {
                        tree['current'] = branches[i].replace('*', '').trim();
                    }
                    else {
                        if (branches[i]) {
                            tree['others'].push(branches[i].trim());
                        }
                    }
                }
                if (callback) {
                    callback.call(this, tree);
                }
            }

        }
    } // can't find the				
    else {
        callback.call(this, {
            error: 'Invalid repository'
        });
    }
}




//----------------------------------------  newBranch---------------------------------------------------------
/*
 * branch() - public
 * creates a new branch for the specified repository
 */
function newBranch(path, branchname, callback) {
    if (repository(path)) {
        var command = 'git branch  ' + branchname;
        stdin = ""; // must be an empty String or buffer;
        result = SystemWorker.exec(BIC +' "'+ command + '"', stdin, path);

        if (result != null) {
            var stdout = result.output.toString();
            var stderror = result.error.toString();
            var stdStatus = result.exitStatus;

            // if error, pass error object into callback
            if (stderror != "") {
                if (callback) {
                    callback.call(this, {
                        error: stderror
                    });
                }
                // all is good
            }
            else {
                if (callback) {
                    callback.call(this, {
                        message: 'Branch ' + branchname + ' created'
                    });
                }
            }

        }
    }
    else {
        callback.call(this, {
            error: 'Invalid repository'
        });
    }
}




//----------------------------------------checkout---------------------------------------------------------
/*
 * checkout() - public
 * performs git checkout for the specified branch
 */
function checkout(path, branch, callback) {

    if (repository(path)) {

        var command = 'git checkout ' + branchname;
        stdin = ""; // must be an empty String or buffer;
        result = SystemWorker.exec( BIC +' "'+ command + '"', stdin, path);

        if (result != null) {
            var stdout = result.output.toString();
            var stderror = result.error.toString();
            var stdStatus = result.exitStatus;

            // if error, pass error object into callback
            if (stderror != "") {
                if (callback) {
                    callback.call(this, {
                        error: stderror
                    });
                }
            }
            // all are Good 
            else if (stdout.indexOf('Switched') > -1) {
                if (callback) {
                    callback.call(this, {
                        message: stdout
                    });
                }
            }
        }
    }
    else {
        callback.call(this, {
            error: 'Invalid repository'
        });
    }
}



//----------------------------------Merge -------------------------------------------------

/*
 * merge - public
 * merges the given branch insto the current branch
 */
function merge(path, branch, callback) {
    if (repository(path)) {
        var command = 'git merge ' + branch;
        stdin = ""; // must be an empty String or buffer;
        result = SystemWorker.exec(BIC +' "'+ command + '"', stdin, path);

        if (result != null) {
            var stdout = result.output.toString();
            var stderror = result.error.toString();
            var stdStatus = result.exitStatus;

            // if error, pass error object into callback
            if (stderror != "") {
                if (callback) {
                    callback.call(this, {
                        error: stderror
                    });
                }
            }
            // all are Good 
            else if (stdout.indexOf('Switched') > -1) {
                if (callback) {
                    callback.call(this, {
                        message: stdout + ' Merged ' + branch + '!'
                    });
                }
            }
        }
    }
    else {
        callback.call(this, {
            error: 'Invalid repository'
        });
    }
}



//----------------------------------Status -------------------------------------------------
/*
 * status() - public
 * executes git status and parses into object containing staged/unstaged files
 */
function status(path, callback) {
    if (repository(path)) {
        var command = 'git status ';
        stdin = ""; // must be an empty String or buffer;
        result = SystemWorker.exec( BIC +' "'+ command + '"', stdin, path);

        if (result != null) {

            var stdout = result.output.toString();
            var stderror = result.error.toString();
            var stdStatus = result.exitStatus;

            // if error, pass error object into callback
            if (stderror != "") {

                if (callback) {
                    callback.call(this, {
                        error: stderror
                    });
                }

                // all is good
            }
            else {
                // parse the status into staged & unstaged 
                callback.call(this, parseStatus(stdout));
            }
        };
    }
    else {
        callback.call(this, {
            error: 'Invalid repository'
        });
    }
    // status parser
    function parseStatus(gitstatus) {
        // create status object
        var status = {
            staged: [],
            not_staged: [],
            untracked: []
        },
            // use this var to switch between arrays to push to
            file_status = null,
            // split output into array by line
            output = gitstatus.split('\n');
        // iterate over lines
        for (var i = 0; i < output.length; i++) {

            line = output[i];
            // switch to staged array
            if (line.toLowerCase().indexOf('changes to be committed') > -1) {
                file_status = 'staged';
                // or switch to not_staged array
            }
            else if (line.toLowerCase().indexOf('changes not staged for commit') > -1) {
                file_status = 'not_staged';
                // or switch to untracked array
            }
            else if (line.toLowerCase().indexOf('untracked files') > -1) {
                file_status = 'untracked';
            }
            // check if the line contains a keyword
            if (line.indexOf('modified') > -1 ||
                line.indexOf('new file') > -1 || 
                line.indexOf('deleted')  > -1  ) {
                // then remove # and all whitespace and split at the colon
                var fileinfo = line.substr(1).trim().split(':');
                // push a new object into the current array  exemple file : new file 
                status[file_status].push({
                    file: fileinfo[1].trim(),
                    status: fileinfo[0]
                });
            }

        };

        return status;
    }
}

//---------------------------------------remote ----------------------------------------------------------  
    /*
     * remote - public
     * contains methods for adding removing and listing remotes
     */
    var remote = (function() {
        
        /*
         * add() - public
         * adds a remote
         */
        function add(path, remote, url, callback) {
          
            if (repository(path)) {
               
             var command ='git remote add ' + remote + ' ' + url;
             var stdin = ""; // must be an empty String or buffer;
             var result = SystemWorker.exec( BIC +' "'+ command + '"', stdin, path);

            if (result != null) {

            var stdout = result.output.toString();
            var stderror = result.error.toString();
            var stdStatus = result.exitStatus;

            // if error, pass error object into callback
            if (stderror != "") {
                
                if (callback) {
                    callback.call(this, {
                        error: stderror
                    });
                }
                // if successful  pass the result objet
            }
            else if (stdout) {

                if (callback) {
                    callback.call(this, {
                     message : 'Remote "' + remote + '" added!'
                    });
                }
            }
             
           } 
        }else {
                callback.call(this, {
                    error : 'Invalid repository'
                });
            }
        }
        
        /*
         * update() - public
         * edits a remote
         */
        function update(path, remote, url, callback) {


            if (repository(path)) {
              
             var command ='git remote set-url ' + remote + ' ' + url;
             var stdin = ""; // must be an empty String or buffer;
             var result = SystemWorker.exec( BIC +' "'+ command + '"', stdin, path);

            if (result != null) {

            var stdout = result.output.toString();
            var stderror = result.error.toString();
            var stdStatus = result.exitStatus;

            // if error, pass error object into callback
            if (stderror != "") {
                
                if (callback) {
                    callback.call(this, {
                        error: stderror
                    });
                }
                // if successful  pass the result objet
            }
            else if (stdout) {

                if (callback) {
                    callback.call(this, {
                     message : 'Remote "' + remote + '" updated!'
                    });
                }
            }
             
           } 

            } 

            else {
                callback.call(this, {
                    error : 'Invalid repository'
                });
            }
        }
        
        /*
         * remove() - public
         * removes a remote
         */
        function remove(path, remote, callback) {
            
            if (repository(path)) {

             var command = 'git remote rm ' + remote;
             var stdin = ""; // must be an empty String or buffer;
             var result = SystemWorker.exec( BIC +' "'+ command + '"', stdin, path);

            if (result != null) {

            var stdout = result.output.toString();
            var stderror = result.error.toString();
            var stdStatus = result.exitStatus;

            // if error, pass error object into callback
            if (stderror != "") {
                
                if (callback) {
                    callback.call(this, {
                        error: stderror
                    });
                }
                // if successful  pass the result objet
            }
            else if (stdout) {

                if (callback) {
                    callback.call(this, {
                     message : 'Remote "' + remote + '" removed!'
                    });
                }
            }

            }   
           

            } else {
                callback.call(this, {
                    error : 'Invalid repository'
                });
            }
        }
        
        /*
         * list() - public
         * lists remotes
         */
        function list(path, callback) {
            var cmd = 'git remote -v';
            if (repository(path)) {
                
             var command = 'git remote -v';
             var stdin = ""; // must be an empty String or buffer;
             var result = SystemWorker.exec( BIC +' "'+ command + '"', stdin, path);

            if (result != null){

                var stdout = result.output.toString();
                var stderror = result.error.toString();
                var stdStatus = result.exitStatus;

                    if (stderror) {
                        
                        if (callback) {
                            process.chdir(back);
                            callback.call(this, {
                                error : stderror
                            });
                        }
                    // all is good
                    } else {
                       
                        var list = {},
                            parseme = stdout.split('\n');
                         
                         for (var i = parseme.length - 1; i >= 0; i--) {
                            val = parseme[i]
                            if (val.split('\t')[0])
                            list[val.split('\t')[0]] = val.split('\t')[1].split(' ')[0];
                          }
                            
                        if (callback) {
                            callback.call(this, list);
                        }
                    }
                }
            } else {
                callback.call(this, {
                    error : 'Invalid repository'
                });
            }
        }
        
//------------------------- expose the remote functions --------------------------
        return {
            add : add,
            update : update,
            remove : remove,
            list : list
        }
    })();
    
//---------------------------------------Push-----------------------------------------------------------------    
    
       /*
     * push() - public
     * pushes the specified branch to the specified remote
     */
    function push(path, remote, branch, callback) {


        if (repository(path)) {
             
             var command = 'git push -u ' + ((remote) ? remote : '') + ' ' + ((branch) ? branch : '');
             var stdin   = ""; // must be an empty String or buffer;
             var result  = SystemWorker.exec( BIC +' "'+ command + '"', stdin, path);

            if (result != null){

                var stdout = result.output.toString();
                var stderror = result.error.toString();
                var stdStatus = result.exitStatus;

                if (stderror) {

                    if (callback) {
                        process.chdir(back);
                        callback.call(this, {
                            error : stderror
                        });
                    }
                // all is good
                } else if (stdout) {
                                        
                    if (callback) {
                        callback.call(this, {
                            message : stdout
                        });
                    }
                }
            }
        } else {
            callback.call(this, {
                error : 'Invalid repository'
            });
        }
    }
//--------------------------------------------- Pull-------------------------------------------------------------    
    /*
     * pull() - public
     * pulls the specified branch from the specified remote
     */
    function pull(path, remote, branch, callback) {
       
        if (repository(path)) {
          
          var command = 'git pull ' + ((remote) ? remote : '') + ' ' + ((branch) ? branch : '');
          var stdin   = ""; // must be an empty String or buffer;
          var result  = SystemWorker.exec( BIC +' "'+ command + '"', stdin, path);

            if (result != null){

                var stdout = result.output.toString();
                var stderror = result.error.toString();
                var stdStatus = result.exitStatus;

                if (stderror) {

                    if (callback) {
                        process.chdir(back);
                        callback.call(this, {
                            error : stderror
                        });
                    }
                // all is good
                } else if (stdout) {
                                        
                    if (callback) {
                        callback.call(this, {
                            message : stdout
                        });
                    }
                }
            }
        } else {
            callback.call(this, {
                error : 'Invalid repository'
            });
        }
    }
  //--------------------------------------- Reset------------------------------------------------------------  
    /*
     * reset() - public
     * resets the HEAD back to the specified commit hash
     */
    function reset(path, hash, callback) {
        
        if (repository(path)) {
           var command = 'git reset -q ' + hash;
           var stdin = ""; // must be an empty String or buffer;
           var result = SystemWorker.exec( BIC +' "'+ command + '"', stdin, path);

            if (result != null){

                var stdout = result.output.toString();
                var stderror = result.error.toString();
                var stdStatus = result.exitStatus;

                if (stderror) {

                    if (callback) {
                        process.chdir(back);
                        callback.call(this, {
                            error : stderror
                        });
                    }
                    // all is OK 
                }else {
                                        
                    if (callback) {
                        process.chdir(back);
                        callback.call(this, {
                            message : 'Repository reset to commit: ' + hash
                        });
                    }
                }
            }
        } else {
            callback.call(this, {
                error : 'Invalid repository'
            });
        }
    }

//-----------------------------------------Clone--------------------------------------------------
    /*
     * clone() - public
     * clones the given git url into the path specified
     */
    function clone(path, url, callback) {

        
        if (!url) {
            if (callback) {
                callback.call(this, {
                    error : 'Please specify a URL'
                });
            }
        } else {
        
          var command = 'git clone ' + url;
          var stdin = ""; // must be an empty String or buffer;
          var result = SystemWorker.exec( BIC +' "'+ command + '"', stdin, path);

            if (result != null){

                var stdout = result.output.toString();
                var stderror = result.error.toString();
                var stdStatus = result.exitStatus;

                if (stderror) {

                    if (callback) {
                        process.chdir(back);
                        callback.call(this, {
                            error : stderror
                        });
                    }
                // all is good
                } else if (stdout) {
                                        
                    if (callback) {
                        callback.call(this, {
                            message : stdout
                        });
                    }
                }
            }
         }
                
    }
    
    
    
    