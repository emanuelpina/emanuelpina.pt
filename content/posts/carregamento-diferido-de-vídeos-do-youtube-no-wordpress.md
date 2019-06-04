---
title: Carregamento diferido de vídeos do Youtube no Wordpress
date: 2019-03-08T14:45:00.000+00:00
thumbnail: "/v1558565915/2019/Javascript.jpg"
categories:
- Desenvolvimento Web
tags:
- Javascript
- Wordpress
readmore: Ler tutorial...
---
Integrar um vídeo do Youtube numa publicação no Wordpress é habitualmente tão simples quanto selecionar o botão `Adicionar multimédia` e colocar o URL do vídeo.

**O problema** é que dessa maneira, cada vez que um utilizador aceder à página da publicação o vídeo é imediatamente carregado aumentando o tempo de abertura em vários segundos.

**A solução** que encontrei consiste em utilizar um pequeno _script_ que permite carregar inicialmente apenas uma imagem de apresentação do vídeo (_thumbnail_) e só carregar o vídeo após o utilizador clicar no botão de reprodução. Conseguimos assim fazer um carregamento diferido (_lazyload_) do vídeo, optimizando o tempo de abertura da página.

<!--readmore-->

### Script

Este é o código _javascript_ que devem inserir na página. É comum inserir estes códigos no interior da etiqueta `<head></head>`, mas o ideal é colocá-los no final do documento, após a etiqueta `</body>`, evitando assim que o código _javascript_ atrase o carregamento do conteúdo HTML.

```JS
<script>var youtube = document.querySelectorAll('.youtube');
for (var i = 0; i < youtube.length; i++) {
    var source = 'https://img.youtube.com/vi/'+ youtube[i].dataset.embed +'/sddefault.jpg';
    var image = new Image();
        image.src = source;
        image.addEventListener('load', function() {
        youtube[i].appendChild(image);
        }(i));

    youtube[i].addEventListener('click', function() {
        var iframe = document.createElement('iframe');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('src', 'https://www.youtube.com/embed/'+ this.dataset.embed +'?autoplay=1&rel=0');
            this.innerHTML = '';
            this.appendChild(iframe);
    } );
}</script>
```

Este _script_ executa essencialmente duas operações. Num primeiro momento, carrega apenas a imagem de apresentação do vídeo e, num segundo momento, após o utilizador clicar no botão de reprodução, carrega e reproduz o vídeo.

### CSS

Este é o código CSS necessário para que tudo apareça no seu lugar, com as cores e dimensões corretas!

```CSS
.youtube {
    background-color: #000;
    margin-bottom: 30px;
    position: relative;
    padding-top: 56.25%;
    overflow: hidden;
    cursor: pointer;
}
.youtube img,
.youtube iframe,
.youtube .play,
.youtube .play:before {
    position: absolute;
}
.youtube img,
.youtube .play {
    cursor: pointer;
}
.youtube img {
    width: 100%;
    top: -16.5%;
    left: 0;
    opacity: 0.7;
}
.youtube iframe {
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
}
.youtube .play,
.youtube .play:before {
    top: 50%;
    left: 50%;
    transform: translate3d( -50%, -50%, 0 );
}
.youtube .play {
    width: 90px;
    height: 60px;
    background-color: #ff0000;
    box-shadow: 0 0 30px rgba( 0,0,0,0.6 );
    z-index: 1;
    opacity: 0.8;
    border-radius: 6px;
    transition: opacity 200ms ease-in-out;
}
.youtube .play:before {
    content: "";
    border-style: solid;
    border-width: 15px 0 15px 26.0px;
    border-color: transparent transparent transparent #fff;
    left: 53%;
}
.youtube:hover .play {
    opacity: 1;
}
```

### HTML

Agora, para inserir um vídeo num artigo basta, na vista HTML do editor de texto, inserir o seguinte código:

```HTML
<div class="youtube" data-embed="N1-Jmq7BLFE">
     <div class="play"></div>
</div>
```

Analisando o código, temos uma div com a _class_ `youtube`, dentro da qual será carregado o vídeo, e com o atributo `data-embed`, que é referente ao identificador único do vídeo e que pode ser encontrado no seu URL (exemplo: youtube.com/watch?v=**N1-Jmq7BLFE**). No interior desta div temos uma segunda com a _class_ `play`, que corresponde ao ícone de reprodução.

### Aspect Ratio

Habitualmente os vídeos no Youtube têm um _aspect ratio_ (proporção de tela) de 16:9, por isso os valores de dimensão no código CSS estão, por defeito, definidos para essa proporção. No entanto, podem querer colocar nas vossas publicações vídeos com outras proporções. Eu sei que me vejo, no futuro, a partilhar vídeos com _aspect ratios_ de 2:1 ou 21:9, por exemplo. Assim, para dimensionar o vídeo para proporções diferentes de 16:9 adicionamos uma segunda _class_ à div `youtube`.

```HTML
<div class="youtube ratio2-1" data-embed="N1-Jmq7BLFE">
     <div class="play"></div>
</div>
```

Adiciona-se a _class_ `ratio2-1` para um _aspect ratio_ de 2:1, a _class_ `ratio21-9` para 21:9 e `ratio4-3` para 4:3.

Para isto resultar, é necessário incluir o seguinte código ao CSS:

```CSS
.ratio21-9 {
    padding-top: 42.6%;
}
.ratio21-9 img {
    top: -38.1%;
}
.ratio2-1 {
    padding-top: 50%;
}
.ratio2-1 img {
    top: -25%;
}
.ratio4-3 {
    padding-top: 75%;
}
.ratio4-3 img {
    top: 0;
}
```

E está feito! Podem [ver aqui](https://jsfiddle.net/emanuelpina/9bfh36cv/) este código em funcionamento, com exemplos da integração de vídeos nos vários _aspect ratios_.