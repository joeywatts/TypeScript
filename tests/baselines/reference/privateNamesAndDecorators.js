//// [privateNamesAndDecorators.ts]
declare function dec<T>(target: T): T;

class A {
    @dec                // Error
    #foo = 1;
    @dec                // Error
    #bar(): void { }
}


//// [privateNamesAndDecorators.js]
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };
var _foo;
var A = /** @class */ (function () {
    function A() {
        _foo.set(this, void 0);
        __classPrivateFieldSet(this, _foo, 1);
    }
    A.prototype. = function () { };
    return A;
}());
_foo = new WeakMap();
