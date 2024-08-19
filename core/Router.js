
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

module.exports = Router
