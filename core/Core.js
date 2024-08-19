const App = require("./App");
const Router = require("./Router");
const http = require('http');

class Core {
  //
  constructor() {
    console.log('Core Loaded!');
    this.router = new Router();
    this.app = new App(this.router);
  }
  listen(port) {
    this.port = port;

    this.server = http.createServer((req, res) => {});

    const handleRequest = (req, res) => {
      console.log('Server Requested!');
      this.app.run(req, res);
      // this.router.parseRoute(req);
      // this.router.autoRoute(res);
    };

    this.server.on('request', handleRequest);

    this.server.listen(this.port, '127.0.0.1', () => {
      console.log('Server running at http://127.0.0.1:' + this.port);
    });
  }
}


module.exports = Core