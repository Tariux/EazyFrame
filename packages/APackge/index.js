class APackage { 
    constructor(deps) {
        this.deps = deps
    }

    response() {
        console.log('APackage Deps' , this.deps);
        console.log('BPackage Call' , this.deps.BPackagePack.method());
        return "Meow"
    }
}

module.exports = APackage