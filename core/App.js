const routes = require('../app/routes');
const loader = require('../app/loader');
const { logThe } = require('../utility/Logger');
// const { TemplateEngine } = require('./render/TemplateEngine');
const Handlebars = require("handlebars");

/**
 * App class responsible for bootstrapping the application.
 */
class App {
  /**
   * Private properties to store the controllers, packages, and couples.
   * @private
   */
  #controllers = [];
  #packages = [];
  #couple = [];
  #build = [];
  /**
   * Constructor method that initializes the App instance.
   * @param {Router} router - The router instance.
   */
  constructor(router) {
    this.router = router;
    this.init();

    this.load();
  }

  /**
   * Method to initialize the app.
   */
  init() {
    routes(this.router);
    loader(this);
  }

  /**
   * Method to load a controller.
   * @param {string} key - The key for the controller.
   * @param {Object} controller - The controller module.
   */
  loadController(key, controller) {
    this.#controllers[key] = {
      id: this.generateRandomString(),
      key,
      module: controller,
    };
  }

  /**
   * Method to load a package.
   * @param {string} key - The key for the package.
   * @param {Object} pack - The package module.
   */
  loadPackage(key, pack) {
    this.#packages[key] = {
      id: this.generateRandomString(),
      key,
      module: pack,
    };
  }

  /**
   * Method to inject a master and slave into the app.
   * @param {string} first - The key for the master.
   * @param {string} second - The key for the slave.
   */
  inject(first, second = false) {
    let master,
    slave = false;
    if (this.#controllers[first]) {
      master = this.#controllers[first];
    } else if (this.#packages[first]) {
      master = this.#packages[first];
    }

    if (second) {
      if (this.#controllers[second]) {
        slave = this.#controllers[second];
      } else if (this.#packages[second]) {
        slave = this.#packages[second];
      }
    }

    if (!master) {
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

  /**
   * Method to load the app.
   */
  load() {
    logThe('Loading app started');
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
        if (slave.module) {
          const slaveModule = require(slave.module);
          const slaveModuleObject = new slaveModule();
          deps[slave.key] = slaveModuleObject;
          logThe(`"${slave.key}" controller loaded!`);
  
        }
      });
      const module = require(bundle.master.module);
      const moduleObject = new module(deps);
      logThe(`"${bundle.name}" package loaded!`);

      this.#build[bundle.name] = {
        routes: foundRoutes,
        module: moduleObject,
      };
    }
  }

  /**
   * Method to run the app.
   * @param {http.IncomingMessage} request - The incoming HTTP request.
   * @param {http.ServerResponse} response - The HTTP response.
   */
  async run(request, response) {
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
    if (!route.module || !this.#build[route.module]) {
      response.writeHead(400, {
        'Content-Type': route.responseType ? route.responseType : 'text/plain',
      });
      response.end('Module not found');
      return;
    }

    const build = this.#build[route.module];

    const moduleInstance = build.module;
    response.writeHead(200, {
      'Content-Type': route.responseType ? route.responseType : 'text/plain',
    });

    const ControllerTemplate = await moduleInstance.response();
    if (typeof moduleInstance.share === 'function') {
      const ControllerShare = await moduleInstance.share();
      // const ControllerTemplate = TemplateEngine.compile(
      //   ControllerResponse,
      //   ControllerShare
      // );
      const ControllerFinal = ControllerTemplate(ControllerShare)
      response.end(ControllerFinal);
    } else {
      response.end(ControllerResponse);
    }
  }

  /**
   * Method to generate a random string.
   * @returns {string} A random string.
   */
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

module.exports = App;
