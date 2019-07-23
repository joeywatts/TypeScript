//// [privateNamesAndMethods.ts]
class A {
    #foo(a: number) {}
    async #bar(a: number) {}
    async *#baz(a: number) {
        return 3;
    }
    #_quux: number;
    get #quux (): number {
        return this.#_quux;
    }
    set #quux (val: number) {
        this.#_quux = val; 
    }
    constructor () {
        this.#foo(30);
        this.#bar(30);
        this.#baz(30);
        this.#quux = this.#quux + 1;
        this.#quux++;
 }
}

class B extends A {
    #foo(a: string) {}
    constructor () {
        super();
        this.#foo("str");
    }
}


//// [privateNamesAndMethods.js]
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return privateMap.get(receiver); };
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };
var __quux;
class A {
    constructor() {
        var _a;
        __quux.set(this, void 0);
        this..call(this, 30);
        this..call(this, 30);
        this..call(this, 30);
        this. = this. + 1;
        _a = this., this. = _a + 1, _a;
    }
    (a) { }
    async (a) { }
    async *(a) {
        return 3;
    }
    get () {
        return __classPrivateFieldGet(this, __quux);
    }
    set (val) {
        __classPrivateFieldSet(this, __quux, val);
    }
}
__quux = new WeakMap();
class B extends A {
    constructor() {
        super();
        this..call(this, "str");
    }
    (a) { }
}
