//// [privateNamesUnique-4.ts]
class A {
    #foo = 1;
    static #foo = true; // error (duplicate)
                        // because static and instance private names
                        // share the same lexical scope
                        // https://tc39.es/proposal-class-fields/#prod-ClassBody
}


//// [privateNamesUnique-4.js]
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };
var A = /** @class */ (function () {
    function A() {
        _foo_1.set(this, void 0);
        __classPrivateFieldSet(this, _foo_1, 1);
        _foo_1.set(this, void 0);
        // because static and instance private names
        // share the same lexical scope
        // https://tc39.es/proposal-class-fields/#prod-ClassBody
    }
    var _foo, _foo_1;
    _foo = new WeakMap(), _foo_1 = new WeakMap();
    A. = true; // error (duplicate)
    return A;
}());
