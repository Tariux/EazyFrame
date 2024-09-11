export default function routes(router) {
  router.addRoute('/', {
    module: 'HomePageController',
    responseType: 'text/html',
  });
  router.addRoute('/dashboard', {
    module: 'DashboardPageController',
    responseType: 'text/html',
  });
  router.addRoute('/bench', {
    module: 'BenchPageController',
    responseType: 'text/html',
  });
}
