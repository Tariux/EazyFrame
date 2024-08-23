const { HTML } = require("../../core/render/HTML")

class HomePageController { 
    constructor() {
        this.init()
    }
    async init() {
        this.page = await HTML.load('home/index' , true)
    }
    
    async response() {
        return this.page
    }
}

module.exports = HomePageController