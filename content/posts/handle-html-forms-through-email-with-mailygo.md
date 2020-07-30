---
title: "Handle HTML Forms Through Email With MailyGo"
date: 2020-07-30T22:28:28+01:00
draft: false
thumbnail: v1596144141/2020/mailygo.png
categories: [Blog, Web Development]
tags: [Forms, Golang, MailyGo]
readmore: 
summarize: true
---

You may have already notice the [contact form](/contact) on this blog. Until recently, it was handled by Netlify and used a [serverless function](https://github.com/emanuelpina/blog/commit/34024920a96c140d5d10186c8bda26f9f8b1510e) to send an email both to me and the submitter. This worked fine, but was far from ideal because I had to trust the data to a third party (Netlify).

As I was already running a server (with Nextcloud and Mastodon), I looked for a self-hosted solution and found [MailyGo](https://codeberg.org/jlelse/MailyGo) from Jan-Lukas Else. A small tool written in Go that allows send HTML forms through email. Exactly what I was looking for!

<!--more-->

I just needed to tailor it a little bit to my use case. A good challenge as this was my first time working with Go. Keep that in mind and be kind when you review my code, please!

So, there's the list of changes I made:

- [Created the ability to add text to the beginning and end of the email message](https://codeberg.org/emanuelpina/mailygo/commit/cc8d366d96bae3208292b9459cf4e5a65905f11c);
  
- [Created the ability to send an email to the submitter too](https://codeberg.org/emanuelpina/mailygo/commit/3fb966fe2773e2b586aee7e13fd6056498aa7fbe);
  
- [Created the ability to add text to the beginning and end of the email message sent to the submitter](https://codeberg.org/emanuelpina/mailygo/commit/90986863c8655174e31badf8b8f4db2f496a56bc);
  
- [Created the ability to use specifics fields for Name, Subject and Message](https://codeberg.org/emanuelpina/mailygo/commit/896d055b53f03b0cd1cc733642e423dbb5684747).
  

### Fighting Spam

When a form is placed online it's a matter of time until it get some bots' attention and being targeted with spam. To fight it, the original version of MailyGo already used an honeypot field, a spamlist and integrated Google Safe Browsing to check URLs. And that seemed enough.

But I didn't want to use any third party, even less Google! And unfortunately the honeypot field and spamlist alone shown insufficient.

I got some bots sending a particular field (submit) that wasn't part of the form. And so, I [created a denylist](https://codeberg.org/emanuelpina/mailygo/commit/43bf54c8e2f85d8f49244bd185d64c38834d5697), a list of fields names that MailyGo will look for and, if present, mark the submission as spam.

I too got bots that *grabbed* the URL of MailyGo and posted a submission directly to it, bypassing the form. To prevent this, I [created the ability to use a token](https://codeberg.org/emanuelpina/mailygo/commit/749c137bfd39b0e2a5a79ed634fe8d64673f93f0) to assure only the submissions that come from the form are handle by MailyGo. This token can be any combination of letters and numbers. If a `TOKEN` is defined on configuration, MailyGo will look for a field named `_token`. If this field doesn’t exist or its value doesn’t match the one defined on configuration the submission will be marked as spam.

I'm using this set of solutions for more than a week now with zero spam. Seems enough. At least for now!

An that's it, [my fork of MailyGo](https://codeberg.org/emanuelpina/mailygo)!

A big thanks to Jan-Lukas Else. Follow his [blog](https://jlelse.blog/) and know [more of his projects](https://jlelse.dev/projects/).