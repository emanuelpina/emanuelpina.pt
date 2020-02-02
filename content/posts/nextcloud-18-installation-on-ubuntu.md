---
title: "Nextcloud 18 Installation on Ubuntu"
date: 2020-01-26T14:41:14Z
draft: false
thumbnail: v1567799486/2019/nextcloud.png
categories: [SysAdmin]
tags: [Nextcloud, Ubuntu, VPS]
readmore: "Read the tutorial"
summarize: true
---

Finally, I'll now cover the installation of Nextcloud on Ubuntu!

At this point, is expected that you already had:
+ Choose a VPS provider and [concluded the initial setup of your Ubuntu server](/ubuntu-server-initial-setup/);
+ Installed [Nginx](/nginx-installation-on-ubuntu/);
+ Installed [PostgreSQL](/postgresql-installation-on-ubuntu/);
+ Installed [PHP 7.3](/php-installation-on-ubuntu/).

I'm currently using Ubuntu 18.04, but these instructions are equally valid for other Ubuntu versions.

<!--more-->

### Download Nextcloud 18

To download Nextcloud 18 on your Ubuntu 18.04 server, change into the `/tmp` folder, to keep things clean, and use `wget` to download the archive:
```plain
# cd /tmp
# wget https://download.nextcloud.com/server/releases/nextcloud-18.0.0.zip
```

With the archive downloaded, now unzip it. We’ll also attempt to install `unzip`, in case you don’t have it installed already. The `-d` switch specifies the target directory, so the archive will be extracted to `/var/www/nextcloud`:
```plain
# sudo apt install unzip
# sudo unzip nextcloud-18.0.0.zip -d /var/www
```

Now you’ll have to change the owner of `/var/www/nextcloud` so Nginx can write to it:
```plain
# sudo chown www-data:www-data /var/www/nextcloud -R
```

### Install PHP Required Modules

