
module.exports = (router) => {
  router.addRoute('/', {
    module: 'APackageController',
    responseType: 'text/html',
  });
};
