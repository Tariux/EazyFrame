const { readFileSync } = require('fs');
const { logThe } = require('../../utility/Logger');
const { minify } = require('html-minifier');
const { History } = require('../../storage/history');
const { minifyHtml } = require('./utility');
const Handlebars = require("handlebars");

class HTML {
  static minify(html) {
    return minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyCSS: true,
      minifyJS: true,
    });
  }
  static async load(filename, minify = false) {
    let filedata,finalResponse
    if (History.get(filename)) {
      logThe(filename + ' theme called from cache');
      filedata = History.get(filename).data;
    } else {
      logThe(filename + ' theme called from server');
      filedata = readFileSync('./theme/' + filename + '.html', 'utf8');
      History.add(filename, {
        data: filedata,
      });
    }

    if (minify) {
      finalResponse = minifyHtml(filedata.toString())
    } else {
      finalResponse =  filedata.toString()
    }

    if (finalResponse) {
      return Handlebars.compile(finalResponse)
    } else {
      return ''
    }

  }
}

module.exports = {
  HTML,
};
