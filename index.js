const http = require('http');
const routes = require('./routes');
const app = require('./app');
class App {
  #controllers = [];
  #packages = [];
  #couple = [];
  build = [];
  constructor(router) {
    console.log('App Loaded!');
    this.router = router;
    this.init();

    // console.log('this.#controllers', this.#controllers);
    // console.log('this.#packages', this.#packages);
    // console.log('this.#couple', this.#couple);

    this.load();
    console.log('this.build', this.build);
  }

  init() {
    routes(this.router);
    app(this)
  }
  loadController(key, controller) {
    this.#controllers[key] = {
      id: this.generateRandomString(),
      key,
      module: controller,
    };
  }

  loadPackage(key, pack) {
    this.#packages[key] = {
      id: this.generateRandomString(),
      key,
      module: pack,
    };
  }

  inject(first, second) {
    let master,
      slave = false;
    if (this.#controllers[first]) {
      master = this.#controllers[first];
    } else if (this.#packages[first]) {
      master = this.#packages[first];
    }

    if (this.#controllers[second]) {
      slave = this.#controllers[second];
    } else if (this.#packages[second]) {
      slave = this.#packages[second];
    }

    if (!master || !slave) {
      throw new Error('WTF BRO?');
    }

    if (this.#couple[first]) {
      this.#couple[first].salves = [...this.#couple[first].salves, slave];
    } else {
      this.#couple[first] = {
        id: this.generateRandomString(),
        name: first,
        master,
        salves: [slave],
      };
    }
  }

  load() {
    const allRoutes = this.router.getRoutes();
    for (
      let bundleIndex = 0;
      bundleIndex < Object.keys(this.#couple).length;
      bundleIndex++
    ) {
      const bundle = Object.values(this.#couple)[bundleIndex];
      const foundRoutes = [];
      for (
        let routeIndex = 0;
        routeIndex < Object.keys(allRoutes).length;
        routeIndex++
      ) {
        const route = Object.values(allRoutes)[routeIndex];
        if (route.module === bundle.name) {
          foundRoutes.push({
            route: Object.keys(allRoutes)[routeIndex],
            ...route,
          });
        }
      }

      let deps = [];
      bundle.salves.map((slave) => {
        const slaveModule = require(slave.module);
        const slaveModuleObject = new slaveModule();
        deps[slave.key] = slaveModuleObject;
      });
      const module = require(bundle.master.module);
      const moduleObject = new module(deps);

      this.build[bundle.name] = {
        routes: foundRoutes,
        module: moduleObject,
      };
    }
  }
  run(request, response) {
    this.lastRequest = request;
    this.lastResponse = response;
    const routes = this.router.getRoutes();

    if (!request.url || !routes[request.url]) {
      response.writeHead(404, {
        'Content-Type': 'text/plain',
      });
      response.end('Route not found');
      return;
    }

    const route = routes[request.url];

    if (!route.module || !this.build[route.module]) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      response.end('Module not found');
      return;
    }

    const build = this.build[route.module];

    const moduleInstance = build.module;
    response.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    response.end(moduleInstance.response());
  }

  generateRandomString() {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
class Router {
  #routes;
  constructor() {
    console.log('Router Loaded!');
    this.#routes = [];
  }
  getRoutes() {
    return this.#routes;
  }
  patchRoutes(routesObject) {
    this.#routes = routesObject;
  }
  parseRoute(request) {
    if (this.#routes[request.url]) {
      this.route = {
        ...this.#routes[request.url],
        method: request.method,
      };
    } else {
      this.route = false;
    }
  }
  addRoute(path, config) {
    this.#routes[path] = config;
  }
  autoRoute(res) {
    if (this.route && this.route.module) {
      const moduleInstance = new this.route.module(this.route);
      res.writeHead(200, {
        'Content-Type': this.route.responseType
          ? this.route.responseType
          : 'text/plain',
      });
      res.end(moduleInstance.response());
    } else {
      res.writeHead(404, {
        'Content-Type': this.route.responseType
          ? this.route.responseType
          : 'text/plain',
      });
      res.end('Route not found');
    }
  }
}
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
      console.log('Server running at http://127.0.0.1:', this.port);
    });
  }
}

new Core().listen(3030);
