//// [privateNamesInNestedClasses-2.ts]
// @target es6

class A {
    static #x = 5;
    constructor () {
        class B {
            #x = 5;
            constructor() {
                class C {
                    constructor() {
                        A.#x // error
                    }
                }
            }
        }
    }
}


//// [privateNamesInNestedClasses-2.js]
"use strict";
// @target es6
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return privateMap.get(receiver); };
var A = /** @class */ (function () {
    function A() {
        var _x_1;
        _x.set(this, void 0);
        var B = /** @class */ (function () {
            function B() {
                _x_1.set(this, void 0);
                __classPrivateFieldSet(this, _x_1, 5);
                var C = /** @class */ (function () {
                    function C() {
                        __classPrivateFieldGet(A, _x_1); // error
                    }
                    return C;
                }());
            }
            return B;
        }());
        _x_1 = new WeakMap();
    }
    var _x;
    _x = new WeakMap();
    A. = 5;
    return A;
}());
