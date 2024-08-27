module.exports = (app) => {
  app.loadController('DashboardPageController', '../packages/DashboardPageController');
  app.loadController('HomePageController', '../packages/HomePageController');
  
  app.loadPackage('SQLitePackage', '../packages/SQLitePackage');

  app.inject('DashboardPageController' , 'SQLitePackage');

  app.inject('HomePageController');


};