Beyond the ones we [installed previously](/php-installation-on-ubuntu/#install-php), Nextcloud requires some additional PHP modules. To install them, run the following command:
```plain
# sudo apt install php-imagick php7.3-common php7.3-gd php7.3-json php7.3-curl php7.3-zip php7.3-xml php7.3-mbstring php7.3-bz2 php7.3-intl
```

### Configure PHP

To meet the requirements of Nextcloud you need to make some changes in PHP cofiguration. The first one is changing the `memory_limit`. This setting is in **php.ini**, you can edit it running:
```plain
# sudo nano /etc/php/7.3/fpm/php.ini
```

Search for `memory_limit` and change it to `512M`.

{{< marker yellow p >}}Once you're editing **php.ini** you can take the opportunity to set [upload_max_filesize](https://www.php.net/manual/en/ini.core.php#ini.upload-max-filesize) and [post_max_size](https://www.php.net/manual/en/ini.core.php#ini.post-max-size) according to your preferences.{{< /marker >}}

Another thing is that as we're using `php-fpm`, system environment variables like PATH, TMP or others are not automatically populated. A PHP call like `getenv('PATH');` can therefore return an empty result. So you need to manually configure the environment variables in **www.conf**. To edit this file run:
```plain
# sudo nano /etc/php/7.3/fpm/pool.d/www.conf
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
# sudo systemctl restart php7.3-fpm
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
upstream php-handler {
    #server 127.0.0.1:9000;
    server unix:/var/run/php/php7.3-fpm.sock;
}

server {
    listen 80;
    listen [::]:80;
    server_name box.emanuelpina.ml;
    # enforce https
    return 301 https://$server_name:443$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name box.emanuelpina.ml;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!MEDIUM:!LOW:!aNULL:!NULL:!SHA;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;

    # Add headers to serve security related headers
    # Before enabling Strict-Transport-Security headers please read into this
    # topic first.
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # WARNING: Only add the preload option once you read about
    # the consequences in https://hstspreload.org/. This option
    # will add the domain to a hardcoded list that is shipped
    # in all major browsers and getting removed from this list
    # could take several months.
    add_header Referrer-Policy "no-referrer" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Download-Options "noopen" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Permitted-Cross-Domain-Policies "none" always;
    add_header X-Robots-Tag "none" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Remove X-Powered-By, which is an information leak
    fastcgi_hide_header X-Powered-By;

    # Path to the root of your installation
    root /var/www/nextcloud;

    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }

    # The following 2 rules are only needed for the user_webfinger app.
    # Uncomment it if you're planning to use this app.
    #rewrite ^/.well-known/host-meta /public.php?service=host-meta last;
    #rewrite ^/.well-known/host-meta.json /public.php?service=host-meta-json last;

    # The following rule is only needed for the Social app.
    # Uncomment it if you're planning to use this app.
    #rewrite ^/.well-known/webfinger /public.php?service=webfinger last;

    location = /.well-known/carddav {
      return 301 $scheme://$host:$server_port/remote.php/dav;
    }
    location = /.well-known/caldav {
      return 301 $scheme://$host:$server_port/remote.php/dav;
    }

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

    # Uncomment if your server is build with the ngx_pagespeed module
    # This module is currently not supported.
    #pagespeed off;

    location / {
        rewrite ^ /index.php;
    }

    location ~ ^\/(?:build|tests|config|lib|3rdparty|templates|data)\/ {
        deny all;
    }
    location ~ ^\/(?:\.|autotest|occ|issue|indie|db_|console) {
        deny all;
    }

    location ~ ^\/(?:index|remote|public|cron|core\/ajax\/update|status|ocs\/v[12]|updater\/.+|oc[ms]-provider\/.+)\.php(?:$|\/) {
        fastcgi_split_path_info ^(.+?\.php)(\/.*|)$;
        set $path_info $fastcgi_path_info;
        try_files $fastcgi_script_name =404;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $path_info;
        fastcgi_param HTTPS on;
        # Avoid sending the security headers twice
        fastcgi_param modHeadersAvailable true;
        # Enable pretty urls
        fastcgi_param front_controller_active true;
        fastcgi_pass php-handler;
        fastcgi_intercept_errors on;
        fastcgi_request_buffering off;
    }

    location ~ ^\/(?:updater|oc[ms]-provider)(?:$|\/) {
        try_files $uri/ =404;
        index index.php;
    }

    # Adding the cache control header for js, css and map files
    # Make sure it is BELOW the PHP block
    location ~ \.(?:css|js|woff2?|svg|gif|map)$ {
        try_files $uri /index.php$request_uri;
        add_header Cache-Control "public, max-age=15778463";
        # Add headers to serve security related headers (It is intended to
        # have those duplicated to the ones above)
        # Before enabling Strict-Transport-Security headers please read into
        # this topic first.
        #add_header Strict-Transport-Security "max-age=15768000; includeSubDomains; preload;" always;
        #
        # WARNING: Only add the preload option once you read about
        # the consequences in https://hstspreload.org/. This option
        # will add the domain to a hardcoded list that is shipped
        # in all major browsers and getting removed from this list
        # could take several months.
        add_header Referrer-Policy "no-referrer" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Download-Options "noopen" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Permitted-Cross-Domain-Policies "none" always;
        add_header X-Robots-Tag "none" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # Optional: Don't log access to assets
        access_log off;
    }

    location ~ \.(?:png|html|ttf|ico|jpg|jpeg|bcmap)$ {
        try_files $uri /index.php$request_uri;
        # Optional: Don't log access to other assets
        access_log off;
    }
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

You can use `certbot` to obtain a Let's Encrypt SSL certificate to your Nextcloud. To install it as its Nginx package run the following command:
```plain
# sudo apt install certbot python-certbot-nginx
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

Type `2` and press `ENTER` to make all requests redirect to secure HTTPS access. The _server block_ will be updated, and Nginx will reload to pick up the new settings.

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
# sudo apt install php7.3-opcache
```

Then you need to edit a file named **10-opcache.ini**. To do so, run:
```plain
# sudo nano /etc/php/7.3/fpm/conf.d/10-opcache.ini
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
# sudo systemctl restart php7.3-fpm
```

#### Congratulations :tada:

You now have your self-hosted cloud storage solution and are one step closer to [be the owner of your data](/be-the-owner-of-your-data-with-nextcloud/)!

{{< call-for-contribution >}}