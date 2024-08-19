
const routes = require('../app/routes');
const loader = require('../app/loader');

class App {
    #controllers = [];
    #packages = [];
    #couple = [];
    build = [];
    constructor(router) {
      console.log('App Loaded!');
      this.router = router;
      this.init();
  
      this.load();
      console.log('this.build', this.build);
    }
  
    init() {
      routes(this.router);
      loader(this)
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


module.exports = App
