const { HTML } = require("../../core/render/HTML")

class DPackge { 
    constructor() {
    }
    
    async response() {
        const page = await HTML.load('index')
        return page
    }
}

module.exports = DPackge