---
title: Behind the scenes
date: 2019-02-17T17:43:00.000+00:00
thumbnail: "/v1558565914/2019/webdevelopment.jpg"
categories:
- Desenvolvimento Web
readmore: ''
tags: []

---
Para começar este _blog_ vou procurar explicar, o melhor que conseguir, os passos da sua construção.

A plataforma utilizada é o [Wordpress](https://wordpress.org/), um _Content Managment System,_ um software de uso livre para a criação de todo o tipo de _websites_. É versátil, permitindo criar soluções que vão de um simples _blog_ a uma complexa loja _online_, ou um _site_ de imprensa com um modelo de subscrição. E está bem documentado. A sua utilização está tão disseminada que são milhares os tutoriais e ferramentas existentes que documentam e facilitam a sua utilização. Atualmente, o Wordpress é utilizado em [32,4% de todos os _websites_ existentes](https://w3techs.com/technologies/details/cm-wordpress/all/all).

Para a construção e manutenção do tema, do desenho, do _blog_, utilizo a _framework_ [Thesis da **DIY**themes](http://diythemes.com/). Não sendo a mais popular, e por conseguinte não a mais documentada, é no meu entender uma ferramenta mais completa e versátil que a popular Genesis. A curva de aprendizagem é talvez um pouco maior quando comparada com outras _frameworks_, mas a personalização e controlo que oferece sobre o que estamos a criar é bastante superior, compensando os desafios da aprendizagem inicial.

Os ícones utilizados são uma compilação entre [Feather Icons](https://feathericons.com/), [Material Icons](https://material.io/tools/icons/) e [Font Awessome](https://fontawesome.com/), no formato SVG, compilados numa [SVG Sprite](https://css-tricks.com/svg-sprites-use-better-icon-fonts/) e carregados _inline_ no html utilizando a função [XLink](https://www.w3schools.com/xml/xml_xlink.asp). O SVG é <span class="js-about-item-abstr">uma linguagem XML para descrever de forma vetorial desenhos e gráficos bidimensionais</span>. Ou seja, um ícone SVG não é uma imagem, com dimensões fixas, mas sim um conjunto de vetores, que formam uma imagem. Isto quer dizer que são escalonáveis. Outra vantagem na utilização de ícones no formato SVG é o tamanho reduzido do ficheiro, dependo da complexidade (número de vetores) do ícone. Na verdade um ícone SVG são apenas algumas linhas de código que definem cada um dos vetores.

Na construção do _blog_ fiz também uso de [_javascript_](https://pt.wikipedia.org/wiki/JavaScript), mais concretamente da biblioteca de funções de _javascript_ [jQuery](https://jquery.com/). São exemplos, a [animação do cabeçalho na página inicial](https://jsfiddle.net/emanuelpina/4m6fdtzL/), o [esconder/mostrar o cabeçalho quando a altura da janela é inferior a 800px](https://jsfiddle.net/emanuelpina/careh4gp/), e o [menu do cabeçalho](https://jsfiddle.net/emanuelpina/dLqyb6t2/).

O formulário de contacto tem por base o _plugin_ [Contact Form 7](https://contactform7.com/).

No que diz respeito à optimização da performance do _blog_ faço uso do _plugin_ [LiteSpeed Cache](https://www.litespeedtech.com/products/cache-plugins/wordpress-acceleration). Das muitas soluções existentes para optimização de _websites_ em Wordpress, esta é a ideal para mim, pois o servidor onde o _blog_ está implementado corre o [LiteSpeed Web Server](https://www.litespeedtech.com/products#lsws).

Conjuntamente com este _plugin_ utilizo a [BunnyCDN](https://bunnycdn.com/) para distribuição geográfica do _blog_. Um dos principais problemas na performance de um _website_ é que o acesso a ele é mais lento quanto maior a distância entre o ponto de acesso e o servidor de origem. Imaginemos um _website_ implementado num servidor localizado em Lisboa. O tempo de acesso ao _website_ para alguém localizado no Porto é muito inferior do de alguém localizado em São Paulo. Este problema pode ser mitigado utilizando uma [Content Delivery Network](https://en.wikipedia.org/wiki/Content_delivery_network) (CDN), uma rede de servidores, distribuídos pelo Mundo, que replicam e armazenam grande parte ou a totalidade do _website_. Assim, quando alguém em São Paulo aceder ao _website_, ao invés de ter de esperar pela conexão ao servidor de origem em Lisboa, vai conectar-se ao servidor da CDN mais próximo de sí, reduzindo o tempo de acesso ao _website_ em vários segundos.