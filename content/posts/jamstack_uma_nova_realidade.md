---
title: 'JAMstack, uma nova realidade'
date: '2019-06-07T17:06:27+01:00'
thumbnail: >-
  https://res.cloudinary.com/emanuelpina/image/upload/c_fill,f_auto,q_auto,w_900/v1559945348/2019/JAMstack.jpg
categories:
  - Desenvolvimento Web
tags:
  - JAMstack
  - Hugo
  - Netlify
  - Git
---
O desenvolvimento web é tão antigo quanto a internet em si e, tal como esta, tem tido uma evolução notável ao longo dos anos. A minha viagem começou à quase 20 anos, quando os meus pais conseguiram finalmente oferecer-me um PC. Ainda se lembram como era a internet nesses anos? Só por curiosidade, relembrem as páginas da [Sapo](https://web.archive.org/web/20000520052944/http://www.sapo.pt/), [Yahoo!](https://web.archive.org/web/20000711065742/http://www.yahoo.com/) e [AOL](https://web.archive.org/web/20000512225759/http://www.aol.com/). Que nostalgia!

Se no início os _sites_ consistiam num conjunto básico de páginas estáticas, escritas com algumas das linguagens que ainda hoje se utilizam (HTML, CSS e JavaScript), depressa os programadores correram na busca de soluções que permitissem de forma mais eficiente criar e apresentar conteúdo na _web_. Eis que surgem os _Content Management Systems_ (CMS).

O primeiro CMS que utilizei foi o PHPNuke, depois o Joomla e por fim o Wordpress. Estas soluções, hoje designadas de monolíticas, têm como característica serem ferramentas _"tudo em um"_. Ou seja, integram concomitantemente o _backend_ (painel de administração que permite gerir o conteúdo do _site_) e _frontend_ (aquilo que é apresentado ao utilizador).

Na prática, como funcionam estes CMSs? O desenvolvedor do _site_ no painel de administração faz a gestão do seu conteúdo (criar categorias, artigos, páginas...). Este conteúdo é armazenado numa base de dados. Cada vez que um utilizador acede a um endereço do _site_ o CMS vai aceder à base de dados e criar uma página com o conteúdo que lhe está a ser solicitado. Ou seja, as páginas não existem até ao momento em que o utilizador acede ao _site_, são geradas no momento para então serem apresentadas. Este é um processo que consome recursos e tempo, atrasando a apresentação da página ao utilizador. Para além disso, uma vez que se propõem a serem solução para o desenvolvimento de todo o tipo de _sites_ (prova disso, atualmente cerca de 1/3 da _web_ tem por base o Wordpress), estas ferramentas tornaram-se cada vez mais complexas e _"pesadas"_, exigindo servidores com características e recursos específicos. Também a necessidade de terem o seu código exposto _online_ acarreta vários desafios do ponto de vista da segurança.

Na tentativa de mitigar muitos destes problemas foi proposto um novo conceito, o [JAMstack](https://jamstack.org/). Esta ideia não se debruça sobre a utilização de uma tecnologia, ferramenta ou linguagem de programação em concreto, é sim um novo paradigma, uma nova maneira de construir _websites_ e aplicações que tem como objetivos melhor desempenho, maior segurança, menor custo de dimensionamento e melhor experiência de desenvolvimento.

O que significa isto? O conceito JAMstack assenta em 3 pilares:

+ **J**avaScript: qualquer programação dinâmica durante o ciclo de solicitação / resposta é manipulada por JavaScript, sendo executada inteiramente no lado do cliente;
+ **A**PIs: todas as funções do lado do servidor ou ações de bancos de dados são abstraídas em APIs reutilizáveis, acessadas via HTTPS com JavaScript. Seja SaaS, serviços de terceiros ou personalizados;
+ **M**arcação (HTML): Os modelos de marcação devem ser pré-compilados no momento da criação, geralmente utilizando um gerador de sites ou uma ferramenta de criação de aplicativos _web_.

Confuso? Simplificando, o que se pretende é não depender de um servidor para gerar as páginas (HTML) _on demand_ (por solicitação) e que a origem do conteúdo possa ser diversificada e reutilizável.

Um exemplo prático. O _frontend_ é desenvolvido utilizando um dos muitos geradores de _sites_ estáticos existentes (Hugo, Jekyll, Gatsby...), armazenando o código num repositório Git (no GitHub, GitLab, Bitbucket...) e utilizando um serviço como o Netlify para compilar e publicar o _site_ cada vez que uma alteração ao código é submetida para o repositório. O _backend_ (artigos, páginas, categorias...) é gerido com recurso a um _Headless CMS_ (Strapi, Contentful, Cockpit...) e servido no _website_ através de uma ou várias APIs. Funções dinâmicas, como por exemplo a conversão das datas de publicação dos artigos em diferentes fusos horários ou no formato _timeago_ (publicado há xx dias), são realizadas com recurso a JavaScript.
