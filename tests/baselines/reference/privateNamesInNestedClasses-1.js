//// [privateNamesInNestedClasses-1.ts]
// @target es6

class A {
   #foo = "A's #foo";
   #bar = "A's #bar";
   method () {
       class B {
           #foo = "B's #foo";
           bar (a: any) {
               a.#foo; // OK, no compile-time error, don't know what `a` is
           }
           baz (a: A) {
               a.#foo; // compile-time error, shadowed
           }
           quux (b: B) {
               b.#foo; // OK
           }
       }
       const a = new A();
       new B().bar(a);
       new B().baz(a);
       const b = new B();
       new B().quux(b);
   }
}

new A().method();

//// [privateNamesInNestedClasses-1.js]
// @target es6
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return privateMap.get(receiver); };
var _foo, _bar;
"use strict";
var A = /** @class */ (function () {
    function A() {
        _foo.set(this, void 0);
        __classPrivateFieldSet(this, _foo, "A's #foo");
        _bar.set(this, void 0);
        __classPrivateFieldSet(this, _bar, "A's #bar");
    }
    A.prototype.method = function () {
        var _foo_1;
        var B = /** @class */ (function () {
            function B() {
                _foo_1.set(this, void 0);
                __classPrivateFieldSet(this, _foo_1, "B's #foo");
            }
            B.prototype.bar = function (a) {
                __classPrivateFieldGet(a, _foo_1); // OK, no compile-time error, don't know what `a` is
            };
            B.prototype.baz = function (a) {
                __classPrivateFieldGet(a, _foo_1); // compile-time error, shadowed
            };
            B.prototype.quux = function (b) {
                __classPrivateFieldGet(b, _foo_1); // OK
            };
            return B;
        }());
        _foo_1 = new WeakMap();
        var a = new A();
        new B().bar(a);
        new B().baz(a);
        var b = new B();
        new B().quux(b);
    };
    return A;
}());
_foo = new WeakMap(), _bar = new WeakMap();
new A().method();
