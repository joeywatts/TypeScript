//// [privateNameInLhsReceiverExpression.ts]
class Test {
    #y = 123;
    static something(obj: { [key: string]: Test }) {
        obj[(new class { #x = 1; readonly s = "prop"; }).s].#y = 1;
        obj[(new class { #x = 1; readonly s = "prop"; }).s].#y += 1;
    }
}



//// [privateNameInLhsReceiverExpression.js]
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return privateMap.get(receiver); };
var _y;
var Test = /** @class */ (function () {
    function Test() {
        _y.set(this, void 0);
        __classPrivateFieldSet(this, _y, 123);
    }
    Test.something = function (obj) {
        var _x, _x_1, _a;
        __classPrivateFieldSet(obj[(new (_x = new WeakMap(), /** @class */ (function () {
            function class_1() {
                _x.set(this, void 0);
                __classPrivateFieldSet(this, _x, 1);
                this.s = "prop";
            }
            return class_1;
        }()))).s], _y, 1);
        __classPrivateFieldSet(_a = obj[(new (_x_1 = new WeakMap(), /** @class */ (function () {
            function class_2() {
                _x_1.set(this, void 0);
                __classPrivateFieldSet(this, _x_1, 1);
                this.s = "prop";
            }
            return class_2;
        }()))).s], _y, __classPrivateFieldGet(_a, _y) + 1);
    };
    return Test;
}());
_y = new WeakMap();
