const { logThe } = require('../utility/Logger');
const App = require('./App');
const Router = require('./Router');
const http = require('http');
const Mimetype = require('./render/Mimetype');

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
    this.mime = new Mimetype();

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
      
      if (this.mime.check(req.url)) {
        this.mime.handle(res);
      } else {
        logThe(req.url + ' ' + req.method, 'New Request!');
        this.app.run(req, res);
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
