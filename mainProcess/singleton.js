const singleton = "slngleton";
class Singleton {
    static get ins()
    {
        return this[singleton] = this[singleton] || new this;
    }
    constructor()
    {
        let Class = Object.create(Singleton);
        return Class[singleton] = Class[singleton] || this;
    }
}

module.exports = Singleton;