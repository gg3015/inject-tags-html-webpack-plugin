/* eslint-disable @typescript-eslint/no-var-requires */

const HtmlWebpackPlugin = require('html-webpack-plugin')
/**
 * @class InjectTagsHtmlWebpackPlugin 
 * @classdesc inject label like 'meta', ''script', 'link', 'style' to body.head[0]
 */
class InjectTagsHtmlWebpackPlugin {

  /**
   * 
   * @param {Object}    options 
   * @param {Array.<{href:string,content:string,rel:string,otherAtrributes?:Object}>}    options.styles
   * @param {Object[]}  options.scripts
   * @param {string}    [options.scripts.src]
   * @param {string}    [options.scripts.content]
   * @param {Object}    [options.scripts.otherAtrributes]
   * @param {Object[]}  options.metas
   * @param {string} options.metas[].name attribute name 'viewport, author, title, description, keywords'
   * @param {string} options.metas[].content attribute content and name come in pairs
   */
  constructor(options) {
    this.options = options
    this.verson = '1.0.0'
  }
  /**
   * 
   * @param {import('webpack').Compiler} compiler 
   */
  apply(compiler) {

    compiler.hooks.compilation.tap('InjectTagsHtmlWebpackPlugin', (compilation) => {
      // inject title
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('InjectTagsHtmlWebpackPlugin', (data, cb) => {
        // data.html+='magic'
        if (this.options.title) {
          for (let index = 0; index < data.headTags.length; index++) {
              const element = data.headTags[index];
              if(element.tagName === 'title') element.innerHTML = this.options.title;
          }
          data.headTags.push(HtmlWebpackPlugin.createHtmlTagObject('title', {}, this.options.title, {}))
        }
        cb(null, data)
      })
      // inject style & meta
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
        'InjectTagsHtmlWebpackPlugin',
        (data, cb) => {
          if (this.options.metas) {
            const metas = [];
            data.assetTags.meta.length > 0
              ? data.assetTags.meta.map((mitem) => {
                this.options.metas.map((item) => {
                  if (item.name && item.content) {
                    if (
                      mitem.attributes.name &&
                      mitem.attributes.name === item.name
                    ) {
                      mitem.attributes.content = item.content;
                    } else {
                      metas.push(item);
                    }
                  }
                });
              })
              : this.options.metas.map((item) => {
                item.name &&
                  item.content &&
                  data.assetTags.meta.push(
                    HtmlWebpackPlugin.createHtmlTagObject(
                      'meta',
                      {
                        ...item,
                      },
                      '',
                      {},
                    ),
                  );
              });
            metas.map((item) => {
              data.assetTags.meta.push(
                HtmlWebpackPlugin.createHtmlTagObject(
                  'meta',
                  {
                    ...item,
                  },
                  '',
                  {},
                ),
              );
            });
          }
          if (this.options.styles) {
            const styles = Array.isArray(this.options.styles)
              ? this.options.styles
              : [];
            styles.map((item) => {
              item.href &&
                data.assetTags.styles.push(
                  HtmlWebpackPlugin.createHtmlTagObject(
                    'link',
                    {
                      ...(item.otherAtrributes || {}),
                      rel: item.rel || 'stylesheet',
                      href: item.href,
                    },
                    '',
                    {},
                  ),
                );
              !item.href &&
                item.content &&
                data.assetTags.styles.push(
                  HtmlWebpackPlugin.createHtmlTagObject(
                    'style',
                    {},
                    item.content || '',
                    {},
                  ),
                );
            });
          }

          if (this.options.scripts) {
            const scripts = Array.isArray(this.options.scripts)
              ? this.options.scripts
              : [];
            scripts.map((item) => {
              item.src &&
                data.assetTags.scripts.push(
                  HtmlWebpackPlugin.createHtmlTagObject(
                    'script',
                    {
                      type: 'application/javascript',
                      ...(item.otherAtrributes || {}),
                      src: item.src,
                    },
                    '',
                    {},
                  ),
                );
              !item.src &&
                item.content &&
                data.assetTags.scripts.push(
                  HtmlWebpackPlugin.createHtmlTagObject(
                    'script',
                    {
                      type: 'application/javascript',
                      ...(item.otherAtrributes || {}),
                    },
                    item.content || '',
                    {},
                  ),
                );
            });
          }
          cb(null, data);
        },
      );
      // HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('InjectTagsHtmlWebpackPlugin', (data, cb) => {
      //     // data.html+='magic'
      //     cb(null, data)
      // })

    })
  }
}

module.exports = InjectTagsHtmlWebpackPlugin