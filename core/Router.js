const { logThe } = require("../utility/Logger");

/**
 * Router class responsible for managing routes and handling requests.
 */
class Router {
  /**
   * Private property to store the routes.
   * @private
   */
  #routes;

  /**
   * Constructor method that initializes the Router instance.
   */
  constructor() {
    logThe('Router Loaded!');
    this.#routes = [];
  }

  /**
   * Method to get the current routes.
   * @returns {Array} The current routes.
   */
  getRoutes() {
    return this.#routes;
  }

  /**
   * Method to patch the routes with a new routes object.
   * @param {Object} routesObject - The new routes object.
   */
  patchRoutes(routesObject) {
    this.#routes = routesObject;
  }

  /**
   * Method to parse the route based on the request.
   * @param {Object} request - The incoming HTTP request.
   * @returns {Object|boolean} The parsed route or false if not found.
   */
  parseRoute(request) {
    if (this.#routes[request.url]) {
      this.route = {
        ...this.#routes[request.url],
        method: request.method,
      };
    } else {
      this.route = false;
    }
    return this.route;
  }

  /**
   * Method to add a new route to the router.
   * @param {string} path - The path for the route.
   * @param {Object} config - The route configuration.
   */
  addRoute(path, config) {
    this.#routes[path] = config;
  }

  /**
   * Method to auto-route the request and send the response.
   * @param {http.ServerResponse} res - The HTTP response.
   */
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

module.exports = Router;