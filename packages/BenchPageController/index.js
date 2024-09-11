import HTML from '../../core/render/HTML.js';
export default class BenchPageController {
  constructor(deps) {
    this.init();

  }
  async init() {
    const chartData = JSON.stringify({
      animationEnabled: true,
      title: {
        text: "Sample Benchmark Chart"
      },
      data: [{
        type: "column",
        dataPoints: [
          { label: "Memory", y: 12 },
          { label: "CPU", y: 19 },
          { label: "Time", y: 3 }
        ]
      }]
    });
    // const chart = new CanvasJS.Chart("chartContainer", JSON.parse(chartData));

  }

  async response() {
    this.page = await HTML.load('benchmark/index', false);

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
