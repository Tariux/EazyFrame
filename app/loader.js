export default function loader(app) {
  app.loadController('DashboardPageController', '../packages/DashboardPageController/index.js');
  app.loadController('HomePageController', '../packages/HomePageController/index.js');
  app.loadController('BenchPageController', '../packages/BenchPageController/index.js');
  
  // app.loadPackage('SQLitePackage', '../packages/SQLitePackage');

  app.inject('DashboardPageController' );

  app.inject('HomePageController');
  app.inject('BenchPageController');
}
