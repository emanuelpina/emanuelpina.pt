---
title: "Nginx Installation on Ubuntu"
date: 2019-10-05T03:45:57+01:00
draft: false
thumbnail: v1570238190/2019/nginx_webserver.jpg
categories: [SysAdmin]
tags: [Nginx, Ubuntu, VPS]
readmore: "Read the tutorial"
summarize: true
---

This is the second post on the road to self-host Nextcloud. At this point we have already [choosed a provider and deployed a VPS](https://emanuelpina.pt/how-i-ended-up-with-vultr-to-self-host-nextcloud/) and [completed its initial setup](https://emanuelpina.pt/ubuntu-server-initial-setup/).

Now, we're going to cover the installation of Nginx, the use of Let's Encrypt SSL certificates and the configuration of the web server to use HTTP Strict Transport Security (HSTS) and TLS 1.3.

I’m currently using Ubuntu 18.04, but these instructions are equally valid for other Ubuntu versions.

<!--more-->

### Install Nginx

First, let's update the package lists from the repositories:
```plain
# sudo apt update
```

Then, install Nginx:
```plain
# sudo apt install nginx
```

We can check if it’s working by typing:
```plain
# sudo systemctl status nginx
```

If all went well, we should get something like this:
```plain
● nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Fri 2019-10-04 17:40:28 UTC; 9s ago
     Docs: man:nginx(8)
 Main PID: 17673 (nginx)
    Tasks: 2 (limit: 1152)
   CGroup: /system.slice/nginx.service
           ├─17673 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
           └─17676 nginx: worker process
```

### Adjust the Firewall

Before using Nginx, the firewall needs to be adjusted to allow access to the service. Nginx registers itself as a service with **UFW** upon installation, making it straightforward to allow Nginx access.

List the application configurations that **UFW** knows how to work with by typing:
```plain
# sudo ufw app list
```

We get a listing of the application profiles, like this:
```plain
Available applications:
  Nginx Full
  Nginx HTTP
  Nginx HTTPS
  OpenSSH
```

As you can see, there are three profiles available for Nginx:

- **Nginx Full:** This profile opens both port 80 (normal, unencrypted web traffic) and port 443 (TLS/SSL encrypted traffic);
- **Nginx HTTP:** This profile opens only port 80 (normal, unencrypted web traffic);
- **Nginx HTTPS:** This profile opens only port 443 (TLS/SSL encrypted traffic).

We plan to use TLS/SSL so choose the profile **Nginx Full** to open both ports:
```plain
# sudo ufw allow 'Nginx Full'
```

Visiting our IP address on a browser will now show the Nginx's default page, like bellow.

![Nginx Default Page](https://img.mnlpn.xyz/c_fit,f_auto,q_auto,w_700/v1570212267/2019/nginx-installation-one.jpg)

### Set Up a Server Block

When using the Nginx web server, _server blocks_ can be used to encapsulate configuration details and host more than one domain from a single server. We will set up a domain called **emanuelpina.ml**, but you should **replace this with your own domain name**.

On this example the content of our site will be stored in the folder `/var/www/html`, change this to match your preferences.

Let's create a `index.html` file for our site using [Nano](https://help.ubuntu.com/community/Nano/) or your favorite editor:
```plain
# sudo nano /var/www/html/index.html
```

Add the following HTML to the file:
```html
<html>
    <head>
        <title>Welcome to EmanuelPina.ml!</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <p><b>The emanuelpina.ml server block is working!</b></p>
    </body>
</html>
```
Save and close the file when you are finished.

In order for Nginx to serve this content, we need to create a _server block_ with the correct directives. Instead of modifying the default configuration file directly, let’s make a new one. We will name it **emanuelpina.ml** but you can name it whatever you like:
```terimnal
# sudo nano /etc/nginx/sites-available/emanuelpina.ml
```

Paste in the following configuration block, which is similar to the default, but updated for our new directory and domain name:
```nginx
server {
    listen 80;
    listen [::]:80;

    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;

    server_name emanuelpina.ml www.emanuelpina.ml;

    location / {
            try_files $uri $uri/ =404;
    }
}
```
Notice that we’ve updated the **root** configuration to our site directory, and the **server_name** to our domain name.

Next, let’s enable the site by creating a link from this file to the `sites-enabled` directory, which Nginx reads from during startup:
```terimnal
# sudo ln -s /etc/nginx/sites-available/emanuelpina.ml /etc/nginx/sites-enabled/
```

Then, test to make sure that there are no syntax errors in the Nginx files:
```plain
# sudo nginx -t
```

If there aren’t any problems, restart Nginx to enable our changes:
```plain
# sudo systemctl reload nginx
```

Visiting our domain address on a browser will now show the content of the `index.html` file we have created.

![Our index.html Page](https://img.mnlpn.xyz/c_fit,f_auto,q_auto,w_700/v1570214982/2019/nginx-installation-two.jpg)

### Enable SSL

At this point we have set Nginx to serve our site, but notice that the browser is connecting to our server through a unencrypted/non-secure connection.

![Non-secure Connection](https://img.mnlpn.xyz/c_fit,f_auto,q_auto,w_700/v1570216401/2019/nginx-installation-three.jpg)

To enable the browser to use a encrypted/secure connection we have to install an SSL certificate. We can obtain free SSL certificates using Let’s Encrypt. To easily do this we can use a open source software called [Certbot](https://certbot.eff.org/about/). To install Certbot and its Nginx package run the following command:
```plain
# sudo apt install certbot python-certbot-nginx
```

We can now use Certbot to obtaining an SSL certificate typing:
```plain
# sudo certbot --nginx
```

If this is your first time running Certbot, you will be prompted to enter an email address, agree to the terms of service and authorise or not EEF (the entity that mantains Certbot) to send emails to you.

We will then be presented with a list of all domains enabled on our server:
```plain
Which names would you like to activate HTTPS for?
-------------------------------------------------------------------------------
1: emanuelpina.ml
2: www.emanuelpina.ml
-------------------------------------------------------------------------------
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel):
```

Select the appropriate numbers for the domains you want to obtain a certificate separated with a `,` (for our example type `1,2`) and press `ENTER`. After doing so, Certbot will communicate with the Let’s Encrypt server, then run a challenge to verify that we control the domain we’re requesting a certificate for.

If that’s successful, Certbot will ask how we’d like to configure our HTTPS settings:
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

Now, visiting our domain address on a browser we can notice that a encrypted/secure connection is being used.

![Secure Connection](https://img.mnlpn.xyz/c_fit,f_auto,q_auto,w_700/v1570216401/2019/nginx-installation-four.jpg)

### Enable HSTS

Let's run our domain on [this SSL Server Test](https://www.ssllabs.com/ssltest/) from SSL Labs. The test takes a couple of minutes...

![SSL Labs First Test Result](https://img.mnlpn.xyz/c_fit,f_auto,q_auto,w_700/v1570216401/2019/nginx-installation-five.jpg)


We got an **A**. Not bad, but [we can do better](https://invidio.us/watch?v=m-lSlJc_5NE/)! To do so we will enable HSTS and TLS 1.3.

HSTS stands for [HTTP Strict Transport Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security/) and is a response header that informs the browser that it should never load a site using HTTP and should automatically convert all attempts to access it to HTTPS requests instead.

Enabling HSTS is as easy as editting our _server block_:
```plain
# sudo nano /etc/nginx/sites-availabe/emanuelpina.ml
```

And adding `add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;` just bellow the **server_name**, like this:
```nginx {hl_lines=[6]}
server {
    ###
    				
    server_name emanuelpina.ml www.emanuelpina.ml;
				
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    ###		
}
```

Test to make sure that there are no syntax errors in the Nginx files:
```plain
# sudo nginx -t
```

And if there aren’t any problems, restart Nginx to enable our changes:
```plain
# sudo systemctl reload nginx
```

### Enable TLS 1.3

TLS stands for Transport Layer Security and provides secure communication between web browsers and servers. The final version of its most recent update (1.3) was published on August 2018 with [enhanced security and improved speed](https://kinsta.com/blog/tls-1-3/#tls-1.3-vs-tls-1.2/). Since then it has been increasingly adopted as it will be the standard for the years to come.

To enable TLS 1.3 we need to make a few changes both in `nginx.conf` and `options-ssl-nginx.conf` files.

Let's start with `nginx.conf` typing:
```plain
# sudo nano /etc/nginx/nginx.conf
```

Find the line `ssl_protocols TLSv1 TLSv1.1 TLSv1.2;` and replace it with:
```plain
ssl_protocols TLSv1.2 TLSv1.3;
```

Then, if not already present, add the following line:
```plain
ssl_prefer_server_ciphers on;
```

Finally, we have to add the cipher suite. I use the following, recommended by Stanislas Lange [^1]:
```plain
ssl_ciphers TLS13-CHACHA20-POLY1305-SHA256:TLS13-AES-256-GCM-SHA384:TLS13-AES-128-GCM-SHA256:EECDH+CHACHA20:EECDH+AESGCM:EECDH+AES;
```

At the end, our changes will look like this:
```nginx
http {
    ###
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers TLS13-CHACHA20-POLY1305-SHA256:TLS13-AES-256-GCM-SHA384:TLS13-AES-128-GCM-SHA256:EECDH+CHACHA20:EECDH+AESGCM:EECDH+AES;

    ###
}
```
Save and close the file when you are finished.

As we are usign Let's Encrypt SSL certificates we need to make the exact same changes on `options-ssl-nginx.conf`. To edit that file run:
```plain
# sudo nano /etc/letsencrypt/options-ssl-nginx.conf
```
Make the changes as above. Save and close the file when you are finished.

At last, test to make sure that there are no syntax errors in our Nginx files:
```plain
# sudo nginx -t
```

And if there aren’t any problems, restart Nginx to enable our changes:
```plain
# sudo systemctl reload nginx
```

Now let's run again the [SSL Server Test](https://www.ssllabs.com/ssltest/) from SSL Labs.

![SSL Labs Final Test Result](https://img.mnlpn.xyz/c_fit,f_auto,q_auto,w_700/v1570219492/2019/nginx-installation-six.jpg)

And that's it. TLS 1.3 and HSTS are enabled and we got an **A+**!

### What's next?

Now that we have connected our server to the Internet, to run Nextcloud we still need PHP and PostgreSQL. That's what I'll cover in a following post.

{{< call-for-contribution >}}

[^1]: [How to enable TLS 1.3 on Nginx](https://angristan.xyz/how-to-enable-tls-13-nginx/) 