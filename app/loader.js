module.exports = (app) => {
  app.loadController('DashboardPageController', '../packages/DashboardPageController');
  app.loadController('HomePageController', '../packages/HomePageController');
  
  app.loadPackage('BPackagePack', '../packages/BPackge');
  app.loadPackage('CPackagePack', '../packages/CPackge');
  app.loadPackage('SQLitePackage', '../packages/SQLitePackage');

  app.inject('DashboardPageController' , 'SQLitePackage');

  app.inject('HomePageController', 'BPackagePack');
  app.inject('HomePageController', 'CPackagePack');


};
