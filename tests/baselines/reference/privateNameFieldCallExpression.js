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
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var _fieldFunc, _fieldFunc2;
var A = /** @class */ (function () {
    function A() {
        _fieldFunc.set(this, function () { this.x = 10; });
        _fieldFunc2.set(this, function (a) {
            var b = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                b[_i - 1] = arguments[_i];
            }
        });
        this.x = 1;
    }
    A.prototype.test = function () {
        var _a, _b;
        __classPrivateFieldGet(this, _fieldFunc).call(this);
        var func = __classPrivateFieldGet(this, _fieldFunc);
        func();
        new (__classPrivateFieldGet(this, _fieldFunc))();
        var arr = [1, 2];
        (_a = __classPrivateFieldGet(this, _fieldFunc2)).call.apply(_a, __spreadArrays([this, 0], arr, [3]));
        var b = new ((_b = (__classPrivateFieldGet(this, _fieldFunc2))).bind.apply(_b, __spreadArrays([void 0, 0], arr, [3])))();
        var str = __classPrivateFieldGet(this, _fieldFunc2)(__makeTemplateObject(["head", "middle", "tail"], ["head", "middle", "tail"]), 1, 2);
    };
    return A;
}());
_fieldFunc = new WeakMap(), _fieldFunc2 = new WeakMap();
