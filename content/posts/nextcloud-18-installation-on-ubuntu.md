---
title: "Nextcloud 20 Installation on Ubuntu"
date: 2020-01-26T14:41:14+01:00
publishDate: 2020-10-21T20:08:11+01:00
draft: false
thumbnail: v1567799486/2019/nextcloud.png
categories: [SysAdmin]
tags: [Nextcloud, Ubuntu, VPS]
readmore: "Read the tutorial"
summarize: true
update: With the release of [Nextcloud 20](https://nextcloud.com/blog/nextcloud-hub-20-debuts-dashboard-unifies-search-and-notifications-integrates-with-other-technologies/), I decided to update this tutorial to reflect its instalation on the latest version of Ubuntu LTS (20.04)
aliases:
    - /nextcloud-18-installation-on-ubuntu/
---

Finally, I'll now cover the installation of Nextcloud on Ubuntu!

At this point, is expected that you already had:
+ Choose a VPS provider and [concluded the initial setup of your Ubuntu server](/ubuntu-server-initial-setup/);
+ Installed [Nginx](/nginx-installation-on-ubuntu/);
+ Installed [PostgreSQL](/postgresql-installation-on-ubuntu/);
+ Installed [PHP 7.4](/php-installation-on-ubuntu/).

I'm currently using Ubuntu 20.04, but these instructions are equally valid for other Ubuntu versions.

<!--more-->

### Download Nextcloud 20

To download Nextcloud 20, change into the `/tmp` folder, to keep things clean, and use `wget` to download the archive:
```plain
# cd /tmp
# wget https://download.nextcloud.com/server/releases/nextcloud-20.0.0.zip
```

With the archive downloaded, now unzip it. We’ll also attempt to install `unzip`, in case you don’t have it installed already. The `-d` switch specifies the target directory, so the archive will be extracted to `/var/www/nextcloud`:
```plain
# sudo apt install unzip
# sudo unzip nextcloud-20.0.0.zip -d /var/www
```

Now you’ll have to change the owner of `/var/www/nextcloud` so Nginx can write to it:
```plain
# sudo chown www-data:www-data /var/www/nextcloud -R
```

### Install PHP Required Modules

Beyond the ones we [installed previously](/php-installation-on-ubuntu/#install-php), Nextcloud requires some additional PHP modules. To install them, run the following command:
```plain
# sudo apt install php-imagick php7.4-zip php7.4-bz2 php7.4-intl php-smbclient php7.4-bcmath php7.4-gmp
```

### Configure PHP

To meet the requirements of Nextcloud you need to make some changes in PHP cofiguration. The first one is changing the `memory_limit`. This setting is in **php.ini**, you can edit it running:
```plain
# sudo nano /etc/php/7.4/fpm/php.ini
```

Search for `memory_limit` and change it to `512M`.

{{< marker yellow p >}}Once you're editing **php.ini** you can take the opportunity to set [upload_max_filesize](https://www.php.net/manual/en/ini.core.php#ini.upload-max-filesize) and [post_max_size](https://www.php.net/manual/en/ini.core.php#ini.post-max-size) according to your preferences.{{< /marker >}}

Another thing is that as we're using `php-fpm`, system environment variables like PATH, TMP or others are not automatically populated. A PHP call like `getenv('PATH');` can therefore return an empty result. So you need to manually configure the environment variables in **www.conf**. To edit this file run:
```plain
# sudo nano /etc/php/7.4/fpm/pool.d/www.conf
```

Usually, near the bottom of the file, you will find some or all of the environment variables already, but commented out like this:
```php
;env[HOSTNAME] = $HOSTNAME
;env[PATH] = /usr/local/bin:/usr/bin:/bin
;env[TMP] = /tmp
;env[TMPDIR] = /tmp
;env[TEMP] = /tmp
```

Just uncomment the ones that refer to PATH and TMP, like this:
```php
...
env[PATH] = /usr/local/bin:/usr/bin:/bin
env[TMP] = /tmp
...
```

With this changes done, restart the PHP service:
```plain
# sudo systemctl restart php7.4-fpm
```

### Create User and Database for Nextcloud

To create a user and database for Nextcloud you first need to login to PostgreSQL prompt:
```plain
# sudo -i -u postgres psql
```

Then create a username (choose a **username** and **password** according to your preferences):
```postgres
CREATE USER username WITH PASSWORD 'password';
```

Create a database:
```postgres
CREATE DATABASE nextcloud TEMPLATE template0 ENCODING 'UNICODE';
```

Set the user you created as the owner of the database:
```postgres
ALTER DATABASE nextcloud OWNER TO username;
```

Grant the user all the privileges over the database:
```postgres
GRANT ALL PRIVILEGES ON DATABASE nextcloud TO username;
```

To quit the PostgreSQL prompt, run:
```plain
\q
```

### Configure Nginx for Nextcloud

You'll now create a Nginx _server block_ to nextcloud. I'm naming it **nextcloud** but you can name it whatever you like:
```plain
# sudo nano /etc/nginx/sites-available/nextcloud
```

Copy the following content to the file and change the `server_name` from **box.emanuelpina.ml** to the domain address you want use:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name box.emanuelpina.ml;
}
```

Save and close the file when you’re done.

Once created, to enable the _server block_ you need to create a symbolic link of it into `/etc/nginx/sites-enabled/` using the following command:
```plain
# sudo ln -s /etc/nginx/sites-available/nextcloud /etc/nginx/sites-enabled/
```

Make sure that there are no syntax errors in the Nginx files:
```plain
# sudo nginx -t
```

If there aren’t any issues, restart Nginx to enable the changes:
```plain
# sudo systemctl reload nginx
```

### Enable SSL for Nextcloud

You can use `certbot` to obtain a Let's Encrypt SSL certificate to your Nextcloud. If you didn't already, install it as its Nginx package running the following command:
```plain
# sudo apt install certbot python3-certbot-nginx
```

Then to use Certbot, run:
```plain
# sudo certbot --nginx
```

If this is your first time running Certbot, you'll be prompted to enter an email address, agree to the terms of service and authorise or not EEF (the entity that mantains Certbot) to send emails to you.

You'll then be presented with a list of all domains enabled on your server:
```plain
Which names would you like to activate HTTPS for?
-------------------------------------------------------------------------------
1: box.emanuelpina.ml
-------------------------------------------------------------------------------
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel):
```

Select the appropriate number for the domain you want to obtain a certificate (for our example type `1`) and press `ENTER`. After doing so, Certbot will communicate with the Let’s Encrypt server, then run a challenge to verify that you control the domain you’re requesting a certificate for.

If that’s successful, Certbot will ask how you’d like to configure the HTTPS settings:
```plain
Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
-------------------------------------------------------------------------------
1: No redirect - Make no further changes to the webserver configuration.
2: Redirect - Make all requests redirect to secure HTTPS access. Choose this for
new sites, or if you're confident your site works on HTTPS. You can undo this
change by editing your web server's configuration.
-------------------------------------------------------------------------------
Select the appropriate number [1-2] then [enter] (press 'c' to cancel):
```

Type `1` and press `ENTER`. Certbot will finish with a message like below. **Look at IMPORTANT NOTES and save the locations of both the certificate and key.**

```plain {hl_lines=["7-11"]}
Congratulations! You have successfully enabled https://box.emanuelpina.ml

