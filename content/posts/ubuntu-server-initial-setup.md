---
title: "Debian Server Initial Setup"
date: 2019-09-18T12:03:48+01:00
draft: false
thumbnail: v1628426663/2021/debian-server.png
categories: [SysAdmin]
tags: [Debian, VPS]
readmore: "Read the tutorial"
tableofcontents: true
summarize: true
update: true
aliases:
  - /ubuntu-server-initial-setup/
---

This is the first of a series of posts that will cover from the deployment of a VPS up to the installation of Nextcloud. These are the kind of posts I will write mostly for future memory, but if they will be useful to you, even better. I'm not reinventing the wheel here, these are just the result of the sum of tutorials and lessons I keep learning.

On this post I will cover the use of SSH to connect to a server, the creation of a new user with administrative privileges and the setup of a firewall.

I’m currently using Debian 12, but these instructions may be equally valid for other versions of Debian and Ubuntu.

<!--more-->

## Update the system

Keeping our system updated is important not only, but mostly for security reasons. To do so, let's first update the package lists from the repositories:
```plain
# apt update
```

If an update is available a list is presented. To apply the update(s), run:
```plain
# apt upgrade -y
```

Don't forget to periodically run those commands and keep the system up-to-date!

## Use SSH

While managing our server, we'll spend a lot of time working on a terminal session and the safest way to connect to it is through SSH, or secure shell.

To do that we've to make use of an SSH key, which is a pair of encryption keys mathematically linked to each other: a private key and a public key. The public key is used to encrypt a message whereas the private key is used to decrypt it. There are several ways to generate an SSH key. Usually the SSH client we'll use is capable of doing it and that's probably the easiest way. For Windows, the most popular SSH client is [Putty](https://putty.org/), but I use [Termius](https://www.termius.com/). To know more on how to connect to a server using SSH, see [this tutorial from DigitalOcean](https://www.digitalocean.com/docs/droplets/how-to/connect-with-ssh/).

So, we'll keep our private key to ourself, to use with the SSH client, and install/copy the public key to our server. Almost any VPS provider nowadays have an option on their console that let's add our public SSH keys so we can chose to automatically add them upon server deployment. That's how I do it. But if you prefer to install/copy your SSH key only after the server deployment, see [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-debian-11).

Moving on, after creating a new Debian server there are a few configuration steps that we should take to increase security and usability.

## Create a new user

To first access our server we need to login as **root**.

> The **root** user is the administrative user in a Linux environment that has very broad privileges. Because of the heightened privileges of the root account, you are discouraged from using it on a regular basis. This is because part of the power inherent with the root account is the ability to make very destructive changes, even by accident. [^1]

So, our first step is to set up an alternative user account with a reduced scope of influence for day-to-day work.

On this example we will create a new user called **johndoe**, but you should replace it with a username of your choice:

```plain
# adduser johndoe
```

We'll be asked to set up a password and some information. Enter a strong one and, optionally, fill in any of the additional information if you would like. This is not required and you can just hit `ENTER` in any field you wish to skip.

### Grant administrative privileges

To grant administrative privileges to the new user we need to add it to **sudo** group:
```plain
# usermod -aG sudo johndoe
```

### Copy SSH key to a new user
Next you've to copy the public SSH key from **root** user to the new user. This way you can login as both using the same SSH key. The simplest way to copy the files with the correct ownership and permissions is with the `rsync` command. This will copy the **root** user’s `.ssh` directory, preserve the permissions, and modify the file owners, all in a single command:
```plain
# rsync --archive --chown=johndoe:johndoe ~/.ssh /home/johndoe
```

Now we can login with our new user account typping:
```plain
# sudo -i -u johndoe
```

We should be logged in to the new user account without using a password. Remember, if you need to run a command with administrative privileges, type `sudo` before it like this:
```plain
# sudo command_to_run
```

You will be prompted for your regular user password when using `sudo` for the first time each session.

## Setup a firewall
You can use UFW (Uncomplicated Firewall) to manage which connections are allowed to/from the server.

So, let's update the package lists from the repositories and install UFW:
```plain
# sudo apt update
# sudo apt install ufw
```

Different applications can register their profiles with UFW upon installation. These profiles allow UFW to manage these applications by name. OpenSSH, the service allowing us to connect to our server now, has a profile registered with UFW.

You can see this by typing:
```plain
# sudo ufw app list
```
```plain
Available applications:
  OpenSSH
```

We need to make sure that the firewall allows SSH connections so that we can log back in next time. We can allow these connections by typing:
```plain
# sudo ufw allow OpenSSH
```

Afterwards, we can enable the firewall by typing:
```plain
# sudo ufw enable
```
Type `y` and press ENTER to proceed. We can see that SSH connections are still allowed by typing:

```plain
# sudo ufw status
```
```plain
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
```

## What's next?

Now that we've completed the initial configuration of our server, we can proceed with the installation of a webserver to present it to the vast and incredible world wide web!

In a following post I will cover the [installation of Nginx](/nginx-installation-on-debian/).

{{< call-for-contribution >}}

[^1]: [Initial Server Setup with Debian 11](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-debian-11)
