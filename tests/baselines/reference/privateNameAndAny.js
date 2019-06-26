//// [privateNameAndAny.ts]
class A {
    #foo = true; 
    method(thing: any) {
        thing.#foo; // OK
        thing.#bar; // OK: we do not (yet) check that #foo is in an ancestor class (but we could)
    }
};


tests/cases/conformance/classes/members/privateNames/privateNameAndAny.js(15,15): error TS1003: Identifier expected.


==== tests/cases/conformance/classes/members/privateNames/privateNameAndAny.js (1 errors) ====
    "use strict";
    var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };
    var _foo;
    class A {
        constructor() {
            _foo.set(this, true);
        }
        method(thing) {
            __classPrivateFieldGet(thing, _foo); // OK
            thing.; // OK: we do not (yet) check that #foo is in an ancestor class (but we could)
                  ~
!!! error TS1003: Identifier expected.
        }
    }
    _foo = new WeakMap();
    ;
    