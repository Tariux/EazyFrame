
module.exports = (router) => {
  router.addRoute('/a', {
    module: 'APackageController',
    responseType: 'text/html',
  });
  router.addRoute('/', {
    module: 'DPackageController',
    responseType: 'text/html',
  });
};
