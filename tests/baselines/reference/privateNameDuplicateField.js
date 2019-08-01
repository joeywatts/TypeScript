//// [privateNameDuplicateField.ts]
// @target es6

class A {
    #foo = "foo";
    #foo = "foo";
}


//// [privateNameDuplicateField.js]
// @target es6
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };
var _foo, _foo_1;
"use strict";
var A = /** @class */ (function () {
    function A() {
        _foo_1.set(this, void 0);
        __classPrivateFieldSet(this, _foo_1, "foo");
        _foo_1.set(this, void 0);
        __classPrivateFieldSet(this, _foo_1, "foo");
    }
    return A;
}());
_foo = new WeakMap(), _foo_1 = new WeakMap();
