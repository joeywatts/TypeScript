//// [privateNameDuplicateField.ts]
// @target es6

class A {
    #foo = "foo";
    #foo = "foo";
}


//// [privateNameDuplicateField.js]
// @target es6
var _foo, _foo_1;
<<<<<<< HEAD
=======
"use strict";
>>>>>>> 4427a64bc2... Add private named instance field transformation (#31)
var A = /** @class */ (function () {
    function A() {
        _foo_1.set(this, "foo");
        _foo_1.set(this, "foo");
    }
    return A;
}());
_foo = new WeakMap(), _foo_1 = new WeakMap();
