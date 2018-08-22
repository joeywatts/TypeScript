//// [functionValuedProperty.ts]
class A {
    #func: (x: string) => number;
    test() {
        const x = this.#func("hello");
        this.#func = function (x: string) {
            return parseInt(x);
        };
        const y = (this.#func)("test");
        (this.#func = function (x: string) {
            return 4;
        })("");
    }
}


//// [functionValuedProperty.js]
var _classPrivateFieldGet = function (receiver, privateMap) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return privateMap.get(receiver); };
var _classPrivateFieldSet = function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };
var A = /** @class */ (function () {
    function A() {
        _func.set(this, void 0);
    }
    A.prototype.test = function () {
        var x = _classPrivateFieldGet(this, _func).call(this, "hello");
        _classPrivateFieldSet(this, _func, function (x) {
            return parseInt(x);
        });
        var y = (_classPrivateFieldGet(this, _func)).call(this, "test");
        (_classPrivateFieldSet(this, _func, function (x) {
            return 4;
        }))("");
    };
    return A;
}());
var _func = new WeakMap;
