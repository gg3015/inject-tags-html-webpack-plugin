Inject tags Plugin for the HTML Webpack Plugin
-----------
Enhances html-webpack-plugin by letting you specify style, script or link tags to inject

Prior Version
-----------
`inject-tags-html-webpack-plugin` requires Node >= 10 and webpack & html-webpack-plugin versions >= 5.

Installation
-----------
```shell
$ npm install --save-dev inject-tags-html-webpack-plugin
```

Basic Usage
-----------
Require the plugin in your webpack config:

```javascript
var InjectTagsHtmlWebpackPlugin = require('inject-tags-html-webpack-plugin');
```

Add the plugin to your webpack config:

```javascript

plugins: [
  new InjectTagsHtmlWebpackPlugin({ 
        title:'test',
        styles: [{ content: 'body{font-size:calc(100vw / 18.75)}' }],
        metas: [{
          name: 'viewport',
          content:'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1,user-scale=no'
        }]
      })
]
```
Which will generate html like this
```html
<head>
  <!-- other head content -->
  <title>test</title>
  <meta name='viewport' content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1,user-scale=no">
  <style>body{font-size:calc(100vw / 18.75)}</style>
</head>
```

Configuration
-------

### Default Options

This plugin will run and do nothing if no options are provided.

The default options for this plugin are shown below:

```js

const options = {
    title?: string, // content for tag title, will make sure only one title tag last
    styles?: [{
        href?: string, // href for link https://***.css or ***.ico
        content?: string, // inline style
        rel?: string, // icon/stylesheet default stylesheet
        otherAttributes?: Object // some other tag attributes
    }],
    scripts?: [{
        src?: string, // src for script
        content?: string, // inline script sheet
        otherAttributes?: Object, // some other tag attributes
    }],
    meta?: [{
        name: string, // meta name
        content: string // meta content
    }]
};
```
