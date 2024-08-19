class BPackage { 
    constructor() {
        console.log('BPackage Loaded!');
    }

    method() {
        return "IM FROM 'B' PACKAGE";
    }
}

module.exports = BPackage