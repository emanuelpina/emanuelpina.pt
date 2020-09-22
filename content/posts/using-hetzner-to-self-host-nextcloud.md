---
title: "Using Hetzner to Self Host Nextcloud"
date: 2020-09-22T20:10:39+01:00
draft: false
thumbnail: v1600803210/2020/hetzner.png
categories: [SysAdmin]
tags: [Cloud Storage, Nextcloud, VPS, Hetzner]
readmore: 
summarize: true
---

This is a brief, but long owed post.

Last year, I decided that the best path to claim ownership of my data was self-hosting Nextcloud.[^1] I faced some issues using Hetzner's 1 vCPU plan and I convinced myself that the culprit was their vCPU not being powerful enough.[^2]

If it's true that their vCPU wasn't as powerful as Vultr's one. It's also true that with the right know-how I would be able to debug the issue and make things work. **The culprit was in fact my lack of knowledge.**

<!--more-->

So, what changed? I just learned how to tune PHP[^3] and PostgreSQL[^4] according to the server resources. That's it!

That settled, I end up moving to Hetzner at the beginning of this year. Currently, on a 1 vCPU VPS (that costs €2.49/month), I'm hosting Nextcloud, Drone CI, Miniflux, MailyGo and this blog without issues. In the future, if I see myself in need of more CPU power, I can easy rescale the VPS to an optimized for CPU plan (based on AMD EPYC 2nd Gen processors) with 2 vCPU for €3.49/month. Which is still cheaper than the Vultr's 1 vCPU plan.

If you're looking for a VPS in Europe, give Hetzner a try. They have datacenters in Germany (Nuremberg and Falkenstein) and Finland (Helsinki). You can use my [referral link](https://hetzner.cloud/?ref=c3vVEBlaZbLD) to get €20 in credits. {{< marker red >}}For full disclosure, if you choose to stick with them and after you spend €10, I receive €10 in credits.{{< /marker >}}[^5]

[^1]: [Be the Owner of Your Data With Nextcloud](/be-the-owner-of-your-data-with-nextcloud/)
[^2]: [How I Ended Up With Vultr to Self Host Nextcloud](/how-i-ended-up-with-vultr-to-self-host-nextcloud/)
[^3]: [PHP Installation on Ubuntu - Tune PHP](/php-installation-on-ubuntu/#tune-php)
[^4]: [PostgreSQL Installation on Ubuntu - Tune PostgreSQL](/postgresql-installation-on-ubuntu/#tune-postgresql)
[^5]: [Conditions of participation of the referral program](https://console.hetzner.cloud/assets/legal/Referral-Programm_en.pdf)
