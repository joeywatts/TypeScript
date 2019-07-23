//// [privateNameInLhsReceiverExpression.ts]
class Test {
    #y = 123;
    static something(obj: { [key: string]: Test }) {
        obj[(new class { #x = 1; readonly s = "prop"; }).s].#y = 1;
    }
}



//// [privateNameInLhsReceiverExpression.js]
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };
var _y;
var Test = /** @class */ (function () {
    function Test() {
        _y.set(this, 123);
    }
    Test.something = function (obj) {
        var _x, _a;
        __classPrivateFieldSet(obj[(new (_a = /** @class */ (function () {
                function class_1() {
                    _x.set(this, 1);
                    this.s = "prop";
                }
                return class_1;
            }()),
            _x = new WeakMap(),
            _a)).s], _y, 1);
    };
    return Test;
}());
_y = new WeakMap();
