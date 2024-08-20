const { readFileSync } = require('fs');
const { logThe } = require('../../utility/Logger');
const { minify } = require('html-minifier');

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
  static async load(filename , minify = false) {
    logThe('theme loaded!', filename);
    const html = readFileSync('./theme/' + filename + '.html', 'utf8');
    return html.toString()
    if (minify) {
        return HTML.minify(html.toString()); // Return the html as a string
    } else {
        return html.toString()
    }
  }
}

module.exports = {
  HTML,
};
