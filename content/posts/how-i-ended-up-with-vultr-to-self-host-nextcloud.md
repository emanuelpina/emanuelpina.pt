---
title: "How I Ended Up With Vultr to Self Host Nextcloud"
date: 2019-09-11T19:50:36+01:00
draft: false
thumbnail: v1568214075/2019/Vultr.png
categories: [SysAdmin]
tags: [Cloud Storage, Nextcloud, VPS, Vultr]
readmore: 
---

In the process of self-hosting Nextcloud the first step was to choose a VPS provider. It wasn't a straightforward choice and in the process I ended up experiencing, by this order, Hetzner, DigitalOcean and Vultr.

But, first of all, let me advise you that this isn't intended to be a factual analysis, supported by quantifiable and specific data. It is rather a subjective assessment based on my use case. Therefore, I believe that your experience with these providers could be completely different. If you are into more technical and detailed analyses you can go [here](https://www.vpsbenchmarks.com/) and [here](https://community.centminmod.com/threads/13-way-vps-server-benchmark-comparison-tests-upcloud-vs-digitalocean-vs-linode-vs-vultr-vs-hetzner.17742/), for example.

So my first choice was [Hetzner](https://www.hetzner.com/cloud/). A company with a high reputation and a very inviting features/price ratio. A VPS with 1vCPU, 2GB RAM, 20GB Disk and 20TB Traffic for €2.49 ($2.75) looks great. It seemed a logical choice. So I proceeded with the installation and configuration of Nextcloud and uploaded my files to the server. Everything was going well, until I started to browse through Nextcloud and tried to open some of my videos. The server crashed. I thought it was a one-time event, but I repeated the process always with the same outcome. According to Hetzner's console the culprit seemed to be the CPU. On idle it remained arround 30% and very often reached 100%. So I upgraded the VPS to 2vCPU, 4GB RAM and 40GB Disk for €4.90 ($5.41) and it all started to work like a charm.

But then I kept wondering, does it take 2vCPU to run a personal Nextcloud? So I decided to give a try with the only provider I had ever worked with, [DigitalOcean](https://www.digitalocean.com/pricing/) (DO). Of course I chose a droplet with 1vCPU, 1GB RAM and 25GB Disk ($5, €4.54). The user experience was very similar to Hetzner's 2vCPU plan. Of course, CPU utilization was higher in DO (1vCPU vs 2vCPU), but with rare peaks and generally never exceeding 60%. One noticeable difference was the higher download/load speed in DO. Something I expected, because by the reviews I read they have a better network performance with higher download and upload speeds.

The same reviews pointed out that [Vultr](https://www.vultr.com/products/cloud-compute/) has a network performance on par with DO and a better overall performance. Besides that they have a datacenter in Paris (500km closer to me than Amsterdam) and free snapshots. So I decided to give them a spin. As in DO I deployed a server with 1vCPU, 1GB RAM adn 25GB Disk ($5,  €4.54). The user experience was slightly better than with DO. The response time was shorter. As a result the pages opened more quickly and the downloading/load of files was also faster. A better overall experience. This, combined with the ability to create and store snapshots for free, made it easier for me to choose Vultr.

For now I see no advantage in using DO over Vultr. Hetzner can be back in play if I find myself in need of a little more disk space, or of the extra performance the 2vCPUs and 4GB RAM can offer.

#### Wrapping up

- **Hetzner 1vCPU, 2GB RAM, 20GB Disk at €2.49 ($2.75)**: High CPU utilization and server crashed when loading videos, aparently because of CPU limitations.
- **Hetzner 2vCPU, 4GB RAM, 40GB Disk at €4.90 ($5.41)**: Worked like a charm.
- **DigitalOcean 1vCPU, 1GB RAM, 25GB Disk at $5 (€4.54)**:  Similar experience as with Hetzner 2vCPU plan. Download/load of files was faster than Hetzner.
- **Vultr 1vCPU, 1GB RAM, 25GB Disk at $5 (€4.54)**: Slightly better exeprience than DO. Faster response time and download/load of files. Free snapshots.