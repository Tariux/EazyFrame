const { readFileSync, existsSync, statSync } = require('fs');
const { minifyCSS } = require('./utility');
const { History } = require('../../storage/history');
const { logThe } = require('../../utility/Logger');

class Mimetype {
  #handlerFunction;
  constructor(url, response) {
    this.url = url;
    this.response = response;
    this.filename = __dirname + '/../../theme/' + url;
    this.init();
  }
  init() {
    this.mimeTypes = {
      // Start of Selection
      html: 'text/html',
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
      png: 'image/png',
      js: 'text/javascript',
      css: 'text/css',
      woff: 'font/woff',
      woff2: 'font/woff2',
      ttf: 'font/ttf',
    };
    this.filesDependencies = this.url.match(
      /\.js|\.css|\.jpg|\.png|\.woff2|\.ttf|\.woff/
    );
    this.extension = this.filesDependencies
      ? this.mimeTypes[this.filesDependencies[0].toString().split('.')[1]]
      : false;

    if (existsSync(this.filename) && this.extension) {
      this.exist = true;
    } else {
      this.exist = false;
    }

    if (this.exist) {
      switch (this.extension) {
        case this.mimeTypes.css:
          this.#handlerFunction = this.handleCss;
          break;

        default:
          this.#handlerFunction = this.handleRaw;
          break;
      }
    }
  }
  handle() {
    if (this.exist && typeof this.#handlerFunction === 'function') {
      const stats = statSync(this.filename);
      this.lastUpdated = stats.mtime;
      const response = this.loadMime(this.filename , this.extension)
      this.response.writeHead(200, { 'Content-Type': this.extension });
      this.response.end(response);

      return true;
    } else {
      this.response.writeHead(404, { 'Content-Type': 'text/html' });
      this.response.end('404');
      return false;
    }
  }
  loadMime(filename , ext) {
    let response;
    const stats = statSync(this.filename);
    if (History.get(filename)) {
      logThe(ext + ' called from cache');
      response = History.get(filename).data;
    } else {
      logThe(ext + ' called from server');
      const filedata = readFileSync(filename);
      response = this.#handlerFunction(filedata);
      History.add(filename, {
        data: response,
        lastUpdated: stats.mtime,
      });
    }
    return response
  }

  handleRaw(filedata) {
    return filedata;
  }
  handleCss(filedata) {
    return filedata;
  }
}

module.exports = Mimetype;
