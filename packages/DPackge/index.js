const { HTML } = require("../../core/render/HTML")

class DPackge { 
    constructor() {
        this.init()
    }
    async init() {
        this.page = await HTML.load('index' , true)
    }
    
    async response() {
        return this.page
    }
}

module.exports = DPackge