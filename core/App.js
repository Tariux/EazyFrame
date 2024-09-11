import routes from '../app/routes.js';
import loader from '../app/loader.js';
import { logThe } from '../utility/Logger.js';
// import { TemplateEngine } from './render/TemplateEngine';
import Handlebars from "handlebars";

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

  }

  /**
   * Method to initialize the app.
   */
  async init() {
    routes(this.router);
    loader(this);
    await this.load();

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
  async load() {
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
      bundle.salves.map( async (slave) => {
        if (slave.module) {

          let slaveModuleObject = false
          let SlaveModule = await import(slave.module)
          .then((module) => {
            return module.default;
          })
          .catch((error) => {
            console.error('Error loading module:', error);
            return null;
          });
    
    
          if (Module) {
            moduleObject = new Module();
          } else {
            console.error('Failed to load module');
          }

          deps[slave.key] = slaveModuleObject;
          logThe(`"${slave.key}" controller loaded!`);
  
        }
      });

      let moduleObject = false
      let Module = await import(bundle.master.module , deps)
      .then((module) => {
        return module.default;
      })
      .catch((error) => {
        console.error('Error loading module:', error);
        return null;
      });

      if (Module) {
        moduleObject = new Module();
      } else {
        console.error('Failed to load module');
      }

      logThe(`"${bundle.name}" package loaded!`);

      this.#build[bundle.name] = {
        routes: foundRoutes,
        module: moduleObject,
      };
    }
  }
  loadJs = ( path , deps) => {
    return new Promise( resolve => {
      import(`${path}` , deps)
      .then((module) => {
        resolve(module.default)
      })
    })
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
    let ControllerFinal, ControllerShare
    const ControllerResponse = await moduleInstance.response();
    
    if (typeof moduleInstance.share === 'function') {
      ControllerShare = await moduleInstance.share();
    } else {
      ControllerShare = {}
      ControllerFinal = ControllerResponse
    }

    if (typeof ControllerResponse === 'function') {
      ControllerFinal = ControllerResponse(ControllerShare)      
    } else {
      ControllerFinal = ControllerResponse      
    }

    response.end(ControllerFinal);
    
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

export default App;
