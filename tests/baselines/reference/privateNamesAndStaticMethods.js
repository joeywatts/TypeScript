//// [privateNamesAndStaticMethods.ts]
class A {
    static #foo(a: number) {}
    static async #bar(a: number) {}
    static async *#baz(a: number) {
        return 3;
    }
    static #_quux: number;
    static get #quux (): number {
        return this.#_quux;
    }
    static set #quux (val: number) {
        this.#_quux = val; 
    }
    constructor () {
        A.#foo(30);
        A.#bar(30);
        A.#bar(30);
        A.#quux = A.#quux + 1;
        A.#quux++;
 }
}

class B extends A {
    static #foo(a: string) {}
    constructor () {
        super();
        B.#foo("str");
    }
}


//// [privateNamesAndStaticMethods.js]
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return privateMap.get(receiver); };
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };
var __quux;
"use strict";
class A {
    constructor() {
        var _a, _b;
        A.foo.call(A, 30);
        A.bar.call(A, 30);
        A.bar.call(A, 30);
        A.quux = A.quux + 1;
        _a = A, _b = _a.quux, _a.quux = _b + 1, _b;
    }
    static foo(a) { }
    static async bar(a) { }
    static async *baz(a) {
        return 3;
    }
    static get quux() {
        return __classPrivateFieldGet(this, __quux);
    }
    static set quux(val) {
        __classPrivateFieldSet(this, __quux, val);
    }
}
__quux = new WeakMap();
class B extends A {
    constructor() {
        super();
        B.foo.call(B, "str");
    }
    static foo(a) { }
}
