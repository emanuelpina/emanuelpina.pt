---
title: Hello World
date: 2019-05-10T10:42:14.000+00:00
categories:
- Blog
- Desenvolvimento Web
tags:
- Hugo
- JAMStack
- Netlify
thumbnail: ''
draft: true

---
Sed enim ut sem viverra aliquet eget sit amet tellus. Tincidunt augue interdum velit euismod in pellentesque. Felis eget nunc lobortis mattis aliquam faucibus purus in. Est ullamcorper eget nulla facilisi etiam dignissim diam quis enim. Feugiat pretium nibh ipsum consequat nisl vel. Integer eget aliquet nibh praesent tristique magna. Neque convallis a cras semper auctor neque vitae tempus quam. Cursus turpis massa tincidunt dui ut ornare lectus sit. Risus pretium quam vulputate dignissim suspendisse in est ante. Vulputate dignissim suspendisse in est. Donec massa sapien faucibus et molestie ac feugiat. Duis convallis convallis tellus id interdum velit laoreet. Tristique senectus et netus et malesuada. Quis commodo odio aenean sed. Aliquam eleifend mi in nulla posuere sollicitudin. Habitasse platea dictumst quisque sagittis purus sit amet volutpat. Sed id semper risus in hendrerit gravida. Velit dignissim sodales ut eu sem integer vitae.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis risus sed vulputate odio ut enim blandit. Mi in nulla posuere sollicitudin aliquam ultrices sagittis orci a. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Quam quisque id diam vel quam elementum pulvinar etiam. Vitae purus faucibus ornare suspendisse sed nisi lacus. Ultrices tincidunt arcu non sodales neque. Dolor sit amet consectetur adipiscing. Posuere ac ut consequat semper. Congue quisque egestas diam in arcu. Sit amet commodo nulla facilisi nullam. Commodo odio aenean sed adipiscing diam donec adipiscing. Nunc consequat interdum varius sit amet mattis vulputate. Dolor sed viverra ipsum nunc aliquet bibendum enim. Viverra suspendisse potenti nullam ac tortor vitae purus faucibus ornare. Iaculis eu non diam phasellus vestibulum lorem sed. Gravida neque convallis a cras semper. Eu mi bibendum neque egestas congue quisque.

#### Table of Contents
* [Headings](#headings)
* [Emphasis](#emphasis)
* [Blockquote](#blockquote)
* [Unordered List](#unordered-list)
* [Ordered List](#ordered-list)
* [Footnote](#footnote)
* [Code](#code)
* [Table](#table)
* [Right align table](#right-align-table)
* [Images](#images)

## Headings <a id="headings"></a>

# Heading 1
## Heading 2
### Heading 3
#### Heading 4

### Horizontal Rules

---

### Emphasis <a id="emphasis"></a>

The following is rendered as **bold text**.

The following is rendered as *italicized text*.

The following is rendered as ~~strikethrough text~~

### Blockquote <a id="blockquote"></a>

>The mathematical proportions of typography are vitally important to how readers perceive both your site and your content.
>
>And continues...
>
> > Fusion Drive combines a hard drive with a flash storage (solid-state drive) and presents it as a single logical volume with the space of both drives combined.

### Unordered List <a id="unordered-list"></a>

* Item 1
* Item 2
    - Item 2.1
    - Item 2.2
        + Item 2.2.1
* Item 3

### Ordered List <a id="ordered-list"></a>

1. Item 1
2. Item 2
3. Item 3
    1. Item 3.1
    2. Item 3.2
4. Item 4
5. Item 5

### Footnote <a id="footnote"></a>

And now here's a sentence with a footnote. [^1]

### Code <a id="code"></a>

This is a little `litle piece of <code>` between some text.

The following is a preformated text.

```go
// GetTitleFunc returns a func that can be used to transform a string to
// title case.
//
// The supported styles are
//
// - "Go" (strings.Title)
// - "AP" (see https://www.apstylebook.com/)
// - "Chicago" (see http://www.chicagomanualofstyle.org/home.html)
//
// If an unknown or empty style is provided, AP style is what you get.
func GetTitleFunc(style string) func(s string) string {
  switch strings.ToLower(style) {
  case "go":
    return strings.Title
  case "chicago":
    tc := transform.NewTitleConverter(transform.ChicagoStyle)
    return tc.Title
  default:
    tc := transform.NewTitleConverter(transform.APStyle)
    return tc.Title
  }
}
```

### Table <a id="table"></a>

| Syntax | Description | Tag
| ----------- | ----------- | ------------- |
| Header | Title | h1 ... 4 |
| Paragraph | Text | p |

### Right align table <a id="right-align-table"></a>

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

### Images <a id="images"></a>

![Minion](https://octodex.github.com/images/minion.png "Minion")

![Ninja][ninja]

{{<figure src="https://octodex.github.com/images/dojocat.jpg" alt="Ninja" title="Ninja" caption="The Dojocat" class="wrap-image-left" width="200">}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis risus sed vulputate odio ut enim blandit. Mi in nulla posuere sollicitudin aliquam ultrices sagittis orci a. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Quam quisque id diam vel quam elementum pulvinar etiam. Vitae purus faucibus ornare suspendisse sed nisi lacus. Ultrices tincidunt arcu non sodales neque. Dolor sit amet consectetur adipiscing.

{{<figure src="https://octodex.github.com/images/minion.png" alt="Yellow" title="Yellow" caption="The Minion" class="wrap-image-right" width="200">}}
Posuere ac ut consequat semper. Congue quisque egestas diam in arcu. Sit amet commodo nulla facilisi nullam. Commodo odio aenean sed adipiscing diam donec adipiscing. Nunc consequat interdum varius sit amet mattis vulputate. Dolor sed viverra ipsum nunc aliquet bibendum enim. Viverra suspendisse potenti nullam ac tortor vitae purus faucibus ornare. Iaculis eu non diam phasellus vestibulum lorem sed. Gravida neque convallis a cras semper. Eu mi bibendum neque egestas congue quisque.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis risus sed vulputate odio ut enim blandit. Mi in nulla posuere sollicitudin aliquam ultrices sagittis orci a. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Quam quisque id diam vel quam elementum pulvinar etiam. Vitae purus faucibus ornare suspendisse sed nisi lacus. Ultrices tincidunt arcu non sodales neque. Dolor sit amet consectetur adipiscing.

{{<figure src="https://octodex.github.com/images/dojocat.jpg" alt="Ninja" title="Ninja" caption="The Dojocat" class="image-center">}}
Posuere ac ut consequat semper. Congue quisque egestas diam in arcu. Sit amet commodo nulla facilisi nullam. Commodo odio aenean sed adipiscing diam donec adipiscing. Nunc consequat interdum varius sit amet mattis vulputate. Dolor sed viverra ipsum nunc aliquet bibendum enim. Viverra suspendisse potenti nullam ac tortor vitae purus faucibus ornare. Iaculis eu non diam phasellus vestibulum lorem sed. Gravida neque convallis a cras semper. Eu mi bibendum neque egestas congue quisque.


[^1]: This is the footnote.

[ninja]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"