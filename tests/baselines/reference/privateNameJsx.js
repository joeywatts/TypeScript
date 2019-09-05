//// [privateNameJsx.tsx]
class A {
    #Foo = () => null;
    method () {
        const e1 = <this.#Foo />;
        const e2 = <this.#Nonexistent />; // Error

        class B extends A {
            #Foo = 3;
            #Bar = () => null;
            #baz = () => null;

            method () {
                const a = new A();
                const e3 = <a.#Foo />;    // Error: shadowed
                const b = new B();
                const e4 = <b.#Foo />     // Error: not a constructor
                const e5 = <b.#Bar />
                const e6 = <this.#Bar />
                const e7 = <b.#baz />
            }
        }
        const b = new B()
        const e8 = <b.#Foo />             // OK, is A's #foo
        const e9 = <b.#Bar />             // Error: not accessible
    }
}


//// [privateNameJsx.jsx]
"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _Foo;
class A {
    constructor() {
        _Foo.set(this, () => null);
    }
    method() {
        var _Foo_1, _Bar, _baz;
        const e1 = <__classPrivateFieldGet(this, _Foo) />;
        const e2 = <this. />; // Error
        class B extends A {
            constructor() {
                super(...arguments);
                _Foo_1.set(this, 3);
                _Bar.set(this, () => null);
                _baz.set(this, () => null);
            }
            method() {
                const a = new A();
                const e3 = <__classPrivateFieldGet(a, _Foo_1) />; // Error: shadowed
                const b = new B();
                const e4 = <__classPrivateFieldGet(b, _Foo_1) />; // Error: not a constructor
                const e5 = <__classPrivateFieldGet(b, _Bar) />;
                const e6 = <__classPrivateFieldGet(this, _Bar) />;
                const e7 = <__classPrivateFieldGet(b, _baz) />;
            }
        }
        _Foo_1 = new WeakMap(), _Bar = new WeakMap(), _baz = new WeakMap();
        const b = new B();
        const e8 = <__classPrivateFieldGet(b, _Foo) />; // OK, is A's #foo
        const e9 = <b. />; // Error: not accessible
    }
}
_Foo = new WeakMap();
