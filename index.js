/* eslint-disable @typescript-eslint/no-var-requires */

const HtmlWebpackPlugin = require('html-webpack-plugin');

function replaceSameTag(tagName, targetContent, sourceHtml) {
  const reg = new RegExp(
    // eslint-disable-next-line no-control-regex
    `(<${tagName}>)([\\s\\S]*)(<\\/${tagName}>)`,
    'gi',
  );
  let rePlace = [`<${tagName}>${targetContent}</${tagName}>`]
  sourceHtml = sourceHtml.replace(reg, (item) => {
    return rePlace.shift() || ''
  })
  return sourceHtml;
}

/**
 * @class InjectLabelHtmlWebpackPlugin
 * @classdesc inject label like 'meta', ''script', 'link', 'style' to body.head[0]
 */
class InjectLabelHtmlWebpackPlugin {
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
    this.options = options;
    this.verson = '1.0.0';
  }
  /**
   *
   * @param {import('webpack').Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.compilation.tap(
      'InjectLabelHtmlWebpackPlugin',
      (compilation) => {
        // inject style & meta
        HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
          'InjectLabelHtmlWebpackPlugin',
          (data, cb) => {
            if (this.options.metas) {
              data.headTags && this.options.metas.map((item) => {
                item.name &&
                  item.content &&
                  data.headTags.push(
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
                  data.headTags.push(
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
                  data.headTags.push(
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
                  data.headTags.push(
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
                  data.headTags.push(
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
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
          'InjectLabelHtmlWebpackPlugin',
          (data, cb) => {
            data.html = replaceSameTag('title', this.options.title, data.html);

            cb(null, data);
          },
        );
      },
    );
  }
}

module.exports = InjectLabelHtmlWebpackPlugin;
