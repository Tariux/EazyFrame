
module.exports = (router) => {
  router.addRoute('/', {
    module: 'HomePageController',
    responseType: 'text/html',
  });
  router.addRoute('/dashboard', {
    module: 'DashboardPageController',
    responseType: 'text/html',
  });
};
