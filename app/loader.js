module.exports = (app) => {
  app.loadController('APackageController', '../packages/APackge');
  app.loadPackage('BPackagePack', '../packages/BPackge');
  app.loadPackage('CPackagePack', '../packages/CPackge');
  app.inject('APackageController', 'BPackagePack');
  app.inject('APackageController', 'CPackagePack');
};
