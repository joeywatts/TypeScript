//// [privateNamesNoAccessibilityModifiers.ts]
// @target es6

class A {
    public #foo = 3;         // Error
    private #bar = 3;        // Error
    protected #baz = 3;      // Error
    readonly #qux = 3;       // OK
}


//// [privateNamesNoAccessibilityModifiers.js]
// @target es6
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };
var _foo, _bar, _baz, _qux;
"use strict";
var A = /** @class */ (function () {
    function A() {
        _foo.set(this, void 0);
        __classPrivateFieldSet(this, _foo, 3); // Error
        _bar.set(this, void 0);
        __classPrivateFieldSet(this, _bar, 3); // Error
        _baz.set(this, void 0);
        __classPrivateFieldSet(this, _baz, 3); // Error
        _qux.set(this, void 0);
        __classPrivateFieldSet(this, _qux, 3); // OK
    }
    return A;
}());
_foo = new WeakMap(), _bar = new WeakMap(), _baz = new WeakMap(), _qux = new WeakMap();
