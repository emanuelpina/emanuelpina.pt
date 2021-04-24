---
title: "Nextcloud 21 Installation on Ubuntu"
date: 2020-01-26T14:41:14+01:00
publishDate: 2021-04-24T19:23:13+01:00
draft: false
thumbnail: v1567799486/2019/nextcloud.png
categories: [SysAdmin]
tags: [Nextcloud, Ubuntu, VPS]
readmore: "Read the tutorial"
summarize: true
update: With the release of the first update to [Nextcloud 21](https://nextcloud.com/blog/first-21-update-is-out-as-are-minor-20-and-19-releases/), I decided to rewrite this tutorial to reflect its instalation
aliases:
    - /nextcloud-18-installation-on-ubuntu/
    - /nextcloud-20-installation-on-ubuntu/
---

Finally, I'll now cover the installation of Nextcloud on Ubuntu!

At this point, is expected that you already had:
+ Choose a VPS provider and [concluded the initial setup of your Ubuntu server](/ubuntu-server-initial-setup/);
+ Installed [Nginx](/nginx-installation-on-ubuntu/);
+ Installed [PostgreSQL](/postgresql-installation-on-ubuntu/);
+ Installed [PHP 7.4](/php-installation-on-ubuntu/).

I'm currently using Ubuntu 20.04, but these instructions are equally valid for other Ubuntu versions.

<!--more-->

### Download Nextcloud 21

To download Nextcloud 21, change into the `/tmp` folder, to keep things clean, and use `wget` to download the archive:
```plain
# cd /tmp
# wget https://download.nextcloud.com/server/releases/nextcloud-21.0.1.zip
```

With the archive downloaded, now unzip it. We’ll also attempt to install `unzip`, in case you don’t have it installed already. The `-d` switch specifies the target directory, so the archive will be extracted to `/var/www/nextcloud`:
```plain
# sudo apt install unzip
# sudo unzip nextcloud-21.0.1.zip -d /var/www
```

Now you’ll have to change the owner of `/var/www/nextcloud` so Nginx can write to it:
```plain
# sudo chown www-data:www-data /var/www/nextcloud -R
```

### Install PHP Required Modules

Beyond the ones we [installed previously](/php-installation-on-ubuntu/#install-php), Nextcloud requires some additional PHP modules. To install them, run the following command:
```plain
# sudo apt install php7.4-curl php7.4-dom php7.4-gd php7.4-mbstring php7.4-simplexml php7.4-xmlreader php7.4-xmlwriter php7.4-zip php7.4-bz2 php7.4-intl php7.4-ldap  php7.4-imap php7.4-bcmath php7.4-gmp php7.4-apcu php7.4-imagick
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
    add_header Strict-Transport-Security            "max-age=31536000; includeSubDomains"   always;

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
    add_header Referrer-Policy                      "no-referrer"           always;
    add_header X-Content-Type-Options               "nosniff"               always;
    add_header X-Download-Options                   "noopen"                always;
    add_header X-Frame-Options                      "SAMEORIGIN"            always;
    add_header X-Permitted-Cross-Domain-Policies    "none"                  always;
    add_header X-Robots-Tag                         "none"                  always;
    add_header X-XSS-Protection                     "1; mode=block"         always;

    # Opt out of Google Chrome tracking everything you do.
    # Note: if you’re reading this, stop using Google Chrome.
    # It is ridiculous for web servers to essentially have to ask
    # “please do not violate the privacy of the people who are viewing
    # this site” with every request.
    # For more info, see: https://plausible.io/blog/google-floc
    add_header Permissions-Policy                   "interest-cohort=()"    always;

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

        location = /.well-known/carddav     { return 301 /remote.php/dav/; }
        location = /.well-known/caldav      { return 301 /remote.php/dav/; }
        # Anything else is dynamically handled by Nextcloud
        location ^~ /.well-known            { return 301 /index.php$uri; }

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

On this form on **"Create an admin account"** you should chose a **username** and **password** for your admin account. And on **"Configure Database"** you should fill it with the **username**, **password** and **database name** you defined [above](#create-user-and-database-for-nextcloud).

After you fill the form just click on `Finish setup` and wait for the installation to complete. At the end you'll be redirected to your Nextcloud!

### Enable Memory Caching

{{< marker yellow >}}Configuring memory caching is not required and you may safely ignore this section, however it can significantly improve the perfomance of your Nextcloud.{{< /marker >}} The recommend solutions to implement should be based on the size and propose of your Nextcloud. For a small instance with a single server the recommended configuration is APCu for local memcache and Redis for everything else:[^1]
+ **APCu**: an in-memory key-value store for PHP;
+ **Redis**: an excellent modern memcache to use for distributed caching, and as a key-value store for Transactional File Locking.

To install **APCu**, go back to your terminal and run the following commands:
```plain
# sudo apt install php-apcu
```

{{< box red >}}
APCu is disabled by default on CLI which could cause issues with Nextcloud’s cron jobs. Make sure you set `apc.enable_cli` to `1` on `/etc/php/7.4/cli/php.ini` or append `--define apc.enable_cli=1` to the cron job command.
{{< /box >}}

And to install **Redis**, run:
```plain
# sudo apt install redis-server php-redis
```

Then restart Nginx:
```plain
# sudo systemctl reload nginx
```

Now you need to configure Nextcloud to use both APCu and Redis. To do so let's edit the Nextcloud configuration file:
```plain
# sudo nano /var/www/nextcloud/config/config.php
```

And add the following lines just bellow `'installed' => true,`:
```php
'memcache.local' => '\OC\Memcache\APCu',
'memcache.locking' => '\OC\Memcache\Redis',
'memcache.distributed' => '\OC\Memcache\Redis',
'redis' => [
    'host' => 'localhost',
    'port' => 6379,
    'timeout' => 3,
],
```

That's it!

#### Congratulations :tada:

You now have your self-hosted cloud storage solution and are one step closer to [be the owner of your data](/be-the-owner-of-your-data-with-nextcloud/)!

{{< call-for-contribution >}}

[^1]: [Nextcloud documentation - Memory caching: Recommendations based on type of deployment](https://docs.nextcloud.com/server/21/admin_manual/configuration_server/caching_configuration.html?highlight=cache#recommendations-based-on-type-of-deployment)