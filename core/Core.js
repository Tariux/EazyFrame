const { logThe } = require('../utility/Logger');
const App = require('./App');
const Router = require('./Router');
const http = require('http');
const fs = require('fs');

/**
 * Core class responsible for bootstrapping the application.
 */
class Core {
  /**
   * Constructor method that initializes the Core instance.
   */
  constructor() {
    logThe('Core Loaded!');
    this.router = new Router();
    this.app = new App(this.router);
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

  /**
   * Method that starts the HTTP server and listens for incoming requests.
   * @param {number} port - The port number to listen on.
   */
  listen(port) {
    this.port = port;

    this.server = http.createServer((req, res) => {});

    /**
     * Handler function for incoming HTTP requests.
     * @param {http.IncomingMessage} req - The incoming HTTP request.
     * @param {http.ServerResponse} res - The HTTP response.
     */
    const handleRequest = (req, res) => {
      if (handleMimetype(req, res) === false) {
        logThe(req.url + ' ' + req.method, 'New Request!');
        this.app.run(req, res);
      }
    };

    const handleMimetype = (req, res) => {
      var filesDependencies = req.url.match(
        /\.js|\.css|\.jpg|\.png|\.woff2|\.ttf|\.woff/
      );
      if (filesDependencies) {
        var extension =
          this.mimeTypes[filesDependencies[0].toString().split('.')[1]];
        res.writeHead(200, { 'Content-Type': extension });
        fs.createReadStream(__dirname + '/../theme/' + req.url).pipe(res);

        return true
      } else {
        return false
      }
    };

    this.server.on('request', handleRequest);

    /**
     * Event handler for when the server is listening.
     */
    this.server.listen(this.port, '127.0.0.1', () => {
      logThe('Server running', 'in http://127.0.0.1:' + this.port);
    });
  }
}

module.exports = Core;