You should test your configuration at:
https://www.ssllabs.com/ssltest/analyze.html?d=box.emanuelpina.ml
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/box.emanuelpina.ml/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/box.emanuelpina.ml/privkey.pem
...
```

Now, edit the Nextcloud's _server block_:
```plain
# sudo nano /etc/nginx/sites-available/nextcloud
```

And replace its content with the following code. Don't forget to change the `server_name` from **box.emanuelpina.ml** to the domain address you want and **update the locations to the SSL certificate and key**:

```nginx {hl_lines=[9,18,"20-21"]}
upstream php-handler {
    #server 127.0.0.1:9000;
    server unix:/var/run/php/php7.4-fpm.sock;
}

server {
    listen 80;
    listen [::]:80;
    server_name box.emanuelpina.ml;

    # Enforce HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443      ssl http2;
    listen [::]:443 ssl http2;
    server_name box.emanuelpina.ml;

    ssl_certificate /etc/letsencrypt/live/box.emanuelpina.ml/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/box.emanuelpina.ml/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!MEDIUM:!LOW:!aNULL:!NULL:!SHA;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;

    # HSTS settings
    # WARNING: Only add the preload option once you read about
    # the consequences in https://hstspreload.org/. This option
    # will add the domain to a hardcoded list that is shipped
    # in all major browsers and getting removed from this list
    # could take several months.
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # set max upload size
    client_max_body_size 512M;
    fastcgi_buffers 64 4K;

    # Enable gzip but do not remove ETag headers
    gzip on;
    gzip_vary on;
    gzip_comp_level 4;
    gzip_min_length 256;
    gzip_proxied expired no-cache no-store private no_last_modified no_etag auth;
    gzip_types application/atom+xml application/javascript application/json application/ld+json application/manifest+json application/rss+xml application/vnd.geo+json application/vnd.ms-fontobject application/x-font-ttf application/x-web-app-manifest+json application/xhtml+xml application/xml font/opentype image/bmp image/svg+xml image/x-icon text/cache-manifest text/css text/plain text/vcard text/vnd.rim.location.xloc text/vtt text/x-component text/x-cross-domain-policy;

    # Pagespeed is not supported by Nextcloud, so if your server is built
    # with the `ngx_pagespeed` module, uncomment this line to disable it.
    #pagespeed off;

    # HTTP response headers borrowed from Nextcloud `.htaccess`
    add_header Referrer-Policy                      "no-referrer"   always;
    add_header X-Content-Type-Options               "nosniff"       always;
    add_header X-Download-Options                   "noopen"        always;
    add_header X-Frame-Options                      "SAMEORIGIN"    always;
    add_header X-Permitted-Cross-Domain-Policies    "none"          always;
    add_header X-Robots-Tag                         "none"          always;
    add_header X-XSS-Protection                     "1; mode=block" always;

    # Remove X-Powered-By, which is an information leak
    fastcgi_hide_header X-Powered-By;

    # Path to the root of your installation
    root /var/www/nextcloud;

    # Specify how to handle directories -- specifying `/index.php$request_uri`
    # here as the fallback means that Nginx always exhibits the desired behaviour
    # when a client requests a path that corresponds to a directory that exists
    # on the server. In particular, if that directory contains an index.php file,
    # that file is correctly served; if it doesn't, then the request is passed to
    # the front-end controller. This consistent behaviour means that we don't need
    # to specify custom rules for certain paths (e.g. images and other assets,
    # `/updater`, `/ocm-provider`, `/ocs-provider`), and thus
    # `try_files $uri $uri/ /index.php$request_uri`
    # always provides the desired behaviour.
    index index.php index.html /index.php$request_uri;

    # Default Cache-Control policy
    expires 1m;

    # Rule borrowed from `.htaccess` to handle Microsoft DAV clients
    location = / {
        if ( $http_user_agent ~ ^DavClnt ) {
            return 302 /remote.php/webdav/$is_args$args;
        }
    }

    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }

    # Make a regex exception for `/.well-known` so that clients can still
    # access it despite the existence of the regex rule
    # `location ~ /(\.|autotest|...)` which would otherwise handle requests
    # for `/.well-known`.
    location ^~ /.well-known {
        # The following 6 rules are borrowed from `.htaccess`

        rewrite ^/\.well-known/host-meta\.json  /public.php?service=host-meta-json  last;
        rewrite ^/\.well-known/host-meta        /public.php?service=host-meta       last;
        rewrite ^/\.well-known/webfinger        /public.php?service=webfinger       last;
        rewrite ^/\.well-known/nodeinfo         /public.php?service=nodeinfo        last;

        location = /.well-known/carddav     { return 301 /remote.php/dav/; }
        location = /.well-known/caldav      { return 301 /remote.php/dav/; }

        try_files $uri $uri/ =404;
    }

    # Rules borrowed from `.htaccess` to hide certain paths from clients
    location ~ ^/(?:build|tests|config|lib|3rdparty|templates|data)(?:$|/)  { return 404; }
    location ~ ^/(?:\.|autotest|occ|issue|indie|db_|console)              { return 404; }

    # Ensure this block, which passes PHP files to the PHP process, is above the blocks
    # which handle static assets (as seen below). If this block is not declared first,
    # then Nginx will encounter an infinite rewriting loop when it prepends `/index.php`
    # to the URI, resulting in a HTTP 500 error response.
    location ~ \.php(?:$|/) {
        fastcgi_split_path_info ^(.+?\.php)(/.*)$;
        set $path_info $fastcgi_path_info;

        try_files $fastcgi_script_name =404;

        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $path_info;
        fastcgi_param HTTPS on;

        fastcgi_param modHeadersAvailable true;         # Avoid sending the security headers twice
        fastcgi_param front_controller_active true;     # Enable pretty urls
        fastcgi_pass php-handler;

        fastcgi_intercept_errors on;
        fastcgi_request_buffering off;
    }

    location ~ \.(?:css|js|svg|gif)$ {
        try_files $uri /index.php$request_uri;
        expires 6M;         # Cache-Control policy borrowed from `.htaccess`
        access_log off;     # Optional: Don't log access to assets
    }

    location ~ \.woff2?$ {
        try_files $uri /index.php$request_uri;
        expires 7d;         # Cache-Control policy borrowed from `.htaccess`
        access_log off;     # Optional: Don't log access to assets
    }

    location / {
        try_files $uri $uri/ /index.php$request_uri;
    }
}
```

Make sure that there are no syntax errors in the Nginx files:
```plain
# sudo nginx -t
```

If there aren’t any issues, restart Nginx to enable the changes:
```plain
# sudo systemctl reload nginx
```

### Complete Nextcloud Installation

Now, to complete Nextcloud installation, in your browser visit the domain address you chosed and you will be presented with a form to fill.

On this form on **"Create an admin account"** you should chose a **username** and **password** for your admin account. And on **"Configure Database"** you should fill it with the **username**, **password** and **database name** you chosed above.

After you fill the form just click on `Finish setup` and wait for the installation to complete. At the end you'll be redirected to your Nextcloud!

### Enable Caching

Nextcloud can be very slow if you don’t configure a caching solution. I'll now cover two of them:
+ **PHP OPcache**: a PHP inbuilt cache solution that speeds up scripts execution;
+ **Redis Server**: a fast in-memory key-value store that speeds up everything in NextCloud.

To install **OPcache**, go back to your terminal and run the following commands:
```plain
# sudo apt update
# sudo apt install php7.4-opcache
```

Then you need to edit a file named **10-opcache.ini**. To do so, run:
```plain
# sudo nano /etc/php/7.4/fpm/conf.d/10-opcache.ini
```

Add the missing lines to the file so it look like this:
```php
; configuration for php opcache module
; priority=10
zend_extension=opcache.so
opcache.enable=1
opcache.enable_cli=1
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=10000
opcache.memory_consumption=128
opcache.save_comments=1
opcache.revalidate_freq=1
```

To install **Redis Server**, run:
```plain
# sudo apt install redis-server php-redis
```

Now you need to configure Nextcloud to use Redis. To do so you need to edit the Nextcloud configuration file:
```plain
# sudo nano /var/www/nextcloud/config/config.php
```

Add the following lines just bellow `'installed' => true,`:
```php
'memcache.locking' => '\OC\Memcache\Redis',
'memcache.distributed' => '\OC\Memcache\Redis',
'memcache.local' => '\OC\Memcache\Redis',
'redis' => [
    'host' => 'localhost',
    'port' => 6379,
    'timeout' => 3,
],
```

For this changes to take effect you need to restart PHP:
```plain
# sudo systemctl restart php7.4-fpm
```

#### Congratulations :tada:

You now have your self-hosted cloud storage solution and are one step closer to [be the owner of your data](/be-the-owner-of-your-data-with-nextcloud/)!

{{< call-for-contribution >}}