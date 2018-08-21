//// [propertyUnaryMutation.ts]
class A {
    #property: number = 1;
    postfixPlusPlus() {
        this.#property++;
    }
    prefixPlusPlus() {
        ++this.#property;
    }
    prefixMinusMinus() {
        --this.#property;
    }
    postfixMinusMinus() {
        this.#property--;
    }
}


//// [propertyUnaryMutation.js]
var _classPrivateFieldGet = function (receiver, privateMap) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return privateMap.get(receiver); };
var _classPrivateFieldSet = function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };
var A = /** @class */ (function () {
    function A() {
        _property.set(this, 1);
    }
    A.prototype.postfixPlusPlus = function () {
        var _a;
        _classPrivateFieldSet(this, _property, (_a = _classPrivateFieldGet(this, _property)) + 1), _a;
    };
    A.prototype.prefixPlusPlus = function () {
        _classPrivateFieldSet(this, _property, _classPrivateFieldGet(this, _property) + 1);
    };
    A.prototype.prefixMinusMinus = function () {
        _classPrivateFieldSet(this, _property, _classPrivateFieldGet(this, _property) - 1);
    };
    A.prototype.postfixMinusMinus = function () {
        var _a;
        _classPrivateFieldSet(this, _property, (_a = _classPrivateFieldGet(this, _property)) - 1), _a;
    };
    return A;
}());
var _property = new WeakMap;
