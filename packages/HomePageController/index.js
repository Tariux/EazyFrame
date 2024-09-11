import HTML from '../../core/render/HTML.js';

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

export default HomePageController;