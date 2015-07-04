##Welcome to Demo Wakanda Package Manager##

This is the place to describe your Wakanda application.

to see a simple demo of some funti  visit [www.youtube.com/watch?v=LyCWSgwgR4A]

###Pre-Install 
* Nginx server 
* Git 

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
