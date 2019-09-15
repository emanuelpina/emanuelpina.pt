---
title: "Be the Owner of Your Data With Nextcloud"
date: 2019-09-08T19:36:09+01:00
draft: false
thumbnail: v1567799486/2019/nextcloud.png
categories: [Privacy, SysAdmin]
tags: [Cloud Storage, Nextcloud]
readmore: 
---

Since a few years now I started to get concern with how much of my data was being gathered and how it was being used.

Nowdays we spend a big part of our lives online and over the years companies have grown basing their business on tracking our actions. The searches we made, the sites and pages we visit, the time you spent on them... and so on.

Let's face it, Google Search was a revolution, and Gmail, OneDrive, iCloud, Facebook or Youtube are excellent products in terms of usability and features. And best of all they're free, you would say. Are they?

<!--readmore-->

So, how can this companies create and mantain such great products, give them free and be profitable? More than been profitable, all those are now in the [top 10 list of the most values companies](https://fxssi.com/top-10-most-valuable-companies-in-the-world/). How?

Because data is nowdays the most profitable resource. The metadata those companies gather of us can be used, for instance, to place ads or shape what we see when we do a search on Google or view our timeline on Facebook or Youtube. In the end, they can condition us to buy a product or to vote in a certain politic. Do you think I'm being dramatic? Take a look at Netflix documentary [*The Great Hack*](https://www.netflix.com/Title/80117542/) about Facebook and Cambridge Analytica actions during Trump and Brexit campaigns.

One question that came up in that documentary and made me think was *"how much of Facebook's profits come from the use of its users' data?"* The answer is all. All of the more than $400 billion dollars that Facebook worth are result of how much of our data they gather and own. That's disturbing.

What can we do? Well, look for alternative products with privacy in mind. But the first step you need to take is acknowledge the importance of protect your data. Why? Because some of the alternatives to those big companies produtcs don't offer the same features or don't come free, or both. Yes, the truth is that presently privacy can be seen in some way as a "luxury" product.

So far, in pursuit for privacy, what changes did I make? A couple years ago I ditched Chrome for [Firefox](https://www.mozilla.org/firefox/new/). Gradually stopped using Facebook or Messenger, and recently adopted [Signal](https://www.signal.org/) for messaging and [Mastodon](https://joinmastodon.org/) as social network. My email, contacts and calendars are now handled by [Tutanota](https://tutanota.com/).

For now there was still one big piece missing, cloud storage. I was using OneDrive because of his deep integration with Windows and Office. Looking for alternatives I found good, open source, but expensive ones like [Least Authority S4](https://leastauthority.com/) ($25/month), and more affordable, but closed source ones like [Sync](https://www.sync.com/) and [Tresorit](https://tresorit.com/). Then I decided to take what I already knew on SysAdmin, learn a couple of new things, and give a try on self-hosting [Nextcloud](https://nextcloud.com/). And two weeks later there's no looking back!

Nextcloud is a community-driven, free and open source software with all is code published on [GitHub](https://github.com/nextcloud/). It offers [server-side encryption](https://nextcloud.com/encryption/) and end-to-end encryption is [under development](https://help.nextcloud.com/t/status-end2end-encryption-in-nextcloud/50490). It's mainly a cloud storage, but [groupware capabilities](https://nextcloud.com/groupware/) could be easily added. It meets all my most urgent requirements and have room for grow and improvement.

So far, my roadmap on self-hosting Nextcloud:

- Deploy a Ubuntu server with Nginx, PHP and PostgreSQL installed;
- Install and tune Nextcloud;
- Use Restic to automate backups of Nextcloud files and database to Backblaze B2;
- Use Vultr's API to automate snapshots management.
  
I'm no expert, but I will try detail each one of these steps on upcoming posts.

For now I'm using Nextcloud only to store files and notes. As next step I will probably work on the integration with [OnlyOffice](https://www.onlyoffice.com/).
