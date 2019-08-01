//// [privateNameCircularReference.ts]
class A {
    #foo = this.#bar;
    #bar = this.#foo;
    ["#baz"] = this["#baz"]; // Error (should *not* be private name error)
}


//// [privateNameCircularReference.js]
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return privateMap.get(receiver); };
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };
var _foo, _bar;
"use strict";
class A {
    constructor() {
        _foo.set(this, void 0);
        __classPrivateFieldSet(this, _foo, __classPrivateFieldGet(this, _bar));
        _bar.set(this, void 0);
        __classPrivateFieldSet(this, _bar, __classPrivateFieldGet(this, _foo));
        this["#baz"] = this["#baz"]; // Error (should *not* be private name error)
    }
}
_foo = new WeakMap(), _bar = new WeakMap();
