const { HTML } = require("../../core/render/HTML")

class DashboardPageController { 
    constructor() {
        this.init()
    }
    async init() {
        this.page = await HTML.load('dashboard/index' , true)
    }
    
    async response() {
        return this.page
    }
}

module.exports = DashboardPageController