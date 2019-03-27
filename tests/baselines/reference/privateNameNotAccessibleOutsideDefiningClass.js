//// [privateNameNotAccessibleOutsideDefiningClass.ts]
// @target es6

class A {
    #foo: number = 3;
}

new A().#foo = 4;               // Error


//// [privateNameNotAccessibleOutsideDefiningClass.js]
// @target es6
var _foo;
<<<<<<< HEAD
=======
"use strict";
>>>>>>> 4427a64bc2... Add private named instance field transformation (#31)
var A = /** @class */ (function () {
    function A() {
        _foo.set(this, 3);
    }
    return A;
}());
_foo = new WeakMap();
new A().#foo = 4; // Error
