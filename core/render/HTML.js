const { readFileSync } = require('fs');
const { logThe } = require('../../utility/Logger');
const { minify } = require('html-minifier');
const { History } = require('../../storage/history');
const { minifyHtml } = require('./utility');

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
    let filedata
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
      return minifyHtml(filedata.toString())

    } else {
      return filedata.toString()

    }


  }
}

module.exports = {
  HTML,
};
