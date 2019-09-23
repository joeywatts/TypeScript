//// [privateNameFieldCallExpression.ts]
class A {
    #fieldFunc = function() { this.x = 10; };
    #fieldFunc2 = function(a, ...b) {};
    x = 1;
    test() {
        this.#fieldFunc();
        const func = this.#fieldFunc;
        func();
        new this.#fieldFunc();

        const arr = [ 1, 2 ];
        this.#fieldFunc2(0, ...arr, 3);
        const b = new this.#fieldFunc2(0, ...arr, 3);
        const str = this.#fieldFunc2`head${1}middle${2}tail`;
    }
}


//// [privateNameFieldCallExpression.js]
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _fieldFunc, _fieldFunc2;
class A {
    constructor() {
        _fieldFunc.set(this, function () { this.x = 10; });
        _fieldFunc2.set(this, function (a, ...b) { });
        this.x = 1;
    }
    test() {
        __classPrivateFieldGet(this, _fieldFunc).call(this);
        const func = __classPrivateFieldGet(this, _fieldFunc);
        func();
        new (__classPrivateFieldGet(this, _fieldFunc))();
        const arr = [1, 2];
        __classPrivateFieldGet(this, _fieldFunc2).call(this, 0, ...arr, 3);
        const b = new (__classPrivateFieldGet(this, _fieldFunc2))(0, ...arr, 3);
        const str = __classPrivateFieldGet(this, _fieldFunc2) `head${1}middle${2}tail`;
    }
}
_fieldFunc = new WeakMap(), _fieldFunc2 = new WeakMap();
