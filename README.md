##Welcome to Demo Wakanda Package Manager##

This is the place to describe your Wakanda application.

to see a simple a demo please follow this link https://youtu.be/GeDoMHppWuQ

###Pre-Install 

* Linux (OS)
* Nginx (Web Server)
* Git (Version and Packages Management)

###Configuration files
- nginx.conf
```
user www-data;
worker_processes 1;



events {
    worker_connections 1024;
}

http {


    ##
    # Basic Settings
    ##

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    # server_tokens off;

    # server_names_hash_bucket_size 64;
    # server_name_in_redirect off;

    include /usr/local/openresty/nginx/conf/mime.types;
    default_type application/octet-stream;

    ##
    # Logging Settings
    ##

    #access_log /var/log/nginx/access.log;
    #error_log /var/log/nginx/error.log;

    
    ##
    # Virtual Host Configs
    ##

    #include /etc/nginx/conf.d/*.conf;
    #include /etc/nginx/sites-enabled/*;

    ##
    # mapping  user to its repos dynamicly 
    ##
    
    map $remote_user $user_repos {
            default      $remote_user;
          }
    
    ##
    # server Settings
    ##
    
    server{
    
           listen 80 ;
           server_name depot.wpm.com;

           
        ##
        # Logging Settings
        ##

        access_log /var/log/nginx/git_access.log;
        error_log /var/log/nginx/git_error.log;
                 
        ##
        # auth Settings
        ##
                
         auth_basic "WPM Depot authentification";                  
         auth_basic_user_file /var/git/passwd.git ;

        ##
        # Git-http-backend Settings
        ##

         
               # requests that need to go to git-http-backend
              
                  location ~^.*/(HEAD|info/refs|objects/info/.*|git-(upload|receive)-pack)$ {
                  access_by_lua '
                                local res = ngx.location.capture("/init")              
                                ';
                  fastcgi_pass unix:/var/run/fcgiwrap.socket;
                  fastcgi_param SCRIPT_FILENAME   /usr/lib/git-core/git-http-backend;
                  fastcgi_param PATH_INFO         $uri;
                  fastcgi_param GIT_PROJECT_ROOT  /var/git/$user_repos;
                  fastcgi_param GIT_HTTP_EXPORT_ALL "";
                  fastcgi_param REMOTE_USER $remote_user;
                  include fastcgi_params;
                  }
                
                  ##
                  # subrequest for init depot
                  ##
                  location ~^/init$ {
                  fastcgi_param  REMOTE_USER        $remote_user;
                  fastcgi_param  REQUEST_URI        $request_uri;
                  fastcgi_pass_request_body       on; # send client request body upstream?
                  fastcgi_pass_request_headers    on; # send client request headers upstream
                  fastcgi_keep_conn               on; # keep request alive
                  fastcgi_pass  unix:/var/run/fcgiwrap.socket;
                  fastcgi_param SCRIPT_FILENAME /usr/lib/cgi-bin/init_depot.cgi;
                  include       fastcgi_params;
                  }
    }

}
```


- init_depot.cgi
```
#!/usr/bin/env perl

# in this script we supose that the user hase aready subscribe
# so we add the user name and password in .htaccess 
# so for each request we get the user and the reposity names
# see if the repository is existe and if not 
# 1- ceate the repot in the name of the user and the repot also
# 2- init as --bare
# //  this can possible when the subscription 3- change owner and # # #groupre to www-data  
# set the env variables 

# set the header of the response for text over browser
print "Content-type: text/html\n\n";

# test in the log => print STDERR "my comment" ;
#--------------------  Set and Get  varaibles ------------------
 
my $user    = $ENV{REMOTE_USER} ;
my $request = $ENV{REQUEST_URI} ;
my $packageName ;
my $repot ='/var/git'  ;


#------------------------------we create a repo just in the receive pack =push ---------------------

if($request =~m/^\/([a-zA-Z0-9\.\-]+)\/.*?service=git-receive-pack.*$/ ){
    $packageName = $1 ;
}

# if the package name is defined => push repository 

if( -d $repot && defined $packageName ){ 
      
        chdir($repot) or die"connot chdir to ".$repot ;

      #---------------------------------User depot------------------------------------------------
      # if a user repot exist  
      if(-d $user ){
              #change the user
              chdir($user) or die"connot chdir to ".$user ; 
      }
      # no dirctory has the name of the user  
      else{
       mkdir($user) or die "connot mkdir new dir ".$user ;
       chdir($user) or die"connot chdir to ".$user ; 
      }

      #---------------------------------Package name ------------------------------------------------
     if(-d $packageName ){
         # test if the package exits
         #print $repot." is aready exist in the depot " ;
        }
     else{ 
         # if dosn't exist.    
         mkdir($packageName) or die "connot mkdir new dir ".$packageName ;
         # init the direcoty as bare one. 
         chdir($packageName) or die"connot chdir to ".$repot ;
         # init the package repot 
         system("git init --bare");
         system("git update-server-info");

        }
 }
```
