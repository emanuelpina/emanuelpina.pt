---
title: "GoatCounter"
date: 2020-04-08T10:35:32+01:00
draft: false
thumbnail: v1586340561/2020/goatcounter.jpg
categories: [Privacy, Web Development]
tags: [GoatCounter, Web Analytics]
readmore: 
summarize: true
---

Although page views aren't my immediate concern when I write on this blog, is good to know if someone is reading what I share! But doing it I wanted to assure that I wasn't tracking you. In others words, that the data gathered couldn't identify or being associated to you. To do so I started by using the self-hosted version of [Fathom](https://github.com/usefathom/fathom/).

Unfortunately, some time ago the developers of Fathom decided change their business model. They developed a new version of Fathom, closed source, only for paid customers, named [Fathom PRO](https://usefathom.com/) and renamed the original Fathom as Fathom Lite. Since then the development of this first version seems to had come to an end, as its lastest release is from November 2018.

I then started looking for alternatives and that's when I found [this discussion on Lobsters](https://lobste.rs/s/gzkue1/what_is_your_preferred_web_traffic/) and met GoatCounter. A recent project of an [open source](https://github.com/zgoat/goatcounter/) and privacy-aware web statistics platform.

<!--more-->

As its developer states:

> No personal information (such as IP address) is collected; a hash of the IP address, User-Agent, and a daily changing random number (“salt”) is stored for 24 hours at the most to identify unique visitors.
>
>There is no information stored in the browser with e.g. cookies. [^1]

So what data does GoatHunter collect?

- URL of the visited page;
- Referer header;
- User-Agent header;
- Screen size;
- Country name based on IP address;
- A hash of the IP address, User-Agent, and random number.
  
The script that by default you need to add to your site so GoatCounter can do its job is lightweight (~1.5kB), and there's a no-JavaScript image-based tracker option, or you can use it from your application's middleware.

There's an [hosted version](https://goatcounter.com/) of GoatCounter that includes a free plan for non-commercial use or you can host it yourself. In either case, if you're going to use it for free, don't forget to, as you can, donate to the developer so he can pay his bills and continue support this project.

The [issues tracking](https://github.com/zgoat/goatcounter/issues/) is done on GitHub and you can join the project's [Telegram group](https://t.me/goatcounter).

[^1]: [GoatCounter privacy policy](https://www.goatcounter.com/privacy/)