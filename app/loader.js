module.exports = (app) => {
  app.loadController('DashboardPageController', '../packages/DashboardPageController');
  app.loadController('HomePageController', '../packages/HomePageController');
  
  app.loadPackage('BPackagePack', '../packages/BPackge');
  app.loadPackage('CPackagePack', '../packages/CPackge');


  app.inject('DashboardPageController', 'BPackagePack');
  app.inject('HomePageController', 'BPackagePack');

  app.inject('DashboardPageController', 'CPackagePack');
  app.inject('HomePageController', 'CPackagePack');


};
