//// [privateNamesAndkeyof.ts]
// @target es6

class A {
    #foo = 3;
    bar = 3;
    baz = 3;
}

type T = keyof A     // should not include '#foo'


//// [privateNamesAndkeyof.js]
// @target es6
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };
var _foo;
"use strict";
var A = /** @class */ (function () {
    function A() {
        _foo.set(this, void 0);
        __classPrivateFieldSet(this, _foo, 3);
        this.bar = 3;
        this.baz = 3;
    }
    return A;
}());
_foo = new WeakMap();
