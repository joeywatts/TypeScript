//// [privateNameDestructuringAssignment.ts]
class Test {
    #myPropDefault = 23;
    #myProp: number;
    constructor() {
        ({ value: this.#myProp } = { value: 10 });
        ({ something: this.#myProp } = { something: this.#myPropDefault });
    }
}


//// [privateNameDestructuringAssignment.js]
var _classPrivateFieldSet = function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };
var _classPrivateFieldGet = function (receiver, privateMap) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return privateMap.get(receiver); };
var Test = /** @class */ (function () {
    function Test() {
        _myPropDefault.set(this, void 0);
        _myProp.set(this, void 0);
        _classPrivateFieldSet(this, _myPropDefault, 23);
        ({ set value(x) { return _classPrivateFieldSet(this, _myProp, x); } }.value = { value: 10 }.value);
        ({ set value(x) { return _classPrivateFieldSet(this, _myProp, x); } }.value = { something: _classPrivateFieldGet(this, _myPropDefault) }.something);
    }
    return Test;
}());
var _myPropDefault = new WeakMap;
var _myProp = new WeakMap;
