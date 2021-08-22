---
title: "Nextcloud 22 Installation on Debian"
date: 2020-01-26T14:41:14+01:00
publishDate: 2021-08-14T16:03:13+01:00
draft: false
thumbnail: v1567799486/2019/nextcloud.png
categories: [SysAdmin]
tags: [Nextcloud, Debian, VPS]
readmore: "Read the tutorial"
tableofcontents: true
summarize: true
update: With the release of [Debian 11](https://www.debian.org/releases/bullseye/releasenotes), I decided to rewrite this tutorial to reflect the instalation of [Nextcloud 22](https://nextcloud.com/blog/nextcloud-hub-22-introduces-approval-workflows-integrated-knowledge-management-and-decentralized-group-administration/) on it. Now including instructions to some additional configurations.
aliases:
    - /nextcloud-18-installation-on-ubuntu/
    - /nextcloud-20-installation-on-ubuntu/
    - /nextcloud-21-installation-on-ubuntu/
---

Finally, I'll now cover the installation of Nextcloud on Debian!

At this point, is expected that you already had:
+ Choose a VPS provider and [concluded the initial setup of your Debian server](/debian-server-initial-setup/);
+ Installed [Nginx](/nginx-installation-on-debian/);
+ Installed [PostgreSQL](/postgresql-installation-on-debian/);
+ Installed [PHP 7.4](/php-installation-on-debian/).

I’m currently using Debian 11, but these instructions may be equally valid for other versions of Debian and Ubuntu.

<!--more-->

## Download Nextcloud 22

To download Nextcloud 22, change into the `/tmp` folder, to keep things clean, and use `wget` to download the archive:
```plain
# cd /tmp
# wget https://download.nextcloud.com/server/releases/nextcloud-22.1.0.zip
```

With the archive downloaded, now unzip it. We’ll also attempt to install `unzip`, in case we don’t have it installed already. The `-d` switch specifies the target directory, so the archive will be extracted to `/var/www/nextcloud`:
```plain
# sudo apt install unzip
# sudo unzip nextcloud-22.1.0.zip -d /var/www
```

Now we’ll have to change the owner of `/var/www/nextcloud` so Nginx can write to it:
```plain
# sudo chown www-data:www-data /var/www/nextcloud -R
```

## Install PHP Required Modules

Beyond the ones we [installed previously](/php-installation-on-debian/#install-php), Nextcloud requires some additional PHP modules. To install them, run the following command:
```plain
# sudo apt install php7.4-curl php7.4-dom php7.4-gd php7.4-mbstring php7.4-simplexml php7.4-xmlreader php7.4-xmlwriter php7.4-zip php7.4-bz2 php7.4-intl php7.4-ldap php7.4-imap php7.4-bcmath php7.4-gmp php7.4-imagick
```

### Configure PHP

To meet the requirements of Nextcloud we need to make some changes in PHP configuration. The first one is changing the `memory_limit`. This setting is in **php.ini**, we can edit it running:
```plain
# sudo nano /etc/php/7.4/fpm/php.ini
```

Search for `memory_limit` and change it to `512M`.

{{< marker yellow p >}}Once we're editing **php.ini** you can take the opportunity to set [upload_max_filesize](https://www.php.net/manual/en/ini.core.php#ini.upload-max-filesize) and [post_max_size](https://www.php.net/manual/en/ini.core.php#ini.post-max-size) according to your preferences.{{< /marker >}}

Another thing is that as we're using `php-fpm`, system environment variables like PATH, TMP or others are not automatically populated. A PHP call like `getenv('PATH');` can therefore return an empty result. So we need to manually configure the environment variables in **www.conf**. To edit this file run:
```plain
# sudo nano /etc/php/7.4/fpm/pool.d/www.conf
```

Usually, near the bottom of the file, we will find some or all of the environment variables already, but commented out like this:
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

## Create PostgreSQL User and Database

To create a user and database for Nextcloud we first need to login to PostgreSQL prompt:
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

## Configure Nginx

We'll now create a Nginx _server block_ to nextcloud. I'm naming it **nextcloud** but you can name it whatever you like:
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

Once created, to enable the _server block_ we need to create a symbolic link of it into `/etc/nginx/sites-enabled/` using the following command:
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

### Enable SSL

We can use `certbot` to obtain a Let's Encrypt SSL certificate to our Nextcloud. If you didn't already, install it as its Nginx package running the following command:
```plain
# sudo apt install certbot python3-certbot-nginx
```

Then to use Certbot, run:
```plain
# sudo certbot --nginx
```

At our first time running Certbot, we'll be prompted to enter an email address, agree to the terms of service and authorise or not EEF (the entity that mantains Certbot) to send emails to us.

We'll then be presented with a list of all domains enabled on our server:
```plain
Which names would you like to activate HTTPS for?
-------------------------------------------------------------------------------
1: box.emanuelpina.ml
-------------------------------------------------------------------------------
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel):
```

Select the appropriate number for the domain you want to obtain a certificate (for our example type `1`) and press `ENTER`. After doing so, Certbot will communicate with the Let’s Encrypt server, then run a challenge to verify that we control the domain we’re requesting a certificate for.

If that’s successful, Certbot will finish with a message like below. {{< marker yellow >}}Look at **IMPORTANT NOTES** and save the locations of both the certificate and key{{< /marker >}}.

```plain {hl_lines=["6-9"]}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations! You have successfully enabled https://box.emanuelpina.ml
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

And replace its content with the following code. {{< marker yellow >}}Don't forget to change the *server_name* from **box.emanuelpina.ml** to the domain address you want and **update the locations to the SSL certificate and key**{{< /marker >}}:

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
        # The rules in this block are an adaptation of the rules
        # in `.htaccess` that concern `/.well-known`.

        location = /.well-known/carddav { return 301 /remote.php/dav/; }
        location = /.well-known/caldav  { return 301 /remote.php/dav/; }

        location /.well-known/acme-challenge    { try_files $uri $uri/ =404; }
        location /.well-known/pki-validation    { try_files $uri $uri/ =404; }

        # Let Nextcloud's API for `/.well-known` URIs handle all other
        # requests by passing them to the front-end controller.
        return 301 /index.php$request_uri;
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

## Complete Installation

Now, to complete Nextcloud installation, in a browser visit the domain address you chosed and you will be presented with a form to fill.

On this form on **"Create an admin account"** we should chose a **username** and **password** for our admin account. And on **"Configure Database"** we should fill it with the **username**, **password** and **database name** defined [above](#create-user-and-database-for-nextcloud).

After filling the form just click on `Finish setup` and wait for the installation to complete. At the end we'll be redirected to our dashboard.

And that's it! Our Nextcloud installation is ready for use.

## Additional configurations

Following we'll look at some additional configurations that despite being optional, are advisable.

### Memory Caching

Enabling memory caching can significantly improve the perfomance of your Nextcloud. The recommend solutions to implement should be based on the size and propose of our Nextcloud. For a small instance with a single server the recommended configuration is APCu for local memcache and Redis for everything else:[^1]
+ **APCu**: an in-memory key-value store for PHP;
+ **Redis**: an excellent modern memcache to use for distributed caching, and as a key-value store for Transactional File Locking.

To install **APCu**, go back to your terminal and run the following commands:
```plain
# sudo apt install php-apcu
```

{{< box red >}}
APCu is disabled by default on CLI which could cause issues with Nextcloud’s cron jobs. Make sure to set `apc.enable_cli` to `1` on `/etc/php/7.4/cli/php.ini` or append `--define apc.enable_cli=1` to the cron job command.
{{< /box >}}

And to install **Redis**, run:
```plain
# sudo apt install redis-server php-redis
```

Then restart Nginx:
```plain
# sudo systemctl reload nginx
```

Now we need to configure Nextcloud to use both APCu and Redis. To do so let's edit the Nextcloud configuration file:
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
],
```

### Background jobs

A system like Nextcloud sometimes requires tasks to be done on a regular basis without the need for user interaction or hindering Nextcloud performance. For that purpose, we can define background jobs. These jobs are typically referred to as *cron jobs*.

Cron jobs are commands or shell-based scripts that are scheduled to run periodically at fixed times, dates, or intervals. `cron.php` is a Nextcloud internal process that runs such background jobs on demand.

We can schedule cron jobs in three ways – using AJAX, Webcron, or cron. The default method is to use AJAX. However, **the recommended method is to use the operating system cron feature**.[^2]

To run a cron job on our system, every 5 minutes, under the default Web server user, we must set up the following cron job to call the `cron.php` script.

Edit the crontab of the default Web server user (`www-data`):
```plain
# sudo crontab -u www-data -e
```

And append the following line, replacing the path `/var/www/nextcloud/cron.php` with the path to your current Nextcloud installation:

```plain
*/5  *  *  *  * php -f /var/www/nextcloud/cron.php
```

We can verify if the cron job has been added and scheduled running:
```plain
# sudo crontab -u www-data -l
```

Finally, choose `Cron` in the *Background jobs* section of the *Admin settings* page at `Setting > Administration > Basic settings > Background jobs`.

### Previews generation

By default, Nextcloud thumbnail system generates previews of files for the following filetypes:

- Images files;
- Cover of MP3 files;
- Text documents.

Additional, we can add support for SVG and video files, installing those packages:
```plain
# sudo apt install libmagickcore-6.q16-6-extra ffmpeg
```

To add support for PDF files, we must install `ghostscript`:
```plain
# sudo apt install ghostscript
```

And tweak ImageMagick's security policy:
```plain
# sudo nano /etc/ImageMagick-6/policy.xml
```

Look for `<policy domain="coder" rights="none" pattern="PDF" />` at the end of the file. And comment the line, so it look like:
```plain
...
<!-- <policy domain="coder" rights="none" pattern="PDF" /> -->
...
```

The generation of previews can use a fair amount of hardware resources and can degrade our experience when using Nextcloud. We can prevent that, using an app called **Preview Generator** and setting a cron job that runs periodically on the background and generates previews for new or recently changed files.

To do so, first run the following commands to install and enable the app, where `/var/www/nextcloud/` is the path to our Nextcloud installation:
```plain
# sudo -u www-data php /var/www/nextcloud/occ app:install previewgenerator
# sudo -u www-data php /var/www/nextcloud/occ app:enable previewgenerator
```

To set for which filetypes Nextcloud should generate previews, edit the Nextcloud configuration file:
```plain
# sudo nano /var/www/nextcloud/config/config.php
```

And add the following lines just bellow `'installed' => true,`:
```php
'enable_previews' => true,
'enabledPreviewProviders' => 
array (
    0 => 'OC\\Preview\\PNG',
    1 => 'OC\\Preview\\JPEG',
    2 => 'OC\\Preview\\GIF',
    3 => 'OC\\Preview\\HEIC',
    4 => 'OC\\Preview\\BMP',
    5 => 'OC\\Preview\\XBitmap',
    6 => 'OC\\Preview\\MP3',
    7 => 'OC\\Preview\\TXT',
    8 => 'OC\\Preview\\MarkDown',
    9 => 'OC\\Preview\\Movie',
    10 => 'OC\\Preview\\MKV',
    11 => 'OC\\Preview\\MP4',
    12 => 'OC\\Preview\\AVI',
    13 => 'OC\\Preview\\PDF',
),
```

Then, before setting a cron job, we should generate all previews running:
```plain
# sudo -u www-data php /var/www/nextcloud/occ preview:generate-all -vvv
```

We can now edit the crontab of the default Web server user (`www-data`):
```plain
# sudo crontab -u www-data -e
```

And add a cron job that will run the application each 10 minutes:
```plain
*/10 *  *  *  * php /var/www/nextcloud/occ preview:pre-generate
```

### Email

Nextcloud is capable of sending password reset emails, notifying users of new file shares, changes in files, and activity notifications.

Nextcloud does not contain a full email server, but rather connects to your existing mail server, and supports three types of connections: SMTP, qmail, and Sendmail.

I recommend using a SMTP server, more precisely a SMTP relay, like [Mailgun](https://www.mailgun.com/).

To connect Nextcloud to a remote SMTP server, we need the following information:

- Encryption type: None, SSL/TLS, or STARTTLS;
- The From address we want our outgoing Nextcloud mails to use;
- Whether authentication is required;
- Authentication method: None, Login, Plain, or NT LAN Manager;
- The server’s IP address or fully-qualified domain name and the SMTP port;
- Login credentials (if required).

Having this information we can then fill the configuration wizzard in the *Email Server* section of the *Admin settings* page at `Setting > Administration > Basic settings > Email server`.

### Default phone region

Since Nextcloud 21, is recommend setting a default region for phone numbers, using [ISO 3166-1 country codes](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements) such as `DE` for Germany, `FR` for France, `PT` for Portugal... It is required to allow inserting phone numbers in the user profiles starting without the country code (e.g. +351 for Portugal).

We can do that by editing the Nextcloud configuration file:
```plain
# sudo nano /var/www/nextcloud/config/config.php
```

And adding the following line, just bellow `'installed' => true,`, changing the value to correspond to your country:
```php
'default_phone_region' => 'PT',
```

#### Congratulations :tada:

You now have your self-hosted cloud storage solution and are one step closer to [be the owner of your data](/be-the-owner-of-your-data-with-nextcloud/)!

{{< call-for-contribution >}}

[^1]: [Nextcloud documentation - Memory caching: Recommendations based on type of deployment](https://docs.nextcloud.com/server/stable/admin_manual/configuration_server/caching_configuration.html#recommendations-based-on-type-of-deployment)

[^2]: [Nextcloud documentation - Background jobs: Cron jobs](https://docs.nextcloud.com/server/stable/admin_manual/configuration_server/background_jobs_configuration.html#cron-jobs)