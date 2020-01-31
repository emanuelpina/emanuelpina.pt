---
title: "Ubuntu Server Initial Setup"
date: 2019-09-18T12:03:48+01:00
draft: false
thumbnail: v1568845837/2019/data-center-ubuntu.jpg
categories: [SysAdmin]
tags: [Ubuntu, VPS]
readmore: "Read the tutorial"
summarize: true
---

This is the first in a series of posts that will cover from the deployment of a VPS up to the installation of Nextcloud. These are the kind of posts I will write mostly for future memory, but if they will be useful to you, even better. I'm not reinventing the wheel here, these are just the result of the sum of tutorials and lessons I keep learning.

On this post I will cover the use of SSH to connect to a server, the creation of a new user with administrative privileges and the setup of a firewall.

I'm currently using Ubuntu 18.04, but these instructions are equally valid for other Ubuntu versions.

<!--more-->

### Use SSH

While managing your server, you'll spend a lot of time working on a terminal session and the safest way to connect to it is through SSH, or secure shell.

To do that you've to make use of an SSH key, which is a pair of encryption keys mathematically linked to each other: a private key and a public key. The public key is used to encrypt a message whereas the private key is used to decrypt it. There are several ways to generate an SSH key. Usually the SSH client you'll use is capable of doing it and that's probably the easiest way. For Windows, the most popular SSH client is [Putty](https://putty.org/), but I use [Termius](https://www.termius.com/). To know more on how to connect to a server using SSH, see [this tutorial from DigitalOcean](https://www.digitalocean.com/docs/droplets/how-to/connect-with-ssh/).

So, you'll keep your private key to yourself, to use with the SSH client, and install/copy the public key to your server. Almost any VPS provider nowdays have a option on their console that let's you add your public SSH keys so you can chose to automatically add them upon server deployment. That's how I do it. But if you prefer to install/copy your SSH key only after the server deployment, see [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-1804).

Moving on, after creating a new Ubuntu server there are a few configuration steps that you should take to increase security and usability.

### Create a new user

To first access your server we need to login as **root**.

> The **root** user is the administrative user in a Linux environment that has very broad privileges. Because of the heightened privileges of the root account, you are discouraged from using it on a regular basis. This is because part of the power inherent with the root account is the ability to make very destructive changes, even by accident. [^1]

So, your first step is to set up an alternative user account with a reduced scope of influence for day-to-day work.

On this example we will create a new user called **johndoe**, but you should replace it with a username of your choice:

```plain
# adduser johndoe
```

You'll be asked to set up a password and some information. Enter a strong one and, optionally, fill in any of the additional information if you would like. This is not required and you can just hit `ENTER` in any field you wish to skip.

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

Now you can login with your new user account typping:
```plain
# sudo -i -u johndoe
```

You should be logged in to the new user account without using a password. Remember, if you need to run a command with administrative privileges, type `sudo` before it like this:
```plain
# sudo command_to_run
```

You will be prompted for your regular user password when using `sudo` for the first time each session.

### Setup a firewall
You can use the built-in firewall (UFW) to manage which connections are allowed to/from the server.

Different applications can register their profiles with UFW upon installation. These profiles allow UFW to manage these applications by name. OpenSSH, the service allowing you to connect to your server now, has a profile registered with UFW.

You can see this by typing:
```plain
# sudo ufw app list
```
```plain
Available applications:
  OpenSSH
```

You need to make sure that the firewall allows SSH connections so that you can log back in next time. You can allow these connections by typing:
```plain
# sudo ufw allow OpenSSH
```

Afterwards, you can enable the firewall by typing:
```plain
# sudo ufw enable
```
Type `y` and press ENTER to proceed. You can see that SSH connections are still allowed by typing:

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

### What's next?

Now that you've completed the initial configuration of your server, you can proceed with the installation of a webserver to present it to the vast and incredible world wide web!

In a following post I will cover the [installation of Nginx](/nginx-installation-on-ubuntu/).

{{< call-for-contribution >}}

[^1]: [Initial Server Setup with Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-18-04)
