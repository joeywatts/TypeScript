//// [privateNameFieldInitializer.ts]
class A {
    #field = 10;
    #uninitialized;
}


//// [privateNameFieldInitializer.js]
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };
var _field, _uninitialized;
var A = /** @class */ (function () {
    function A() {
        _field.set(this, void 0);
        __classPrivateFieldSet(this, _field, 10);
        _uninitialized.set(this, void 0);
    }
    return A;
}());
_field = new WeakMap(), _uninitialized = new WeakMap();
