import HTML from '../../core/render/HTML.js';

class DashboardPageController {
  constructor(deps) {
    this.init();

  }
  async init() {
    this.page = await HTML.load('dashboard/index', true);
  }

  async response() {
    return this.page;
  }
  async share() {
    // const users = await this.sqlite.query.user.getAll();
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
      // users: [users]
    
    };

    return data;
  }
}

export default DashboardPageController ;
