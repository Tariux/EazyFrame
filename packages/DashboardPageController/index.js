const { HTML } = require('../../core/render/HTML');

class DashboardPageController {
  constructor(deps) {
    this.init();
    this.sqlite = deps.SQLitePackage

  }
  async init() {
    this.page = await HTML.load('dashboard/index', true);
  }

  async response() {
    return this.page;
  }
  async share() {
    const data = {
      isLoggedIn: true,
      username: 'JohnDoe',
      userRole: 'admin',
      items: [
        { name: 'Item 1', price: '$10' },
        { name: 'Item 2', price: '$20' },
      ],
      hasNotifications: true,
      isSubscribed: true,
      messages: [],
      userProfile: { name: 'John', age: 30 },
      age: 20,
      isAdmin: true,
      users: await this.sqlite.query.user.getAll()
    
    };

    return data;
  }
}

module.exports = DashboardPageController;
