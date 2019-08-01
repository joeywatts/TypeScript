//// [privateNameNotAccessibleOutsideDefiningClass.ts]
// @target es6

class A {
    #foo: number = 3;
}

new A().#foo = 4;               // Error


//// [privateNameNotAccessibleOutsideDefiningClass.js]
// @target es6
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };
var _foo;
"use strict";
var A = /** @class */ (function () {
    function A() {
        _foo.set(this, void 0);
        __classPrivateFieldSet(this, _foo, 3);
    }
    return A;
}());
_foo = new WeakMap();
new A(). = 4; // Error
