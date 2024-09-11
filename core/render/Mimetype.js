import { readFileSync, existsSync, statSync } from 'fs';
import { History } from '../../storage/history.js';
import { logThe } from '../../utility/Logger.js';
import { minifyCss, minifyJavaScript } from './utility.js';

class Mimetype {
  #handlerFunction;
  constructor() {
    
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
  }
  check(url) {
    this.url = url;
    this.filename =  '../../theme/' + url;


    this.filesDependencies = this.url.match(
      /\.js|\.css|\.jpg|\.png|\.woff2|\.ttf|\.woff/
    );
    this.extension = this.filesDependencies
      ? this.mimeTypes[this.filesDependencies[0].toString().split('.')[1]]
      : false;
    if (!this.extension) {
      this.exist = false;
    } else {
      if (existsSync(this.filename)) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    }
    return this.exist

  }
  initHandle(response) {
    this.response = response;

    if (this.exist) {
      switch (this.extension) {
        case this.mimeTypes.css:
          this.#handlerFunction = this.handleCss;
          break;
        case this.mimeTypes.js:
          this.#handlerFunction = this.handleJs;
          break;
        default:
          this.#handlerFunction = this.handleRaw;
          break;
      }
    }
  }
  handle(response) {
    this.initHandle(response)
    if (this.exist && typeof this.#handlerFunction === 'function') {
      const response = this.loadMime(this.filename, this.extension)
      this.response.writeHead(200, { 'Content-Type': this.extension });
      this.response.end(response);
      return true;
    } else {
      return this.notFound(this.response)
    }
  }
  notFound(response) {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end('404');
    return false;
  }
  loadMime(filename, ext) {
    let response;
    const stats = statSync(this.filename);
    console.log('xxx' , this.filename);

    if (false) { // enable or disable cache here
      // if (History.get(filename)) {
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
    return filedata
  }
  handleCss(filedata) {
    filedata = filedata.toString()
    return minifyCss(filedata);
  }
  handleJs(filedata) {
    filedata = filedata.toString()
    return minifyJavaScript(filedata);
  }
}

export default Mimetype;
