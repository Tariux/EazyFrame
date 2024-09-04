const { HTML } = require("../../core/render/HTML")

class HomePageController { 
    constructor() {
        this.init()
    }
    async init() {
        this.page = await HTML.load('home/index' , false)
    }
    
    async response() {
        return this.page
    }
    async share() {
        return {
            
        }
    }
}

module.exports = HomePageController